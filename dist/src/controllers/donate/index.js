"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mercadopago_1 = __importDefault(require("mercadopago"));
const router = express_1.default.Router();
router.post('/donate', async (req, res) => {
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
    mercadopago_1.default.payment.create(payment_data)
        .then(function (data) {
        res.status(200).send(data);
    })
        .catch(function (error) {
        res.status(500).send(error);
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map