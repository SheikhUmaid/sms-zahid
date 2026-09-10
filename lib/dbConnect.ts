import mongoose from "mongoose";
import net from "net";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/student_management_db";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

function isMongoDbReachable(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      let host = "127.0.0.1";
      let port = 27017;

      if (MONGODB_URI.includes("://")) {
        const parts = MONGODB_URI.split("://")[1].split("/")[0].split("@").pop()?.split(":");
        if (parts && parts[0]) host = parts[0];
        if (parts && parts[1]) port = Number(parts[1]);
      }

      const socket = net.createConnection({ host, port, timeout: 300 });
      socket.on("connect", () => {
        socket.end();
        resolve(true);
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve(false);
      });
      socket.on("error", () => {
        socket.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

export async function dbConnect(): Promise<typeof mongoose | null> {
  if (cached!.conn && mongoose.connection.readyState === 1) {
    return cached!.conn;
  }

  const reachable = await isMongoDbReachable();
  if (!reachable) {
    return null;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 1000,
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn("MongoDB connection error:", err.message);
        cached!.promise = null;
        return null;
      });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
