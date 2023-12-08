import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import challengesRoutes from "./routes/challenge.routes.js";
import { __dirname } from "./libs/dirname.js";
import path from "path";
import http from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
console.log(__dirname);
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/post", postRoutes);
app.use("/api/challenge", challengesRoutes);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on("joinRoom", (chatId) => {
    console.log(`Usuario ${socket.id} se unió al chat ${chatId}`);
    socket.join(chatId);
  });
});

export { app, httpServer, io };
