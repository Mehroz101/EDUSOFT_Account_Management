import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const CustomerInformationReportFun = async (data) => {
  try {
    console.log(data);
    const sendData = {
      businessUnitID: `${data.businessUnitID}`,
    };
    console.log(sendData);
    const response = await axios.post(
      `${API_URL}/api/Print/CustomerInformationReport`,
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
