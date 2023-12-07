import jsonWebToken from "jsonwebtoken";
import { Express, Request, Response, NextFunction } from "express";
import { IRequest } from "./IRequest";
import { UserService } from "../services/user.service";
const userService = new UserService();
import { User } from "../entity/user.entity";

export class Authentication {
    constructor() { }

    hasRole(...arrRoles: any) {
        return async (req: IRequest, res: Response, next: NextFunction) => {
            try {
                let userToken = req.headers["authorization"];

                if (!userToken) {
                    return res.status(401).send("Not Authorized!");
                }

                userToken = userToken.replace("Bearer ", "");
                const jwtPayload: any = jsonWebToken.verify(userToken, process.env.JWT_SECRET || "monday");
                const allowedRolesForRequest: string[] = Array.isArray(arrRoles) ? arrRoles : new Array(arrRoles);

                //check if role of requester is in the list of allowed roles of the request
                if (allowedRolesForRequest.indexOf(jwtPayload.role) !== -1) {
                    const result: any = await userService.getUserDetails(jwtPayload.id);
                    if (result.status) {
                        const userDetails: User = result.result;
                        req.user = userDetails;
                        next();
                    }
                    else {
                        return res.status(401).send("Not Authorized!");
                    }
                }
                else {
                    return res.status(401).send("Not Authorized!");
                }
            }
            catch (e) {
                console.log(e);
                return res.status(401).send("Not Authorized!");
            }
        }
    }
}