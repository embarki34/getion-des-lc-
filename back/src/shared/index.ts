import express from "express";
import { container } from "../identity/infrastructure/config/DIContainer";
import { createAuthRoutes } from "../identity/infrastructure/express/routes/auth.routes";
import userRouter from "../identity/infrastructure/express/routes/user-route";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 6000;

const authController = container.getAuthenticationController();
const userController = container.getUserController();
const authMiddleware = container.getAuthenticationMiddleware();

app.use("/api/v1/auth", createAuthRoutes(authController, authMiddleware));
app.use("/api/v1/user", userRouter);
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.listen(PORT, () => {
  console.log(`the app is running on port: ${PORT}`);
});
