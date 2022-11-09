"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (permissionName) => {
    return (req, res, next) => {
        try {
            const hasPermissn = req.admin.permissions.find((perm) => permissionName === perm);
            if (!hasPermissn)
                return res
                    .status(403)
                    .send({ message: "Admin doesn't have the required permission" });
            next();
        }
        catch (err) {
            next(new Error("Error in determining permission: " + err.message));
        }
    };
};
