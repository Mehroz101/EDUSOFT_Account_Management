import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const CustomerInvoiceInsertUpdate = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/CustomerInvoiceInsertUpdate`,
      data
    );
    return response.data || [];
  } catch (error) {
    console.log(error);
  }
};
export const CustomerInvoiceData = async (masterID = 0) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/GetCustomerInvoices`,
      {
        masterID: masterID,
      }
    );
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

    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const GetInvoiceNo = async ({ id }) => {
  try {
    console.log("called");
    if (!id) {
      return;
    }
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/GetInvoiceNo?BusinessUnitID=${id}`
    );
    if (response.data.success) {
      return response.data.TaxInvoiceNo || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const CustomersDropdown = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/Dropdown/CustomersDropdown`
    );
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
    if (response.data.success) {
      return response.data.data || [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const GetCustomerInfo = async (customerName) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/GetCustomerInfo?CustomerName=${customerName}`
    );
    if (response.data.success) {
      return response.data.CustomerInfo || "";
    }
  } catch (error) {
    console.log(error);
  }
};

export const DeleteCustomerInvoices = async (masterID = 0) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/CustomerInvoices/DeleteCustomerInvoices`,
      {
        masterID: masterID,
      }
    );
    if (response.data) {
      return response.data || "";
    }
  } catch (error) {
    console.log(error);
  }
};

export const PrintCustomerInvoices = async (customerInvoiceIDs) => {
  console.log("PrintCustomerInvoices called with IDs", customerInvoiceIDs);
  try {
    const response = await axios.post(
      `${API_URL}/api/Print/CustomerInvoicePrint`,
      {
        customerInvoiceIDs: `${customerInvoiceIDs}`,
      }
    );
    console.log(response.data);
    if (response.data) {
      return response.data || "";
    }
  } catch (error) {
    console.log("PrintCustomerInvoices error", error.message);
  }
};
