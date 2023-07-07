"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../models/users/index"));
const mercadopago_1 = __importDefault(require("mercadopago"));
const index_2 = __importDefault(require("../../models/donate/index"));
const date_1 = require("../../utils/date");
const index_3 = require("../../utils/hidden_cpf/index");
const router = express_1.default.Router();
router.post('/donation/:userId?', async (req, res) => {
    const userId = req.params.userId;
    const { transaction_amount, description, payer, address } = req.body;
    const { email, first_name, last_name, identification, type, number } = payer;
    const { zip_code, street_name, street_number, neighborhood, city, federal_unit } = address;
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
        const payment = await mercadopago_1.default.payment.create(payment_data);
        const donate = {
            transactionID: payment.body.id,
            transaction_amount,
            description,
            payment_method_id: "pix",
            donateCreateDate: date_1.now,
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
        await index_2.default.create(donate);
        if (userId) {
            await index_1.default.findByIdAndUpdate(userId, { $push: { donationIds: payment.body.id } });
        }
        res.status(200).send(payment);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.get('/donation/get-by-id/:donationId', async (req, res) => {
    const donationId = parseInt(req.params.donationId);
    const infoPayer = await index_2.default.findOne({ transactionID: donationId });
    if (!infoPayer) {
        return res.status(404).send({ error: 'Doação não encontrada' });
    }
    try {
        mercadopago_1.default.configure({
            access_token: process.env.access_token_prd
        });
        const payment = await mercadopago_1.default.payment.get(donationId);
        const _a = infoPayer.payer.identification, { number } = _a, identificationWithoutNumber = __rest(_a, ["number"]);
        const formattedInfoPayer = Object.assign(Object.assign({}, infoPayer.toObject()), { payer: Object.assign(Object.assign({}, infoPayer.payer), { identification: Object.assign(Object.assign({}, identificationWithoutNumber), { partialCPF: (0, index_3.formatCpf)(infoPayer.payer.identification.number) }) }) });
        res.status(200).send({ donation: payment, infoPayer: formattedInfoPayer });
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
        let approvedAmount = 0; // Variável para armazenar o valor total das doações aprovadas
        let inProcessAmount = 0; // Variável para armazenar o valor total das doações em processo
        let cancelledAmount = 0; // Variável para armazenar o valor total das doações canceladas
        let pendingCount = 0; // Variável para contar o número de doações pendentes
        let totalAmountDonated = 0; // Variável para armazenar o valor total das doações em BRL
        // Configure o acesso ao MercadoPago  
        mercadopago_1.default.configure({
            access_token: process.env.access_token_prd
        });
        for (const donationId of donationIds.slice(startIndex, endIndex)) {
            try {
                const paymentResponse = await mercadopago_1.default.payment.get(donationId);
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
                        pendingCount++;
                        break;
                }
            }
            catch (error) {
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
                pendingCount,
                totalAmountDonated: Number(totalAmountDonated.toFixed(2)),
            },
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
router.get('/donation/get-all', async (req, res) => {
    const { page, perPage } = req.query;
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;
    try {
        const donations = await index_2.default.find();
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
        mercadopago_1.default.configure({
            access_token: process.env.access_token_prd,
        });
        const donationPromises = donationIds.map(async (donationId) => {
            try {
                const payment = await mercadopago_1.default.payment.get(donationId);
                const infoPayer = await index_2.default.findOne({ transactionID: donationId });
                if (!infoPayer) {
                    console.error(`Information for donation ID ${donationId} not found.`);
                    return { error: `Information for donation ID ${donationId} not found.` };
                }
                const _a = infoPayer.payer.identification, { number } = _a, identificationWithoutNumber = __rest(_a, ["number"]);
                // Format CPF number
                const formattedInfoPayer = Object.assign(Object.assign({}, infoPayer.toObject()), { payer: Object.assign(Object.assign({}, infoPayer.payer), { identification: Object.assign(Object.assign({}, identificationWithoutNumber), { partialCPF: (0, index_3.formatCpf)(infoPayer.payer.identification.number) }) }) });
                return Object.assign(Object.assign({}, payment), { infoPayer: formattedInfoPayer });
            }
            catch (error) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map