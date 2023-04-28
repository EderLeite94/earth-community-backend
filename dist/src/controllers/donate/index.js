"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../models/users/index"));
const mercadopago_1 = __importDefault(require("mercadopago"));
const router = express_1.default.Router();
router.post('/donation/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await index_1.default.findById(userId);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        mercadopago_1.default.configure({
            access_token: process.env.access_token_prd
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
        const payment = await mercadopago_1.default.payment.create(payment_data);
        // Salvando o ID da doação no array donationIds do documento do usuário
        await index_1.default.findByIdAndUpdate(userId, { $push: { donationIds: payment.body.id } });
        res.status(200).send(payment);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map