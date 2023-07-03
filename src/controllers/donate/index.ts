import express, { Request, Response } from 'express';
import Users from '../../models/users/index';
import mercadopago from 'mercadopago';
import Donate from '../../models/donate/index';

const router = express.Router();

router.post('/donation/:userId?', async (req: Request, res: Response) => {
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

router.get('/donation/get-by-id/:donationId', async (req: Request, res: Response) => {
    const donationId = parseInt(req.params.donationId);
    const infoPayer = await Donate.findOne({ transactionID: donationId })
    if (!infoPayer) {
        return res.status(404).send({ error: 'Doação não encontrada' });
    }
    try {
        mercadopago.configure({
            access_token: process.env.access_token_prd as string
        });
        const payment = await mercadopago.payment.get(donationId);

        res.status(200).send({ donation: payment, infoPayer });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.get('/donation/get-by-user-id/:userId', async (req, res) => {
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

        // Configure o acesso ao MercadoPago
        mercadopago.configure({
            access_token: process.env.access_token_prd as string
        });

        for (const donationId of donationIds.slice(startIndex, endIndex)) {
            try {
                const payment = await mercadopago.payment.get(donationId);
                donations.push(payment);
            } catch (error) {
                console.error(`Error retrieving payment for donation ID ${donationId}:`, error);
                donations.push({ error: `Error retrieving payment for donation ID ${donationId}` });
            }
        }

        res.json({
            donations,
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
router.get('/donation/get-all', async (req, res) => {
    const { page, perPage } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const itemsPerPage = parseInt(perPage as string) || 10;

    try {
        const donations = await Donate.find();
        const donationIds = donations.map(donation => donation.transactionID);
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
                totalData
            });
        }

        // Configure o acesso ao MercadoPago
        mercadopago.configure({
            access_token: process.env.access_token_prd as string
        });

        const donationPromises = donationIds
            .map(async donationId => {
                try {
                    const payment = await mercadopago.payment.get(donationId);
                    const infoPayer = await Donate.findOne({ transactionID: donationId });
                    if (!infoPayer) {
                        console.error(`Information for donation ID ${donationId} not found.`);
                        return { error: `Information for donation ID ${donationId} not found.` };
                    }
                    return {
                        ...payment,
                        infoPayer
                    };
                } catch (error) {
                    console.error(`Error retrieving payment for donation ID ${donationId}:`, error);
                    return { error: `Error retrieving payment for donation ID ${donationId}` };
                }
            });

        let donationsResult = await Promise.all(donationPromises);
        donationsResult = donationsResult.filter(donationResult => {
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
            totalData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
