import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  // Check if user already exists
  const findUser = await userModel.findOne({ email });
  if (findUser) {
    return { data: "User already exists", statusCode: 400 };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  // Save user to database
  await newUser.save();

  return { data: generateJWT({ firstName, lastName, email }), statusCode: 200 };
};

interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams) => {
  // Find user by email
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "User not found", statusCode: 400 };
  }

  // Check password
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (!passwordMatch) {
    return { data: "Invalid password", statusCode: 400 };
  }

  return {
    data: generateJWT({
      email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
    }),
    statusCode: 200,
  };
};

const generateJWT = (data: any) => {
  // This function would generate a JWT token for the user
  return jwt.sign(data, "E5839F9CC1F75F9D8D99B74C2F6CCF3");
};
