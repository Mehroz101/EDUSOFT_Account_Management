import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export const GetConfiguration = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/Configuration/GetConfiguration`
    );
    console.log(response.data.dt[0]);
    if (response.data.success) {
      console.log("semd");
      return response.data.dt[0] || [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const ConfigurationInsertUpdate = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/Configuration/ConfigurationInsertUpdate`,
      data
    );
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.log("error", error);
    return [];
  }
};
