import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/user", userRoutes);

export default app;
