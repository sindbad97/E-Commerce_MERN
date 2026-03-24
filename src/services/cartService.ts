import { cartModel } from "../models/cartModel";
import { productModel } from "../models/productModel";

interface CreateCartForUser { 
    userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
    const cart = await cartModel.create({ userId });
    await cart.save();
    return cart;
};

interface getActiveCartForUser { 
    userId: string;
}

export const getActiveCartForUser = async ({ userId }: getActiveCartForUser) => {
    let cart = await cartModel.findOne({ userId, status: "active" });
    if (!cart) {
        cart = await createCartForUser({ userId });
    }
    
    return cart;
};

interface AddItemToCart { 
    userId: string;
    productId: any;
    quantity: number;
}

export const addItemToCart = async ({ userId, productId, quantity}: AddItemToCart) => {
    const cart = await getActiveCartForUser({ userId });
    const existsInCart = cart.items.find((p) => p.product.toString() === productId);
    if (existsInCart) {
       return { data: "Item already exists in cart", statusCode: 400 };
    }

    const product = await productModel.findById(productId);

    if (!product) {
        return { data: "Product not found", statusCode: 400 };
    }

    if(product.stock < quantity) {
        return { data: "Insufficient stock", statusCode: 400 };
    }


    cart.items.push({ product: productId, quantity: quantity, unitPrice: product.price });

    cart.totalAmount += product.price * quantity;

    const updatedCart = await cart.save();
    
    return { data: updatedCart, statusCode: 200 };

};

interface UpdateItemInCart { 
    userId: string;
    productId: any;
    quantity: number;
}

export const updateItemInCart = async ({productId, quantity, userId,}: UpdateItemInCart ) => {
    const cart = await getActiveCartForUser({ userId });
    const existsInCart = cart.items.find((p) => p.product.toString() === productId);
    if (!existsInCart) {
       return { data: "Item does not exists in cart", statusCode: 400 };
    };

    const product = await productModel.findById(productId);

    if (!product) {
        return { data: "Product not found", statusCode: 400 };
    }

    if(product.stock < quantity) {
        return { data: "Insufficient stock", statusCode: 400 };
    }


    const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);

    let total = otherCartItems.reduce((sum, product) => {
        sum += product.quantity * product.unitPrice; 
        return sum
    }, 0);

    existsInCart.quantity = quantity;
    total += existsInCart.quantity * existsInCart.unitPrice;
    cart.totalAmount = total;


   const updatedCart = await cart.save();

   return { data: updatedCart, statusCode: 200 };
}

