"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../models/users/index"));
const index_2 = require("../../utils/nickname/index");
const index_3 = require("../../validations/users/index");
const date_1 = require("../../utils/date");
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_4 = __importDefault(require("../../middlewares/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const group_1 = __importDefault(require("../../models/group"));
const feed_1 = __importDefault(require("../../models/feed"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
//register
router.post('/auth/user/sign-up', index_4.default, index_3.validateSignUp, async (req, res, next) => {
    try {
        const { info, security } = req.body;
        const { firstName, surname, email } = info;
        const { authWith, password, confirmPassword } = security;
        // Create password hash
        const salt = await bcrypt_1.default.genSalt(12);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        // Generate a unique nickname
        const nickname = await (0, index_2.generateUniqueNickname)(firstName, surname);
        const users = {
            info: {
                firstName,
                surname,
                email,
                nickName: nickname,
            },
            security: {
                authWith,
                password: passwordHash,
                accountCreateDate: (0, date_1.now)()
            }
        };
        // Insert user in database
        await index_1.default.create(users);
        const user = await index_1.default.findOne({ 'info.email': email });
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});
//Login users
router.post('/auth/user/sign-in', index_4.default, index_3.validateSignIn, async (req, res) => {
    const { info, security } = req.body;
    const { email } = info;
    const { password } = security;
    try {
        const user = await index_1.default.findOne({ 'info.email': email });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não cadastrado!' });
        }
        // Fetch group information based on groupIds
        const groups = await group_1.default.find({ _id: { $in: user.groupIds } });
        const secret = process.env.SECRET;
        const token = jsonwebtoken_1.default.sign({
            id: user.info._id,
        }, secret || '');
        res.status(200).json({
            message: 'Usuário autenticado!',
            token,
            user,
            groups
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
});
// Update - User
router.patch('/user/update-by-id/:id', index_4.default, async (req, res) => {
    const id = req.params.id;
    const { info, address } = req.body;
    const { nickName, firstName, surname, email, about, dateOfBirth, pictureProfile, phone } = info;
    const { city, state } = address;
    try {
        const updateUser = await index_1.default.updateOne({ _id: id }, req.body);
        const member = await group_1.default.updateOne({ 'members.user._id': id }, { $set: { 'members.$.user.info': info, 'members.$.user.address': address } });
        const createduser = await group_1.default.updateOne({ 'createdByUser.user._id': id }, { $set: { 'createdByUser.user.info': info, 'createdByUser.user.address': address } });
        const postuser = await feed_1.default.updateOne({ 'createdByUser.user._id': id }, { $set: { 'createdByUser.user.info': info, 'createdByUser.user.address': address } });
        const user = await index_1.default.findById(id);
        if (!user) {
            return res.status(422).json({ error: 'Usuário não encontrado' });
        }
        const updatedPosts = await feed_1.default.updateMany({ 'comments.user._id': new mongoose_1.default.Types.ObjectId(id) }, {
            $set: {
                'comments.$[elem].user.info.nickName': nickName,
                'comments.$[elem].user.info.firstName': firstName,
                'comments.$[elem].user.info.surname': surname,
                'comments.$[elem].user.info.email': email,
                'comments.$[elem].user.info.about': about,
                'comments.$[elem].user.info.dateOfBirth': dateOfBirth,
                'comments.$[elem].user.info.pictureProfile': pictureProfile,
                'comments.$[elem].user.info.phone': phone,
                'comments.$[elem].user.address.city': city,
                'comments.$[elem].user.address.state': state,
            }
        }, { arrayFilters: [{ 'elem.user._id': new mongoose_1.default.Types.ObjectId(id) }] });
        return res.status(200).json({
            message: 'Dados atualizados com sucesso!',
            user,
            updatedPosts
        });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
router.get('/user/get-by-nickname/:nickName', index_4.default, async (req, res) => {
    const { nickName } = req.params;
    try {
        const user = await index_1.default.findOne({ 'info.nickName': nickName });
        if (!user) {
            return res.status(404).json({ error: 'Nick não encontrado' });
        }
        res.status(200).json({
            user
        });
    }
    catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ error: error });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map