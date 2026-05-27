import express from 'express'
import { createProduct, deleteProduct, getProducts } from '../Controllers/productController.js';


const productRouter = express.Router();
productRouter.post("/",createProduct)
productRouter.get("/",getProducts)
productRouter.delete("/:productId",deleteProduct)


export default productRouter;


