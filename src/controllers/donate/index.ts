import express, { Request, Response } from 'express';
import Users from '../../models/users/index';
import mercadopago from 'mercadopago';
import Donate from '../../models/donate/index';

const router = express.Router();

router.post('/donation/:userId?', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { transaction_amount, description, payer, address } = req.body;
    const { email, first_name, last_name } = payer;
    const { zip_code, street_name, street_number, neighborhood, city, federal_unit, type, number } = address;
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
                    number
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
            transaction_id: payment.body.id,
            transaction_amount,
            description,
            payment_method_id: "pix",
            payer: {
                user_id: userId || null,
                email,
                first_name,
                last_name,
                identification: {
                    type,
                    number
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
    try {
        mercadopago.configure({
            access_token: process.env.access_token_prd as string
        });
        const payment = await mercadopago.payment.get(donationId);
        res.status(200).send(payment);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.get('/donation/get-by-user-id/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const donationIds = user.donationIds;
        const donations = [];

        // Configure o acesso ao MercadoPago
        mercadopago.configure({
            access_token: process.env.access_token_prd as string
        });

        for (const donationId of donationIds) {
            try {
                const payment = await mercadopago.payment.get(donationId);
                donations.push(payment);
            } catch (error) {
                console.error(`Error retrieving payment for donation ID ${donationId}:`, error);
                donations.push({ error: `Error retrieving payment for donation ID ${donationId}` });
            }
        }
        if (donations.length === 0) {
            return res.json({ error: 'Usuário não efetuou doação!' });
        }
        res.json({ donations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;
