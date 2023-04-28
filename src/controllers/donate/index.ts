import express, { Request, Response } from 'express';
import mercadopago from 'mercadopago';

const router = express.Router();

router.post('/donation', async (req: Request, res: Response) => {
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

    mercadopago.payment.create(payment_data)
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function (error) {
            res.status(500).send(error);
        });

});
export default router;
