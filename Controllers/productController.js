import Product from "../models/product.js";
import { isAdmin } from "./userController.js";


export async function createProduct(req,res){

    if(! isAdmin(req)){
        return res.status(403).json({message:"Access denied. Admin only "})
    }

    const product = new Product(req.body)

    try{
        const response = await product.save()

        res.json({
            message :"Product created successfully",
            product : response
        })
    }catch(error){
        console.error("Error creating product:", error);
        return res.status(500).json({message :"Failed to create products"})
    }
}

export async function getProducts(req,res){
    try{
        if(isAdmin(req)){
            const products = await Product.find();
            return res.json(products)
        }else{
            const products = await Product.find({isAvailable:true});
            return res.json(products)
        }
    }catch(error){
        console.error("Error fetching products:",error);
        return res.status(500).json({message : "Failed to fetch products"})
    }
}


export async function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({message :"Access denined Admin only"})
        return;
    }

    try{
        const productId = req.params.productId; 

        await Product.deleteOne({
            productId : productId
        })
        res.json({message : "Product deleted sucessfully"})
    }catch(error){
        console.error("Error deleting product:",error);
        res.status(500).json({message:"Failed to delete products"})
        return;
    }

}

