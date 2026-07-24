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
    console.log("Fetching products")
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
       return res.status(403).json({message:"Access denined Admin only"})
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


 export async function getProductsInfo(req,res){
    try{
        const productId = req.params.productId // 6
        const product = await Product.findOne({productId :productId })  //7

        if(product == null){
            res.status(404).json({message:"Product not found"})
            return;
        }
        if(isAdmin(req)){
            res.json(product)
        }else{
            if(product.isAvailable){
                res.json(product);
            }else{
                res.status(404).json({message : "Product is not available"})
            }
        }
    }catch(error){
      console.error("Error updating product:",error);
        res.status(500).json({message:"Failed to update products"})
        return
    }
 }

 export async function searchProducts(req,res){
    const query = req.params.query

    try{
        const products = await Product.find({
            $or:[
           { name :{$regex:query , $options: "i"}},
           { altNames : {$elemMatch :{$regex:query, $options:"i"}}}
            ],
            isAvailable:true

        })
         return res.json(products)
    }catch{
    res.status(500).json({message: "Failed to search products"})
 }

 }

 


 

//1 - read the product details from varibale data (reads the body)
//2 - we have to include product id in put request
//3 - admin give a product id in put request and give other update details in the json ,url prodcut id(in the box) and product id in the json must be eqal (short version - the product id not allowed to update other details can be update)
//4 - we have to give the product id when updating we creating 2nd function and using to the 4th fuction
//5 - updated details we created in 1st function using to 5 

//6 - when some one send the product Id and the productId  saved to variable of const productId
//7 - ({productId-field in D :productId-value from URL })- goes to MongoDB → finds the product WHERE productId  returns FULL product details


/*
PRODUCT SEACRH PART EXPLINATION 

STEP 1 — Page loads
Frontend:
const [query, setQuery] = useState("")      // query = ""
const [loading, setLoading] = useState(true) // loading = true

STEP 2 — Since loading is true, useEffect runs
useEffect(()=>{
    if(loading){
        if(query == ""){                     ← query IS "" right now

STEP 3 — Since query is empty, fetch ALL products (no search yet)
Frontend:
axios.get(".../api/products").then((res)=>{
    SetProducts(res.data)
    SetLoading(false)
})

STEP 4 — Grid shows every product, spinner stops
loading = false → Loader disappears → all products shown

──────────────────────────────────────────

STEP 5 — Admin types "al" into the search box
Frontend:
<input onChange={(e)=>{
    setQuery(e.target.value)    ← query becomes "al"
    SetLoading(true)            ← loading becomes true
}}/>

STEP 6 — Since loading changed, useEffect runs again
useEffect(()=>{
    if(loading){
        if(query == ""){ ... }
        else {                                ← query is NOT "" now

STEP 7 — Fetch SEARCH results instead
Frontend:
axios.get(".../api/products/search/" + query).then((res)=>{
    SetProducts(res.data)
    SetLoading(false)
})
// sends: GET /api/products/search/al

──────────────────────────────────────────

STEP 8 — Backend receives the request
export async function searchProducts(req,res){
    const query = req.params.query    ← query = "al"

STEP 9 — Backend searches MongoDB
try{
    const products = await Product.find({
        $or:[
            { name : {$regex:query , $options: "i"} },
            { altNames : {$elemMatch :{$regex:query, $options:"i"}}}
        ],
        isAvailable:true
    })
    return res.json(products)
}catch{
    res.status(500).json({message: "Failed to search products"})
}

$or: [...] means "match if EITHER of these two conditions is true — not both required."
  Condition 1: name matches the search text
  Condition 2: altNames (the array) has at least one match
So a product counts as a match if the search text is found in its NAME, OR in one of its
altNames — only one needs to match, not both.

Example 1: product name = "Aloevera Cream", admin types "al"
$regex checks: does "al" appear ANYWHERE inside "Aloevera Cream"? → YES (partial match, not exact)
$options: "i" makes it ignore uppercase/lowercase → "al" still matches "Al" in "Aloevera"
→ Condition 1 (name) is TRUE → because of $or, this product is already a match

Example 2: product name = "Face Wash", altNames = ["Aloe Face Wash", "Gentle Cleanser"]
admin types "al"
Condition 1 (name): does "Face Wash" contain "al"? → NO
Condition 2 (altNames): $elemMatch checks each item in the array —
   "Aloe Face Wash" contains "al"? → YES
→ Condition 2 is TRUE → because of $or, this product is STILL a match

isAvailable: true → required separately (AND, outside the $or), so hidden or unavailable
products never show up in search results, even if their name/altNames match

STEP 10 — Backend sends matching products back
res.json(products)   // e.g. [ {name:"Aloevera Cream"}, {name:"Face Wash", altNames:["Aloe Face Wash"]} ]

──────────────────────────────────────────

STEP 11 — Frontend receives the response
.then((res)=>{
    SetProducts(res.data)   ← grid updates to ONLY matching products
    SetLoading(false)       ← spinner stops
})

STEP 12 — Grid now shows only search results
Admin sees only products matching "al"

──────────────────────────────────────────

STEP 13 — Admin clears the search box
setQuery("")      ← query becomes "" again
SetLoading(true)  ← loading becomes true

STEP 14 — useEffect runs again, query is "" → back to STEP 3
Fetches ALL products again → grid shows everything, like at the start
*/

