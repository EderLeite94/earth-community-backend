"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../../models/users/index"));
const moment_1 = __importDefault(require("moment"));
const router = express_1.default.Router();
// Register users
router.post('/auth/user/sign-up', async (req, res) => {
    const { info, security } = req.body;
    const { firstName, surName, email } = info;
    const { password, confirmPassword } = security;
    // create password
    const salt = await bcrypt_1.default.genSalt(12);
    const passwordHash = await bcrypt_1.default.hash(password, salt);
    // Date Brazil
    const data = new Date();
    const now = new Date(data.getTime() - (3 * 60 * 60 * 1000));
    if (!firstName) {
        return res.status(400).send('O nome é obrigatorio!');
    }
    if (!surName) {
        return res.status(400).send('O sobrenome é obrigatorio!');
    }
    if (!email) {
        return res.status(400).send('O email é obrigatorio!');
    }
    if (!password) {
        return res.status(422).json({ error: 'A senha é obrigatória!' });
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'As senhas não conferem!' });
    }
    // check if email exists
    const emailExists = await index_1.default.findOne({ 'info.email': email });
    if (emailExists) {
        return res.status(422).json({ error: 'E-mail já cadastrado!' });
    }
    const user = {
        info: {
            firstName,
            surName,
            email
        },
        security: {
            password: passwordHash,
            accountCreateDate: now
        }
    };
    try {
        await index_1.default.create(user);
        res.status(201).json({
            message: 'Usuario cadastrado com sucesso!',
            user,
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error });
    }
});
//Login users
router.get('/auth/user/sign-in', async (req, res) => {
    const { info, security } = req.body;
    const { email } = info;
    const { password } = security;
    if (!email) {
        return res.status(422).json({ message: 'O e-mail é obrigatório!' });
    }
    //check if user exists
    const user = await index_1.default.findOne({ 'info.email': email });
    if (!user) {
        return res.status(404).json({ message: 'Usuário não cadastrado!' });
    }
    // check if password match
    const checkPassword = await bcrypt_1.default.compare(password, user.security.password);
    if (!checkPassword) {
        return res.status(422).json({ message: 'Senha invalida!' });
    }
    try {
        const secret = process.env.SECRET;
        const token = jsonwebtoken_1.default.sign({
            id: user.info._id,
        }, secret || '');
        res.status(200).json({
            message: 'Usuário logado com sucesso',
            token,
            user
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
    const { firstName, surName, email, dateOfBirth, phone } = info;
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