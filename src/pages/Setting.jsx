import React from "react";
import CDatePicker from "../components/FormComponents/CDatePicker";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { FormColumn, FormRow } from "../components/layoutComponent";

const Setting = () => {
  const method = useForm({
    defaultValues: {
      dateFrom: null,
      dateTo: null,
    },
  });
  return (
    <div>
      <h1>Setting</h1>
      <FormRow className="form-row flex justify-content-center align-items-center">
        <FormColumn xs="4" sm="4" md="4" lg="4" xl="4">
          <CDatePicker
            control={method.control}
            name="dateFrom"
            label="Date From"
            rules={{ required: "Date is required" }}
            required
            style={{ maxWidth: "400px" }}
          />
        </FormColumn>
        <FormColumn xs="4" sm="4" md="4" lg="4" xl="4">
          <CDatePicker
            control={method.control}
            name="dateTo"
            label="Date To"
            rules={{ required: "Date is required" }}
            required
            style={{ maxWidth: "400px" }}
          />
        </FormColumn>
        <FormColumn xs="4" sm="4" md="4" lg="4" xl="4">
          <Button
            type="submit"
            label="Submit"
            style={{ maxWidth: "400px" }}
          ></Button>
        </FormColumn>
      </FormRow>
    </div>
  );
};

export default Setting;
