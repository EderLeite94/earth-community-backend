"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../models/users/index"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_2 = require("../../validations/users/index");
const group_1 = __importDefault(require("../../models/group"));
const router = express_1.default.Router();
//register
router.post('/auth/user/sign-up', index_2.validateSignUp, async (req, res, next) => {
    try {
        const { info, security } = req.body;
        const { firstName, surname, email } = info;
        const { authWith, password, confirmPassword } = security;
        // Create password hash
        const salt = await bcrypt_1.default.genSalt(12);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        // Get current date/time in Brazil timezone
        const data = new Date();
        const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
        const userExist = await index_1.default.findOne({ 'info.email': email });
        if (userExist) {
            return res.status(422).json({ error: 'E-mail já cadastrado!' });
        }
        const user = {
            info: {
                firstName,
                surname,
                email
            },
            security: {
                authWith,
                password: passwordHash,
                accountCreateDate: now
            }
        };
        // Insert user in database
        await index_1.default.create(user);
        console.log('User created:', user); // Log the created user
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user,
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});
//Login users
router.post('/auth/user/sign-in', async (req, res) => {
    const { info, security } = req.body;
    const { email } = info;
    const { password } = security;
    if (!email) {
        return res.status(422).json({ message: 'O e-mail é obrigatório!' });
    }
    try {
        // Check if user exists
        const user = await index_1.default.findOne({ 'info.email': email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não cadastrado!' });
        }
        // Check if password matches
        const checkPassword = await bcrypt_1.default.compare(password, user.security.password);
        if (!checkPassword) {
            return res.status(422).json({ message: 'Senha inválida!' });
        }
        // Fetch group information based on groupIds
        const groups = await group_1.default.find({ _id: { $in: user.groupIds } });
        const secret = process.env.SECRET;
        const token = jsonwebtoken_1.default.sign({
            id: user.info._id,
        }, secret || '');
        res.status(200).json({
            message: 'Usuário logado com sucesso',
            token,
            user,
            groups
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
});
// Update - User
router.patch('/user/update-by-id/:id', async (req, res) => {
    moment_1.default.locale('pt-BR');
    const id = req.params.id;
    const { info, address } = req.body;
    const { firstName, surname, email, dateOfBirth, pictureProfile, phone } = info;
    const isoDate = (0, moment_1.default)(dateOfBirth, 'DD/MM/YYYY', true).toDate();
    info.dateOfBirth = isoDate;
    const { city, state } = address;
    try {
        const updateUser = await index_1.default.updateOne({ _id: id }, req.body);
        if (updateUser.matchedCount === 0) {
            res.status(422).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Dados atualizados com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map