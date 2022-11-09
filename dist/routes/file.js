"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_1 = require("../controllers/file");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.default)();
router.get("/upload-url", auth_1.default, file_1.getFileUploadURL);
exports.default = router;
