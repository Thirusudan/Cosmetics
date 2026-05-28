import express from 'express'
import { createProduct, deleteProduct, getProducts, getProductsInfo, updateProduct } from '../Controllers/productController.js';


const productRouter = express.Router();
productRouter.post("/",createProduct)
productRouter.get("/",getProducts)
productRouter.get("/:productId",getProductsInfo)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateProduct)

export default productRouter;


