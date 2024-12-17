import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const BusinessUnitWiseTaxReportFun = async (data) => {
  try {
    console.log(data);
    const sendData = {
      dateFrom: `${data.dateFrom}`,
      dateTo: `${data.dateTo}`,
    };
    console.log(sendData);
    const response = await axios.post(
      `${API_URL}/api/Print/BusinessUnitWiseTaxReport`,
      sendData
    );
    console.log(response);
    if (response.data) {
      return response.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
