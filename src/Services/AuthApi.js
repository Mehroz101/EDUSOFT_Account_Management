import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const LoginUser = async (data) => {
  try {
    console.log(data);
    console.log("called");
    const response = await axios.post(`${API_URL}/api/Users/VerifyLogin`, data);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
