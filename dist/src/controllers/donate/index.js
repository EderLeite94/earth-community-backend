"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../models/users/index"));
const mercadopago_1 = __importDefault(require("mercadopago"));
const router = express_1.default.Router();
router.post('/donation/:userId?', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { transaction_amount, description, payer, address } = req.body;
        const { email, first_name, last_name } = payer;
        const { zip_code, street_name, street_number, neighborhood, city, federal_unit, type, number } = address;
        if (userId) {
            const user = await index_1.default.findById(userId);
            if (!user) {
                return res.status(404).send('Usuário não encontrado');
            }
        }
        mercadopago_1.default.configure({
            access_token: process.env.access_token_prd
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
        const payment = await mercadopago_1.default.payment.create(payment_data);
        if (userId) {
            await index_1.default.findByIdAndUpdate(userId, { $push: { donationIds: payment.body.id } });
        }
        res.status(200).send(payment);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.get('/payment/status/:paymentId', async (req, res) => {
    const paymentId = parseInt(req.params.paymentId);
    try {
        mercadopago_1.default.configure({
            access_token: process.env.access_token_prd
        });
        const payment = await mercadopago_1.default.payment.get(paymentId);
        res.status(200).send(payment);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map