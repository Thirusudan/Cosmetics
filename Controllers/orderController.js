import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req,res){
    try{

if(req.user == null){
    res.status(401).json({message:"Please login to create an order"})
    return;
}

const latestOrder = await Order.find().sort({date : -1}).limit(1)  

    let orderId = "CBC00202"

     
    if(latestOrder.length> 0) {
        const lastOrderIdInString = latestOrder[0].orderID;                              //1- ("CBC00635")
        const lastOrderIdwithoutPrefix = lastOrderIdInString.replace("CBC","")           //2- ("00635")
        const lastOrderIdInInteger = parseInt(lastOrderIdwithoutPrefix)                  //3- ("635")
        const newOrderIdInInteger = lastOrderIdInInteger + 1                             //4- (636)
        const newOrderIdwithoutprefix = newOrderIdInInteger.toString().padStart(5,'0')   //5 - ("00636")
        orderId= "CBC" +newOrderIdwithoutprefix                                          //6("CBC00636")  
    }

/*7*/  const items=[]
/*8*/  let total = 0 
     
/*9*/    if(req.body.items !== null && Array.isArray(req.body.items)){
            for(let i=0; i < req.body.items.length; i++){
                
                let item = req.body.items[i]     
                
               
/*10*/          let product = await Product.findOne({
                productId: item.productId
                })
                if(product ==null){
                    res.status(400).json({message:"Invaild product ID: " +item.productId})
                    return
                }
              
                items[i]= {
                    productId: product.productId,
                    name: product.name,
                    image : product.images[0],
                    price: product.price,
                    qty:item.qty
                } 
             
 /*11*/               total+=product.price * item.qty
            }
    }else{
        res.status(400).json({message:"Invalid items format"})
    }
                


    const order = new Order({
        orderID : orderId,
        email : req.user.email,
        name : req.user.firstName + " " +req.user.lastName,
        address : req.body.address,
        phone : req.body.phone,
        items : items,
        total   : total
    })

    const result = await order.save()

    res.json({
        message:"Order created successfully",
        result: result
    })

}catch(error){
    console.log("Error creating order:")
    res.status(500).json({message:"Failed to create orders"})

}

}


export async function getOrders(req,res){
    if(req.user == null){
        res.status(401).json({message:"Please login to view orders "})
        return
    }

    try{
        if(req.user.role == "admin"){
            const orders = await Order.find().sort({date : -1})
            res.json(orders)
        }else{
            const orders = await Order.find({email: req.user.email}).sort({date : -1})
            res.json(orders)
        }
    }catch(error){
        console.error("error fetching orders:",error)
        res.status(500).json({message:"failed to fetch order"})
    }

}




/*
1 - we have to get the latest order list then we have identify the last order Id in string - (CBC00635)
2 - when we get the lastorderId It will be a string then we have to remove the CBC - (00635)
3 - Then change String to Integer  - (635)
4 -  after we include that Integer plus 1 - (636)
5 -  After that we have include the zero (.padStart(5,'0') - toatl 5 numbers will be displaing) -("00636")
6 - after we include the CBC - ("CBC00636")
7 - empty array — will collect proper item details 
8 -  starts at 0 — will add up the total price
9 -item array must be not null and must be an array
10- searches MongoDB Products collection using the productId customer sent!(when customer send product Id it will check in mongodb, if not it will print "Invaild product ID)
11 - total+=product.price * item.qty - i means currently total about price multiply itemqty
*/

