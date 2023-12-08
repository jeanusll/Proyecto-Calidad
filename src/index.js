import { app, httpServer } from "./app.js"; // Importa tanto la app Express como el servidor HTTP con Socket.IO
import { PORT } from "./config.js";
import { connectDB } from "./db.js";

async function main() {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(
        `Server and Socket.IO are running on port http://localhost:${PORT}`
      );
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
