import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const TaxedInvoiceData = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/GetMonthlyTaxInvoicesPrintData?Date=${data.Date}&BusinessUnitID=${data.BusinessUnitID}`
    );
    if (response.data.success) {
      return response.data || "";
    }
  } catch (error) {
    console.log(error);
  }
};

export const TaxedInvoicePrint = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(
      `${API_URL}/api/Print/CustomerInvoicePrint`,
      {
        customerInvoiceIDs: `${data}`,
      }
    );
    if (response.data.success) {
      return response.data || "";
    }
  } catch (error) {
    console.log(error);
  }
};
