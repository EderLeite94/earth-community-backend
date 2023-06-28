"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../models/users/index"));
const mercadopago_1 = __importDefault(require("mercadopago"));
const index_2 = __importDefault(require("../../models/donate/index"));
const router = express_1.default.Router();
router.post('/donation/:userId?', async (req, res) => {
    const userId = req.params.userId;
    const { transaction_amount, description, payer, address } = req.body;
    const { email, first_name, last_name } = payer;
    const { zip_code, street_name, street_number, neighborhood, city, federal_unit, type, number } = address;
    try {
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
        await index_2.default.create(donate);
        if (userId) {
            await index_1.default.findByIdAndUpdate(userId, { $push: { donationIds: payment.body.id } });
        }
        res.status(200).send(donate);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.get('/donation/get-by-id/:donationId', async (req, res) => {
    const donationId = parseInt(req.params.donationId);
    try {
        mercadopago_1.default.configure({
            access_token: process.env.access_token_prd
        });
        const payment = await mercadopago_1.default.payment.get(donationId);
        res.status(200).send({ donation: payment });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
router.get('/donation/get-by-user-id/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { page, perPage } = req.query;
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;
    try {
        const user = await index_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const donationIds = user.donationIds;
        const totalPages = Math.ceil(donationIds.length / itemsPerPage);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;
        const donations = [];
        // Configure o acesso ao MercadoPago
        mercadopago_1.default.configure({
            access_token: process.env.access_token_prd
        });
        for (const donationId of donationIds.slice(startIndex, endIndex)) {
            try {
                const payment = await mercadopago_1.default.payment.get(donationId);
                donations.push(payment);
            }
            catch (error) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/donation/getall', async (req, res) => {
    const { page, perPage } = req.query;
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;
    try {
        const donations = await index_2.default.find();
        console.log(donations);
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
        mercadopago_1.default.configure({
            access_token: process.env.access_token_prd
        });
        const donationPromises = donationIds
            .slice(startIndex, endIndex)
            .map(async (donationId) => {
            try {
                const payment = await mercadopago_1.default.payment.get(donationId);
                return payment;
            }
            catch (error) {
                console.error(`Error retrieving payment for donation ID ${donationId}:`, error);
                return { error: `Error retrieving payment for donation ID ${donationId}` };
            }
        });
        const donationsResult = await Promise.all(donationPromises);
        res.json({
            donations: donationsResult,
            page: pageNumber,
            perPage: itemsPerPage,
            totalPages,
            totalData
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map