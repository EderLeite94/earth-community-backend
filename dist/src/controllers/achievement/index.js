"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categories_1 = require("./categories");
const router = express_1.default.Router();
router.post('/achievement/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const firstpass = await (0, categories_1.FirstPass)(id);
        const elderly = await (0, categories_1.Elderly)(id);
        const artsculture = await (0, categories_1.ArtsCulture)(id);
        const childrenadolescents = await (0, categories_1.ChildrenAdolescents)(id);
        const humanrights = await (0, categories_1.HumanRights)(id);
        const education = await (0, categories_1.Education)(id);
        const sports = await (0, categories_1.Sports)(id);
        const environment = await (0, categories_1.Environment)(id);
        const petInfo = await (0, categories_1.Pets)(id);
        const health = await (0, categories_1.Health)(id);
        const technologyinnovation = await (0, categories_1.TechnologyInnovation)(id);
        const response = [
            { completed: firstpass.completed },
            { completed: elderly.completed },
            { completed: artsculture.completed },
            { completed: childrenadolescents.completed },
            { completed: humanrights.completed },
            { completed: education.completed },
            { completed: sports.completed },
            { completed: environment.completed },
            { completed: petInfo.completed },
            { completed: health.completed },
            { completed: technologyinnovation.completed }
        ];
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({
            error: error
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map