import express, { Request, Response } from 'express';
import Users from '../../models/users/index';
import mercadopago from 'mercadopago';

const router = express.Router();

router.post('/donation/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        mercadopago.configure({
            access_token: process.env.access_token_prd as string
        });

        const { transaction_amount, description, email, first_name, last_name } = req.body;

        const payment_data = {
            transaction_amount,
            description,
            payment_method_id: "pix",
            payer: {
                email,
                first_name,
                last_name
            },
            notification_url: "https://www.seu-site.com/notificacoes/mercado-pago",
            installments: 1,
        };

        const payment = await mercadopago.payment.create(payment_data);

        // Salvando o ID da doação no array donationIds do documento do usuário
        await Users.findByIdAndUpdate(userId, { $push: { donationIds: payment.body.id } });
        // await Users.findByIdAndUpdate(userId, {$push:{donationIds: payment.body.ticket_url}})
        res.status(200).send(payment);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
router.get('/payment/:paymentId/status', async (req: Request, res: Response) => {
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
