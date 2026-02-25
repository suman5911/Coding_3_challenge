import express, { Router } from "express";
import * as productController from "../controllers/productController";
import { validateRequest } from "../middleware/validateRequest";
import { createProductSchema, updateProductSchema } from "../validation/productValidation";
 
const router: Router = express.Router();
 
// GET all products
router.get("/products", productController.getAllProducts);
 
// GET single product
router.get("/products/:id", productController.getProductById);
 
// POST create product
router.post(
  "/products",
  validateRequest(createProductSchema),
  productController.createProduct
);
 
// PUT update product
router.put(
  "/products/:id",
  validateRequest(updateProductSchema),
  productController.updateProduct
);
 
// DELETE product
router.delete("/products/:id", productController.deleteProduct);
 
export default router;