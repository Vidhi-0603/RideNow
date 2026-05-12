import axiosInstance from "../utils/axiosInstance.js";

export const registerCaptain = async ({ firstname, lastname, email, password, color, plate, type, capacity }) => {
    const { data } = await axiosInstance.post("/captain/register", {
      firstname,
      lastname,
      email,
      password,
      color,
      plate,
      type,
      capacity,
      role: "captain",
    });    
    return data;
}

export const loginCaptain = async ({email, password }) => {
    const { data } = await axiosInstance.post("/captain/login", { email, password, role:'captain' });    
    return data;
}
export const logoutCaptain = async (captainId) => {
    const { data } = await axiosInstance.post("/captain/logout", { captainId });
    return data;
}