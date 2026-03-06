import express from "express";
import { getActiveCartForUser } from "../services/cartService";
import validateJWT from "../middlewares/validateJWT";

const router = express.Router();

router.get("/", validateJWT, async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userId = req.user._id;
   
    // get Active Cart For User
    const cart = await getActiveCartForUser({ userId });
    res.status(200).send(cart);
});

export default router;