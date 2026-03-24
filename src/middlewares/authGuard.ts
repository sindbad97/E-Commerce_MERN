import { Request, Response, NextFunction } from "express";

const authGuard = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    next();
};

export default authGuard;
