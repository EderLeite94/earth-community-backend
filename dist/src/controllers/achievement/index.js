"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./firstpass/index");
const router = express_1.default.Router();
router.post('/achievement/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const FirstPass = await (0, index_1.firstPass)(id);
        return res.status(200).json({
            FirstPass
        });
    }
    catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map