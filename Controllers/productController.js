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

export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({message:"Access denined Admin only"})
    }

    const data = req.body; //1
    const productId = req.params.productId; //2
    data.productId=productId;  //3

    try{
        await Product.updateOne(
            {
                productId : productId,  //4
            },
            data //5
        );
        res.json({message:"Product updated sucessfully"})

    }catch(error){
        console.error("Error updating product:",error);
        res.status(500).json({message:"Failed to update products"})
        return
    }
}

 

//1 - read the product details from varibale data (reads the body)
//2 - we have to include product id in put request
//3 - admin give a product id in put request and give other update details in the json ,url prodcut id(in the box) and product id in the json must be eqal (short version - the product id not allowed to update other details can be update)
//4 - we have to give the product id when updating we creating 2nd function and using to the 4th fuction
//5 - updated details we created in 1st function using to 5 

