import express, { Express } from "express";
import { connectMongo } from "./services/mongo.js";
import { router } from "./routes.js";

const port = process.env.PORT || "5000";
const jsonParser = express.json();
const urlEncodedParser = express.urlencoded({ extended: false });

const app: Express = express();

app.use(jsonParser);
app.use(urlEncodedParser);

app.use(router);

await connectMongo();

app.listen(port, () => {
  console.log(`[server]: Server is running on http://localhost: ${port}`);
});
