import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: string = process.env.PORT || "5000";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`[server]: Server is running on http://localhost: ${port}`);
});
