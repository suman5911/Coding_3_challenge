import { Product } from "../models/productModel";
import * as repo from "../repositories/firestoreRepository";
 
const COLLECTION = "products";
 
/**
 * Creates a new product
 * @param data - Product data without id, createdAt, updatedAt
 * @returns The created product with ID and timestamps
 */
export const createProduct = async (
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> => {
  try {
    const now = new Date();
    const productData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const created = await repo.createDocument<Product>(COLLECTION, productData as Product);
    return created;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create product: ${errorMessage}`);
  }
};
 
/**
 * Gets all products
 * @returns Array of all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    return await repo.getAllDocuments<Product>(COLLECTION);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to get products: ${errorMessage}`);
  }
};
 
/**
 * Gets a single product by ID
 * @param id - The product ID
 * @returns The product or null if not found
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    return await repo.getDocumentById<Product>(COLLECTION, id);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to get product: ${errorMessage}`);
  }
};
 
/**
 * Updates a product
 * @param id - The product ID
 * @param data - The fields to update
 * @returns The updated product
 */
export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "id" | "sku" | "createdAt">>
): Promise<Product> => {
  try {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    return await repo.updateDocument<Product>(COLLECTION, id, updateData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to update product: ${errorMessage}`);
  }
};
 
/**
 * Deletes a product
 * @param id - The product ID
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await repo.deleteDocument(COLLECTION, id);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to delete product: ${errorMessage}`);
  }
};