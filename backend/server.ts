import bodyParser from "body-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import http from "http";
import morgan from "morgan";
import path from "path";


import { loadConfig } from "@/common/helper/config.helper";
loadConfig();

import routes from "@/routes";
import { type IUser } from "@/user/user.dto";
import { redisClient } from "@/common/service/redis.service";
import { initPassport } from "@/common/service/passport-jwt.service";
import { initDB } from "@/common/service/database.service";
import { initBookingCron } from "@/common/cron/booking.cron";
import { globalLimiter } from "@/common/middleware/rate-limiter.middleware";
import errorHandler from "@/common/middleware/error-handler.middleware";

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(globalLimiter);
// Use process.cwd() to correctly locate uploads folder from project root
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const initApp = async (): Promise<void> => {
   

  try {
    await  initDB();
    if (redisClient.status !== "ready") {
      console.log("Waiting for Redis...");
      await new Promise((resolve) => {
        redisClient.once("ready", resolve);
      });
    }
      // passport init
  initPassport();
  
  // init cron jobs
  initBookingCron();

  // set base path to /api
  app.use("/api", routes);

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // error handler
  app.use(errorHandler);
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

void initApp();