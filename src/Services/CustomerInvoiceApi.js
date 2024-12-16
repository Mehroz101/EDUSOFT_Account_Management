import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const CustomerInvoiceInsertUpdate = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/CustomerInvoiceInsertUpdate`,
      data
    );
    console.log(response);
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const CustomerInvoiceData = async (masterID = 1) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/GetCustomerInvoices`,
      {
        masterID: masterID,
      }
    );
    console.log(response.data);
    if (response.data.success) {
      return response.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const FinancialSessionDropdown = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/Dropdown/FinancialSessionDropdown`
    );
    console.log(response.data.data);
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const BusinessUnitDropdown = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/Dropdown/BusinessUnitDropdown`
    );
    console.log(response.data.data);
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const GetInvoiceNo = async ({ id }) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/GetInvoiceNo?BusinessUnitID=${id}`
    );
    console.log(response.data.TaxInvoiceNo);
    if (response.data.success) {
      return response.data.TaxInvoiceNo || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const CustomersDropdown = async () => {
  try {
    console.log("called customers dropdown");
    const response = await axios.post(
      `${API_URL}/api/Dropdown/CustomersDropdown`
    );
    console.log(response.data.data);
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const ProductsDropdown = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/Dropdown/ProductsDropdown`
    );
    console.log("called products dropdown");
    console.log(response.data.data);
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const ServicesDropdown = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/Dropdown/ServicesDropdown`
    );
    console.log("called services dropdown");
    console.log(response.data.data);
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const CustomerInvoices = async ({ masterID = 0 }) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/GetCustomerInvoices`,
      {
        masterID: masterID,
      }
    );
    console.log("called customer invoices");
    console.log(response.data.data);
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
