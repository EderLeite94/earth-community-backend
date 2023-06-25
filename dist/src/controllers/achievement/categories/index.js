"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoints = exports.TechnologyInnovation = exports.Sports = exports.HumanRights = exports.ChildrenAdolescents = exports.Education = exports.Elderly = exports.Environment = exports.Pets = exports.Health = exports.ArtsCulture = exports.FirstPass = void 0;
const index_1 = __importDefault(require("../../../models/users/index"));
const group_1 = __importDefault(require("../../../models/group"));
async function FirstPass(id) {
    try {
        const user = await index_1.default.findOne({ _id: id });
        if (user) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.FirstPass = FirstPass;
async function ArtsCulture(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Artes e Cultura'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.ArtsCulture = ArtsCulture;
async function Health(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Saúde'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.Health = Health;
async function Pets(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Proteção aos Animais'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.Pets = Pets;
async function Environment(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Meio Ambiente'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.Environment = Environment;
async function Elderly(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Apoio aos Idosos'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.Elderly = Elderly;
async function Education(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Educação'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.Education = Education;
async function ChildrenAdolescents(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Crianças e Adolescentes'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.ChildrenAdolescents = ChildrenAdolescents;
async function HumanRights(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Direitos Humanos'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.HumanRights = HumanRights;
async function Sports(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Esportes'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.Sports = Sports;
async function TechnologyInnovation(id) {
    try {
        const users = await group_1.default.findOne({ 'members.user._id': id });
        const userCount = await group_1.default.countDocuments({
            'members.user._id': id,
            'category': 'Tecnologia e Inovação Social'
        });
        if (userCount >= 1) {
            return { completed: true };
        }
        else {
            return { completed: false };
        }
    }
    catch (error) {
        throw error;
    }
}
exports.TechnologyInnovation = TechnologyInnovation;
exports.endpoints = {
    FirstPass,
    ArtsCulture,
    Health,
    Pets,
    Environment,
    Elderly,
    Education,
    ChildrenAdolescents,
    HumanRights,
    Sports,
    TechnologyInnovation
};
//# sourceMappingURL=index.js.map