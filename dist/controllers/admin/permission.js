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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPermissions = exports.createPermission = void 0;
const permission_1 = __importStar(require("../../models/admin/permission")), fromPermission = permission_1;
const admin_1 = __importDefault(require("../../models/admin/admin"));
const createPermission = async (req, res, next) => {
    try {
        const { error } = fromPermission.validateCreatePermissionData(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { name } = req.body;
        const foundPermissn = await permission_1.default.findOne({ name });
        if (foundPermissn)
            return res
                .status(400)
                .send({ message: "A permission with this name exists already" });
        new permission_1.default({ name }).save();
        res.status(201).send({ message: "Permission created successfully" });
    }
    catch (e) {
        next(new Error("Error in creating permission: " + e));
    }
};
exports.createPermission = createPermission;
const addPermissions = async (req, res, next) => {
    try {
        const { error } = fromPermission.validateAddPermissionsData(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const { names, adminId } = req.body;
        const foundAdmin = await admin_1.default.findById(adminId);
        if (!foundAdmin)
            return res.status(404).send({ message: "No admin with the given ID" });
        const added = [];
        const notAdded = [];
        for (let name of names) {
            const foundPermissn = await permission_1.default.findOne({ name }).select("_id");
            if (foundPermissn) {
                added.push(name);
            }
            else {
                notAdded.push(name);
            }
        }
        await admin_1.default.updateOne({ _id: adminId }, { $addToSet: { permissions: { $each: added } } });
        const message = `Added (${added.length}): ${added.join(", ")}. Couldn't add (${notAdded.length}): ${notAdded.join(", ")}.`;
        res.status(200).send({ message });
    }
    catch (e) {
        next(new Error("Error in adding permission(s): " + e));
    }
};
exports.addPermissions = addPermissions;
