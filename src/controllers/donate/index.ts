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
            trnansaction_id: payment.body.id,
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

router.get('/payment/status/:paymentId', async (req: Request, res: Response) => {
    const paymentId = parseInt(req.params.paymentId);
    try {
        mercadopago.configure({
            access_token: process.env.access_token_prd as string
        });
        const payment = await mercadopago.payment.get(paymentId);
        res.status(200).send(payment);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

export default router;
