import express, { Express } from "express";
import productRoutes from "./api/v1/routes/productRoutes";
 
const app: Express = express();
 
app.use(express.json());
 
// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});
 
app.use("/api/v1", productRoutes);
 
export default app;