import { Request, Response, NextFunction, Router } from "express";
import userRouter from "./user";
const router = Router();
router.use("/user", userRouter);

/**
 * @swagger
 * /api/:
 *   get:
 *     tags:
 *     - "Default"
 *     summary: server entry point
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *          description: success
 */
router.get("/", (req: Request, res: Response) => {
    res.send("Welcome to NodeTS TypeORM server");
});

export default router;