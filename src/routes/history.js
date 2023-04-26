import express from "express";
import { addHistory, getHistories } from "../controllers/history.js";
const router = express.Router();

router.route("/").get(getHistories);
router.route("/api/:id(\\w{32})").post(addHistory);

export default router;
