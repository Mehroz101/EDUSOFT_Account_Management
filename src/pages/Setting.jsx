import React, { useEffect } from "react";
import CDatePicker from "../components/FormComponents/CDatePicker";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { FormColumn, FormRow } from "../components/layoutComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ConfigurationInsertUpdate,
  GetConfiguration,
} from "../Services/SettingApi";
import CNumberInput from "../components/FormComponents/CNumberInput";
import { formatDateToISO } from "../utils/functions";
import { notify } from "../utils/Notification";

const Setting = () => {
  document.title = "Setting";
  const method = useForm({
    defaultValues: {
      configID: 1,
      financialSessionDateFrom: new Date(),
      financialSessionDateTo: new Date(),
      salesTaxPercentage: 0,
    },
  });
  //===========================UseQuery Function===============================

  const { data: configuration, isLoading } = useQuery({
    queryKey: ["GetConfiguration"],
    queryFn: GetConfiguration,
  });
  //===========================UseMutation Function===============================
  const ConfigurationInsertupdate = useMutation({
    mutationFn: ConfigurationInsertUpdate,
    onSuccess: (data) => {
      if (data.success) {
        notify("success", "Configuration updated successfully");
      } else {
        notify("error", data.message);
      }
    },
    onError: (error) => {
      notify("error", error.message);
      console.log(error);
    },
  });
  //========================HandleSubmit Function=================================
  const handleSubmit = (data) => {
    ConfigurationInsertupdate.mutate(data);
  };
  useEffect(() => {
    if (configuration) {
      method.setValue(
        "financialSessionDateFrom",
        new Date(configuration.FinancialSessionDateFrom)
      );
      method.setValue(
        "financialSessionDateTo",
        new Date(configuration.FinancialSessionDateTo)
      );
      method.setValue("salesTaxPercentage", configuration.SalesTaxPercentage);
    }
  }, [configuration]);
  return (
    <div>
      <h1>Setting</h1>
      <form onSubmit={method.handleSubmit(handleSubmit)}>
        <FormRow className="form-row flex justify-content-center ">
          <FormColumn md="6" lg="3" xl="3">
            <CDatePicker
              control={method.control}
              name="financialSessionDateFrom"
              label="Date From"
              rules={{ required: "Date is required" }}
              required
              style={{ maxWidth: "400px" }}
            />
          </FormColumn>
          <FormColumn md="6" lg="3" xl="3">
            <CDatePicker
              control={method.control}
              name="financialSessionDateTo"
              label="Date To"
              rules={{ required: "Date is required" }}
              required
              style={{ maxWidth: "400px" }}
            />
          </FormColumn>
          <FormColumn md="6" lg="3" xl="3">
            <CNumberInput
              id={"salesTaxPercentage"}
              control={method.control}
              required
            />
          </FormColumn>
          <FormColumn md="6" lg="3" xl="3">
            <Button
              type="submit"
              label="Submit"
              style={{ maxWidth: "400px", marginTop: "30px" }}
            />
          </FormColumn>
        </FormRow>
      </form>
    </div>
  );
};

export default Setting;
