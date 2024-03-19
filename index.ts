import express, { Express } from "express";
import dotenv from "dotenv";
import { connect as connectDatabase } from "./config/database";
import clientRoutes from "./routes/client/index.route";

dotenv.config();
connectDatabase();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

// Routes
clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});