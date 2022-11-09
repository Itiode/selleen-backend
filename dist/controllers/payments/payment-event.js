"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEvent = void 0;
const config_1 = __importDefault(require("config"));
const axios_1 = __importDefault(require("axios"));
const payment_event_1 = __importDefault(require("../../models/payment-event"));
const processEvent = async (req, res, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const secretHash = config_1.default.get("flutterwaveSecretHash");
        const signature = req.headers["verif-hash"];
        if (!signature || signature !== secretHash) {
            return res.status(401).end();
        }
        const payload = req.body;
        // Event exists and status hasn't changed. Discard request.
        const existingEvent = await payment_event_1.default.findOne({ id: payload.id });
        if (existingEvent && existingEvent.status === payload.status) {
            return res.status(200).end();
        }
        res.status(200).end();
        // Event exists and status has changed. Update.
        if (existingEvent && existingEvent.status !== payload.status) {
            await payment_event_1.default.updateOne({ id: payload.id }, { status: payload.status });
        }
        if (!existingEvent) {
            await new payment_event_1.default({
                id: payload === null || payload === void 0 ? void 0 : payload.id,
                eventType: payload["event.type"],
                txRef: payload === null || payload === void 0 ? void 0 : payload.txRef,
                flwRef: payload === null || payload === void 0 ? void 0 : payload.flwRef,
                amount: payload === null || payload === void 0 ? void 0 : payload.amount,
                chargedAmount: payload === null || payload === void 0 ? void 0 : payload.charged_amount,
                status: payload === null || payload === void 0 ? void 0 : payload.status,
                customer: {
                    id: (_a = payload === null || payload === void 0 ? void 0 : payload.customer) === null || _a === void 0 ? void 0 : _a.id,
                    fullName: (_b = payload === null || payload === void 0 ? void 0 : payload.customer) === null || _b === void 0 ? void 0 : _b.fullName,
                    phoneNumber: (_c = payload === null || payload === void 0 ? void 0 : payload.customer) === null || _c === void 0 ? void 0 : _c.phone,
                    email: (_d = payload === null || payload === void 0 ? void 0 : payload.customer) === null || _d === void 0 ? void 0 : _d.email,
                    createdAt: (_e = payload === null || payload === void 0 ? void 0 : payload.customer) === null || _e === void 0 ? void 0 : _e.createdAt,
                },
                entity: {
                    accountNumber: (_f = payload === null || payload === void 0 ? void 0 : payload.entity) === null || _f === void 0 ? void 0 : _f.account_number,
                    firstName: (_g = payload === null || payload === void 0 ? void 0 : payload.entity) === null || _g === void 0 ? void 0 : _g.first_name,
                    lastName: (_h = payload === null || payload === void 0 ? void 0 : payload.entity) === null || _h === void 0 ? void 0 : _h.last_name,
                    createdAt: (_j = payload === null || payload === void 0 ? void 0 : payload.entity) === null || _j === void 0 ? void 0 : _j.createdAt,
                },
            }).save();
        }
        // Event exists and status has changed to successful,
        // or a new event with successful status. Give value.
        if ((existingEvent &&
            existingEvent.status !== "successful" &&
            payload.status === "successful") ||
            (!existingEvent && payload.status === "successful")) {
            const userId = payload.txRef.split("USER_ID=")[1];
            const url = `${config_1.default.get("appApiUrl")}orders/place-order/${userId}`;
            await (0, axios_1.default)({
                url,
                method: "post",
                headers: {
                    "x-endpoint-call-hash": config_1.default.get("internalEndpointSecretHash"),
                },
            });
        }
    }
    catch (e) {
        next(new Error("Error in processing payment event: " + e));
    }
};
exports.processEvent = processEvent;
