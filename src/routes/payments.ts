import Router from "express";

import { getBankTransferDetails } from "../controllers/payments/bank-transfer";
import { processEvent } from "../controllers/payments/payment-event";
import auth from "../middleware/auth";

const router = Router();

router.get("/bank-transfer-details", auth, getBankTransferDetails);
router.post("/event", processEvent);

export default router;
