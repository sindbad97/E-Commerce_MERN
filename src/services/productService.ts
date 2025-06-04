import { productModel } from "../models/productModel";


export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedIntialProducts = async () => {
  const products = [
    {
      title: "Dell Laptop",
      image: "https://s.yimg.com/ny/api/res/1.2/Ynv7csjnTujfoCqJqu_JuQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzU-/https://s.yimg.com/os/creatr-uploaded-images/2024-12/864e7630-b961-11ef-b9da-66e624faa0a4",
      price: 100,
      stock: 10
    },
  ];

  const existingProducts = await getAllProducts();
  if (existingProducts.length === 0) {
    await productModel.insertMany(products);
    console.log("Initial products seeded successfully.");
  }
}