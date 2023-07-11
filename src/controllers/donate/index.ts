import express, { Request, Response } from 'express';
import Users from '../../models/users/index';
import mercadopago from 'mercadopago';
import Donate from '../../models/donate/index';
import { now } from '../../utils/date';
import { formatCpf } from '../../utils/hidden_cpf/index';
import corsMiddleware from '../../middlewares';

const router = express.Router();

router.post('/donation/:userId?', corsMiddleware, async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { transaction_amount, description, payer, address } = req.body;
  const { email, first_name, last_name, identification, type, number } = payer;
  const { zip_code, street_name, street_number, neighborhood, city, federal_unit } = address;
  try {

    if (userId) {
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).send('Usuário não encontrado');
      }
    }

    mercadopago.configure({
      access_token: process.env.access_token_prd as string
    });

    const payment_data = {
      transaction_amount,
      description,
      payment_method_id: "pix",
      payer: {
        email,
        first_name,
        last_name,
        identification: {
          type,
          number,
        },
        address: {
          zip_code,
          street_name,
          street_number,
          neighborhood,
          city,
          federal_unit,
        }
      },
      notification_url: "https://www.seu-site.com/notificacoes/mercado-pago",
      installments: 1,
    };
    const payment = await mercadopago.payment.create(payment_data);
    const donate = {
      transactionID: payment.body.id,
      transaction_amount,
      description,
      payment_method_id: "pix",
      donateCreateDate: now,
      payer: {
        user_id: userId || null,
        email,
        first_name,
        last_name,
        identification: {
          type: identification.type,
          number: identification.number,
        },
        address: {
          zip_code,
          street_name,
          street_number,
          neighborhood,
          city,
          federal_unit,
        }
      },
    };
    await Donate.create(donate);
    if (userId) {
      await Users.findByIdAndUpdate(userId, { $push: { donationIds: payment.body.id } });
    }
    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/donation/get-by-id/:donationId', corsMiddleware, async (req: Request, res: Response) => {
  const donationId = parseInt(req.params.donationId);
  const infoPayer = await Donate.findOne({ transactionID: donationId });

  if (!infoPayer) {
    return res.status(404).send({ error: 'Doação não encontrada' });
  }

  try {
    mercadopago.configure({
      access_token: process.env.access_token_prd as string
    });

    const payment = await mercadopago.payment.get(donationId);
    const { number, ...identificationWithoutNumber } = infoPayer.payer.identification;

    const formattedInfoPayer = {
      ...infoPayer.toObject(),
      payer: {
        ...infoPayer.payer,
        identification: {
          ...identificationWithoutNumber,
          partialCPF: formatCpf(infoPayer.payer.identification.number)
        }
      }
    };

    res.status(200).send({ donation: payment, infoPayer: formattedInfoPayer });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
router.get('/donation/get-by-user-id/:userId', corsMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const { page, perPage } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const itemsPerPage = parseInt(perPage as string) || 10;

  try {
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const donationIds = user.donationIds;
    const totalPages = Math.ceil(donationIds.length / itemsPerPage);
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = pageNumber * itemsPerPage;

    const donations = [];
    let approvedAmount = 0;
    let inProcessAmount = 0;
    let cancelledAmount = 0;
    let pendingAmount = 0;
    let totalAmountDonated = 0;

    // Configure o acesso ao MercadoPago  
    mercadopago.configure({
      access_token: process.env.access_token_prd as string
    });

    for (const donationId of donationIds.slice(startIndex, endIndex)) {
      try {
        const paymentResponse = await mercadopago.payment.get(donationId);
        const payment = paymentResponse.body;
        donations.push(payment);

        switch (payment.status) {
          case 'approved':
            approvedAmount++;
            totalAmountDonated += parseFloat(payment.transaction_amount);
            break;
          case 'in_process':
            inProcessAmount++;
            break;
          case 'cancelled':
            cancelledAmount++;
            break;
          case 'pending':
            pendingAmount++;
            break;
        }
      } catch (error) {
        console.error(`Error retrieving payment for donation ID ${donationId}:`, error);
        donations.push({ error: `Error retrieving payment for donation ID ${donationId}` });
      }
    }

    // Ordenar as doações pelo campo "date_approved" de forma decrescente
    donations.sort((a, b) => new Date(b.date_approved).getTime() - new Date(a.date_approved).getTime());

    res.json({
      donations,
      info: {
        approvedAmount,
        inProcessAmount,
        cancelledAmount,
        pendingAmount,
        totalAmountDonated: Number(totalAmountDonated.toFixed(2)),
      },
      page: pageNumber,
      perPage: itemsPerPage,
      totalPages,
      totalData: donationIds.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/donation/get-all', corsMiddleware, async (req: Request, res: Response) => {
  const { page, perPage } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const itemsPerPage = parseInt(perPage as string) || 10;

  try {
    const donations = await Donate.find();
    const donationIds = donations.map((donation) => donation.transactionID);
    const totalData = donationIds.length;
    const totalPages = Math.ceil(totalData / itemsPerPage);
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = pageNumber * itemsPerPage;

    if (totalData === 0) {
      return res.json({
        donations: [],
        page: pageNumber,
        perPage: itemsPerPage,
        totalPages,
        totalData,
      });
    }

    // Configure access to MercadoPago
    mercadopago.configure({
      access_token: process.env.access_token_prd as string,
    });

    const donationPromises = donationIds.map(async (donationId) => {
      try {
        const payment = await mercadopago.payment.get(donationId);
        const infoPayer = await Donate.findOne({ transactionID: donationId });

        if (!infoPayer) {
          console.error(`Information for donation ID ${donationId} not found.`);
          return { error: `Information for donation ID ${donationId} not found.` };
        }


        const { number, ...identificationWithoutNumber } = infoPayer.payer.identification;

        // Format CPF number
        const formattedInfoPayer = {
          ...infoPayer.toObject(),
          payer: {
            ...infoPayer.payer,
            identification: {
              ...identificationWithoutNumber,
              partialCPF: formatCpf(infoPayer.payer.identification.number),
            },
          },
        };

        return {
          ...payment,
          infoPayer: formattedInfoPayer,
        };
      } catch (error) {
        console.error(`Error retrieving payment for donation ID ${donationId}:`, error);
        return { error: `Error retrieving payment for donation ID ${donationId}` };
      }
    });

    let donationsResult = await Promise.all(donationPromises);
    donationsResult = donationsResult.filter((donationResult) => {
      if ('status' in donationResult) {
        return donationResult.body.status === 'approved';
      }
      return false;
    });

    const slicedDonations = donationsResult.slice(startIndex, endIndex);

    res.json({
      donations: slicedDonations,
      page: pageNumber,
      perPage: itemsPerPage,
      totalPages,
      totalData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
