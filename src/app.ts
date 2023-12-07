import dotEnv from "dotenv";
dotEnv.config();
import { AppDataSource } from "./data-source";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import expressFileUpload from "express-fileupload";
import path from "path";
import swaggerUI, { SwaggerOptions } from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

//router
import indexRouter from "./routes/index";


const app: Express = express();

//initiate database connection
AppDataSource.initialize().then(() => {
    //swagger config
    const swaggerOptions: SwaggerOptions = {
        swaggerDefinition: {
            info: {
                title: "NodeTS Example",
                description: "NodeTS API documentation.",
                contact: {
                    name: "Aman Dewett",
                    email: "amandewett@gmail.com"
                },
                servers: [
                    `${process.env.MY_HOST}`,
                ]
            },
            securityDefinitions: {
                Bearer: {
                    type: "apiKey",
                    name: "Authorization",
                    in: "header"
                }
            }
        },
        apis: ["**/*.ts"]
    };

    app.use(express.json({
        limit: '10mb'
    }));
    app.use(expressFileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    }));
    const staticDir = path.join(__dirname, "public");
    app.use(express.static(staticDir));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(function (req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        req.headers["x-forward-for"];
        next();
    });
    app.use(morgan("dev"));
    app.use("/api", indexRouter);

    //swagger initialization
    const swaggerDocument = swaggerJSDoc(swaggerOptions);
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
        console.log(err.message, err);
    });

    app.get("*", function (req: Request, res: Response) {
        res.json({
            status: false,
            error: "Error 404",
        });
    });

    app.listen(process.env.PORT, function () {
        console.log(`TypeORM's connection created successfully`);
        console.log(`Server Started with ${process.env.ENV} environment at ${process.env.PORT} port`);
    });
}).catch(error => console.log(`TypeORM init error: ${error}`));


export default app;