import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMongo } from "./services/mongo.js";
import { router } from "./routes.js";
import { errorHandler } from "./middlewares/error-handler.js";

const port = process.env.PORT || "5000";
const jsonParser = express.json();
const urlEncodedParser = express.urlencoded({ extended: false });

const app: Express = express();

app.use(cors());
app.use(jsonParser);
app.use(cookieParser());
app.use(urlEncodedParser);
app.use(morgan("common"));

app.use(router);
app.use(errorHandler);

await connectMongo();

app.listen(port, () => {
  console.log(`[server]: Server is running on http://localhost:${port}`);
});
