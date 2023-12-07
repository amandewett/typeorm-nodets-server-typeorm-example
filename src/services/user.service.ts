import { Repository, Not, IsNull, DataSource } from "typeorm";
import { User } from "../entity/user.entity";
import { AppDataSource } from "../data-source";
import bCrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";

export class UserService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);
    constructor() { }

    registerUser(userEmail: string, userPassword: string, firstName: string, lastName: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                //check if user exists already
                const user: User | null = await this.userRepository.findOneBy({
                    email: userEmail
                });

                if (user) {
                    resolve({
                        status: false,
                        message: `Email already exists`
                    });
                }
                else {
                    //hash user's password
                    const hashedPassword: any = await this.hashString(userPassword);
                    if (hashedPassword.status) {
                        let userObj: User = new User();
                        userObj.email = userEmail;
                        userObj.password = hashedPassword.result;
                        userObj.firstName = firstName;
                        userObj.lastName = lastName;

                        await this.userRepository.save(userObj);

                        resolve({
                            status: true,
                            message: `User registered successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Error in hashing the password`
                        });
                    }
                }
            }
            catch (err: any) {
                console.log(err);
                reject(err);
            }
        });
    }

    userLogin(userEmail: string, userPassword: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                //check if user exists already
                const user: User | null = await this.userRepository.findOneBy({
                    email: userEmail
                });

                if (user) {
                    //compare password
                    const isPasswordVerified: any = await this.compareHashString(userPassword, user.password);
                    if (isPasswordVerified == true) {
                        //create JWT using user details
                        const jwt = jsonWebToken.sign({
                            id: user.id,
                            role: user.role,
                        },
                            process.env.JWT_SECRET || "monday",
                            {
                                expiresIn: '30 days'
                            }
                        );

                        //remove keys from final response
                        const { password, createdAt, updatedAt, ...result } = user;

                        resolve({
                            status: true,
                            message: `Welcome ${user.firstName}`,
                            token: jwt,
                            result: result
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Invalid credentials`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Invalid credentials`
                    });
                }
            }
            catch (err: any) {
                console.log(err);
                reject(err);
            }
        });
    }

    hashString(string: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                bCrypt.hash(string, 10, async (err, hashedString) => {
                    if (err) {
                        console.log(err);
                        resolve({
                            status: false,
                            error: err
                        });
                    }
                    else {
                        resolve({
                            status: true,
                            result: hashedString
                        });
                    }
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    compareHashString(string: string, hashString: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                bCrypt.compare(string, hashString, async (err, isVerified) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else {
                        if (isVerified) {
                            resolve(isVerified);
                        } else {
                            resolve(false);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    getUserDetails(userId: number) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                if (userId) {
                    const user = await this.userRepository.findOne({
                        where: {
                            id: userId
                        }
                    });

                    if (user) {
                        const { password, ...result } = user;
                        resolve({
                            status: true,
                            result: result
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `User doesn't exists`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }
}