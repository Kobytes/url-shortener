import { Router } from "express";
import { UrlController } from "../controllers/urlController";

const router = Router();
const urlController = new UrlController();

router.post("/shorten", urlController.shortenUrl);
router.get("/:slug", urlController.redirectToOriginalUrl);

export default router;
