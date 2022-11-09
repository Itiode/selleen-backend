import Router from "express";

import { getFileUploadURL } from "../controllers/file";

import auth from "../middleware/auth";

const router = Router();

router.get("/upload-url", auth, getFileUploadURL);

export default router;
