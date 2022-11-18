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
    try {
        const secretHash = config_1.default.get("flutterwaveSecretHash");
        const signature = req.headers["verif-hash"];
        if (!signature || signature !== secretHash) {
            return res.status(401).end();
        }
        const payload = req.body;
        // Event exists and status hasn't changed. Discard request.
        const existingEvent = await payment_event_1.default.findOne({
            id: payload?.data?.id,
        });
        if (existingEvent && existingEvent.status === payload?.data?.status) {
            return res.status(200).end();
        }
        res.status(200).end();
        // Event exists and status has changed. Update.
        if (existingEvent && existingEvent.status !== payload?.data?.status) {
            await payment_event_1.default.updateOne({ id: payload?.data?.id }, { status: payload?.data?.status });
        }
        if (!existingEvent) {
            await new payment_event_1.default({
                id: payload?.data?.id,
                eventType: payload["event.type"],
                txRef: payload?.data?.tx_ref,
                flwRef: payload?.data?.flw_ref,
                amount: payload?.data?.amount,
                chargedAmount: payload?.data?.charged_amount,
                status: payload?.data?.status,
                customer: {
                    id: payload?.data?.customer?.id,
                    fullName: payload?.data?.customer?.name,
                    phoneNumber: payload?.data?.customer?.phone_number,
                    email: payload?.data?.customer?.email,
                    createdAt: payload?.data?.customer?.created_at,
                },
            }).save();
        }
        // Event exists and status has changed to successful,
        // or a new event with successful status. Give value.
        if ((existingEvent &&
            existingEvent.status !== "successful" &&
            payload?.data?.status === "successful") ||
            (!existingEvent && payload?.data?.status === "successful")) {
            const userId = payload?.data?.tx_ref.split("USER_ID=")[1];
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
