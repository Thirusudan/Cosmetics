import express from 'express'
import { createProduct } from '../Controllers/productController.js';


const productRouter = express.Router();
productRouter.post("/",createProduct)

export default productRouter;


