import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export const GetMonthClosing = async (masterID = 0) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/TaxClosingMonth/GetTaxClosingMonth`,
      {
        masterID: masterID,
      }
    );
    console.log(response.data);
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const AddClosingMonth = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/TaxClosingMonth/ClosingMonthInsertUpdate`,
      data
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
