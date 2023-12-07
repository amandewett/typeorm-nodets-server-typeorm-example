import { Request, Response, NextFunction, Router } from "express";
import { UserService } from "../services/user.service";
const userService = new UserService();
const router = Router();
import { IRequest } from "../middleware/IRequest";
import { Authentication } from "../middleware/auth";
const auth = new Authentication();
import { Roles } from "../enums/enum";

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags:
 *     - "User"
 *     summary: register a new user
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *          description: success
 *          schema:
 *           type: object
 *     parameters:
 *       - in: body
 *         name: Keys
 *         type: object
 *         required: true
 *         properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 *          firstName:
 *              type: string
 *          lastName:
 *              type: string
 */
router.post("/register", async (req: Request, res: Response) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const result: any = await userService.registerUser(userEmail, userPassword, firstName, lastName);
    if (result.status) {
        res.json(result);
    }
    else {
        res.status(400).json(result);
    }
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags:
 *     - "User"
 *     summary: user login api
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *          description: success
 *          schema:
 *           type: object
 *     parameters:
 *       - in: body
 *         name: Keys
 *         type: object
 *         required: true
 *         properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 */
router.post("/login", async (req: Request, res: Response) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const result: any = await userService.userLogin(userEmail, userPassword);
    if (result.status) {
        res.json(result);
    }
    else {
        res.status(400).json(result);
    }
});

/**
 * @swagger
 * /api/user/details:
 *   get:
 *     tags:
 *     - "User"
 *     security:
 *      - Bearer: []
 *     summary: get user details
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *          description: success
 */
router.get("/details", auth.hasRole(Roles.User, Roles.Admin), async (req: IRequest, res: Response) => {
    const userId = req.user.id;

    const result: any = await userService.getUserDetails(+userId);
    if (result.status) {
        res.json(result);
    }
    else {
        res.status(400).json(result);
    }
});

export default router;