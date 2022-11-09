"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const shared_1 = require("../schemas/shared");
const schema = new mongoose_1.Schema({
    initiator: {
        adminId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
        name: { type: shared_1.NameSchema, required: true },
    },
    type: {
        type: String,
        enum: [
            "ApprovedShop",
            "DisapprovedShop",
            "SuspendedShop",
            "ApprovedProduct",
            "DisapprovedProduct",
        ],
        required: true,
    },
    phrase: { type: String, trim: true, maxlength: 100, required: true },
    entityId: { type: String, trim: true, maxlength: 24, required: true },
    comment: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });
function getModel(actionCategory) {
    if (actionCategory === "Shop")
        return mongoose_1.default.model("Admin-Shop-Action", schema);
    else if (actionCategory === "Product")
        return mongoose_1.default.model("Admin-Product-Action", schema);
    else
        return mongoose_1.default.model("Admin-User-Action", schema);
}
exports.getModel = getModel;
