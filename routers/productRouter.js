import express from 'express'
import { createProduct, deleteProduct, getProducts, getProductsInfo, searchProducts, updateProduct } from '../Controllers/productController.js';


const productRouter = express.Router();
productRouter.post("/",createProduct)
productRouter.get("/",getProducts)
productRouter.get("/:productId",getProductsInfo)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateProduct)
productRouter.get("/search/:query",searchProducts)

export default productRouter;


