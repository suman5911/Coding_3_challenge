import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as productService from "../services/productService";
 
/**
 * Get all products
 */
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await productService.getAllProducts();
    res.status(HTTP_STATUS.OK).json({
      message: "Products retrieved",
      count: products.length,
      data: products,
    });
  } catch (error: unknown) {
    next(error);
  }
};
 
/**
 * Get a single product by ID
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Product not found",
      });
      return;
    }
    res.status(HTTP_STATUS.OK).json({
      message: "Product retrieved",
      data: product,
    });
  } catch (error: unknown) {
    next(error);
  }
};
 
/**
 * Create a new product
 */
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      message: "Product created",
      data: product,
    });
  } catch (error: unknown) {
    next(error);
  }
};
 
/**
 * Update a product
 */
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      message: "Product updated",
      data: product,
    });
  } catch (error: unknown) {
    next(error);
  }
};
 
/**
 * Delete a product
 */
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Product not found",
      });
      return;
    }
    await productService.deleteProduct(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      message: "Product deleted",
    });
  } catch (error: unknown) {
    next(error);
  }
};