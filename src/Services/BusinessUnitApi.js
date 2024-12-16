import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const GetBusinessUnits = async (masterID = 0) => {
  try {
    console.log(API_URL);
    console.log("called");
    const response = await axios.post(
      `${API_URL}/api/BusinessUnits/GetBusinessUnits`,
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
export const BusinessUnitsInsertUpdate = async (formData) => {
  try {
    console.log(formData);
    const data = new FormData();
    if (formData?.BusinessUnitID) {
      data.append("BusinessUnitID", formData?.BusinessUnitID);
    }
    data.append("BusinessUnitTitle", formData.BusinessUnitTitle);
    data.append("PhoneNo", formData.PhoneNo);
    data.append("MobileNo", formData.MobileNo);
    data.append("Email", formData.Email);
    data.append("Address", formData.Address);
    data.append("Website", formData.Website);
    data.append("NTNNo", formData.NTNNo);
    data.append("STNNo", formData.STNNo);
    data.append("Logo", formData.Logo);
    if (formData.PrimaryColor) {
      const { r, g, b } = formData.PrimaryColor;
      data.append("RedColor", r);
      data.append("GreenColor", g);
      data.append("BlueColor", b);
    } else {
      data.append("RedColor", 22);
      data.append("GreenColor", 163);
      data.append("BlueColor", 64);
    }

    console.log(data);
    const response = await axios.post(
      `${API_URL}/api/BusinessUnits/BusinessUnitsInsertUpdate`,
      data
    );
    console.log(response);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.log("error", error);
    return [];
  }
};
