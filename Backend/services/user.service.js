import userModel from "../models/user.model.js";

export const createUser = async (firstname, lastname, email, password) => {
  if (!firstname || !email || !password) {
    throw new Error("All fields are required");
  }

  const newUser = new userModel({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });

  await newUser.save();

  return newUser;
};
