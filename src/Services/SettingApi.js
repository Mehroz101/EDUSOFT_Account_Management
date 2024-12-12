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
// URL: http://192.168.9.2:81
// Controller: Configuration
// API: GetConfiguration
// Sample: /api/Configuration/GetConfiguration
// Body Params:
// No Parameter
// Return Value:
// {
//   "message": "",
//   "success": true,
//   "dt": [
//     {
//       "ConfigID": 1,
//       "FinancialSessionDateFrom": "2024-01-01T00:00:00",
//       "FinancialSessionDateTo": "2024-12-01T00:00:00",
//       "SalesTaxPercentage": 5
//     }
//   ]
// }

// URL: http://192.168.9.2:81
// Controller: Configuration
// API: ConfigurationInsertUpdate
// Sample: /api/Configuration/ConfigurationInsertUpdate
// Body Params:
// {
//   "configID": 0,
//   "financialSessionDateFrom": "string",
//   "financialSessionDateTo": "string",
//   "salesTaxPercentage": 0
// }
// Return Value:
// {
//   "message": "Invalid config ID. Please contact administrator",
//   "success": false
// }
