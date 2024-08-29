import { Router } from "express";
import productController from "../../controllers/products.controller";

const router = Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(productController.createProduct);

router
  .route("/:id")
  .get(productController.showProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
