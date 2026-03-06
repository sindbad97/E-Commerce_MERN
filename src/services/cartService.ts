import { cartModel } from "../models/cartModel";

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
