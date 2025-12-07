import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider.jsx";
import axiosInstance from "./axiosInstance.js";
import { UserDataContext } from "../context/UserContext.jsx";
import Loader from "../components/Loader.jsx";

const CheckAuth = ({ children }) => {
  const { role, loading } = useContext(AuthContext);
  const { setUser } = useContext(UserDataContext);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (role === "user") {
          const { data } = await axiosInstance.get("/user/profile");
          console.log(data.user,"userrrrrrr");
          
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchUser();
  }, [role, setUser]); // runs when role is known

  if (loading) return <Loader />;


  if (!role || role !== "user") {
    return <Navigate to="/user-login" replace />;
  }

  return <>{children}</>;
};

export default CheckAuth;
