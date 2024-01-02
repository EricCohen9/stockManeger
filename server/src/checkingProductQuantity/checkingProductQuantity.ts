import { NextFunction, Request, Response } from "express";
import { Product } from "../interfaces/orderInterface";
import * as dotenv from 'dotenv';

dotenv.config

interface NotFound{
  id:string;
  error:string;
}
export const checkingProductQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cartItems: Product[] = req.body.cartItems;
    const productNotFound: NotFound[] = [];
    const reqData = createArrayRequest(cartItems);
    let errorFlag = false
    const quantityProduct = await fetch(
        "https://erp-server-uxqd.onrender.com/api/shop_inventory/updateInventory",
        {
          method: "post",
          body: JSON.stringify(reqData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    const responseData = await quantityProduct.json();
    console.log(responseData);
    for (let i = 0; i<responseData.length; i++) {
        if(responseData[i].error){
            console.log(responseData[i])
            productNotFound.push({id:cartItems[i].id as string, error: responseData[i].error}); 
            req.body.price -= (cartItems[i].price as number) * (cartItems[i].quantity as number);
            errorFlag = true;
            cartItems.splice(i,1)
        }
    }
    if (errorFlag){ 
      res.status(406).json({ productNotFound:productNotFound })
    } else {
      next()
    }
  } catch {
    res.status(500).json("checking product quantity is failed");
  }
};

const createArrayRequest = (cartItems:Product[])=>{
     const reqData:Array<object>=[]
     cartItems.forEach((cartItem:Product)=>{
        const req = { productId: cartItem.id, requiredQuantity: cartItem.quantity}
        reqData.push(req)
     })
     return reqData
}