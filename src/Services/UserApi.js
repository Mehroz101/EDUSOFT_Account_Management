import axios from "axios";
import { notify } from "../utils/Notification";
const API_URL = import.meta.env.VITE_API_URL;

//===========================GetAllUsers Function===============================
export const GetAllUsers = async (masterID = 0) => {
  try {
    console.log(API_URL);
    console.log("called");
    const response = await axios.post(`${API_URL}/api/Users/GetUserInfo`, {
      masterID: masterID,
    });
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
//===========================UsersInsertUpdate Function===============================
export const UsersInsertUpdate = async (userData) => {
  try {
    console.log(userData);
    const response = await axios.post(
      `${API_URL}/api/Users/UsersInsertUpdate`,
      userData
    );
    console.log(response.data.success);
    if (response.data) {
      console.log("response is successful");
      return response.data;
    }
  } catch (error) {
    console.error("API call error:", error);
  }
};
