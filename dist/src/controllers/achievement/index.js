"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./firstpass/index");
const father_mother_pet_1 = require("./father-mother-pet");
const arts_culture_1 = require("./arts-culture");
const education_1 = require("./education");
const environment_1 = require("./environment");
const health_1 = require("./health");
const router = express_1.default.Router();
router.post('/achievement/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const firstpass = await (0, index_1.firstPass)(id);
        const artsculture = await (0, arts_culture_1.ArtsCulture)(id);
        const education = await (0, education_1.Education)(id);
        const environment = await (0, environment_1.Environment)(id);
        const petInfo = await (0, father_mother_pet_1.Pets)(id);
        const health = await (0, health_1.Health)(id);
        const response = [
            { completed: firstpass.completed },
            { completed: artsculture.completed },
            { completed: education.completed },
            { completed: environment.completed },
            { completed: petInfo.completed },
            { completed: health.completed }
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