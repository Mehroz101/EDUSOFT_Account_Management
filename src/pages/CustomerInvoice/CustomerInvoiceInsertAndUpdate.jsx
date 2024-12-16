import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import {
  Controller,
  Form,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  BusinessUnitDropdown,
  CustomerInvoiceData,
  CustomerInvoiceInsertUpdate,
  CustomersDropdown,
  FinancialSessionDropdown,
  GetInvoiceNo,
  ProductsDropdown,
  ServicesDropdown,
} from "../../Services/CustomerInvoiceApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { classNames } from "primereact/utils";
import { FormColumn, FormRow } from "../../components/layoutComponent";
import CDropdown from "../../components/FormComponents/CDropDown";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import CDatePicker from "../../components/FormComponents/CDatePicker";
import CustomerInvoiceRowEntryFields from "./CustomerInvoiceRowEntryFields";
import { fas } from "@fortawesome/free-solid-svg-icons";

const NewCustomerInvoice = () => {
  document.title = "New Customer Invoice";
  const { mode, id } = useParams();
  const [actionmode, setActionMode] = useState(mode);
  const [items, setItems] = useState([]);

  const method = useForm({
    defaultValues: {
      FinancialSession: "",
      businessUnitID: "",
      TaxInvoiceNo: 0,
      InvoiceDate: new Date(),
      customerName: "",
      description: "",
      detail: [],

      // Header Specific Fields
      Product_Header: "", // Product
    },
  });

  //===========================UseQuery Function===============================
  const { data: Customerdropdowm } = useQuery({
    queryKey: ["Customerdropdowm"],
    queryFn: CustomersDropdown,
  });
  const { data: customerInvoiceData } = useQuery({
    queryKey: ["GetCustomerInvoiceDetail", id],

    queryFn: () => {
      console.log(id);
      return CustomerInvoiceData(id);
    },
    enabled: !!mode && !!id, // Fetch only when both mode and id exist
  });

  //=========================== UseMutation Function===============================
  const CustomerInvoiceMutation = useMutation({
    mutationFn: CustomerInvoiceInsertUpdate,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  //===========================Search Function===============================
  const search = (event) => {
    let query = event.query.toLowerCase();
    let _filteredItems = items.filter((item) =>
      item.toLowerCase().includes(query)
    );
    setItems(_filteredItems); // Set filtered suggestions
  };
  const onsubmit = (data) => {
    console.log(data);
    const sendData = {
      financialSession: data.FinancialSession,
      businessUnitID: data.businessUnitID || 0,
      taxInvoiceNo: data.TaxInvoiceNo,
      voucherDate: data.InvoiceDate,
      customerName: data.customerName,
      description: data.description,
      totalAmount: 10,
      totalTaxAmount: 0,
      totalNetAmount: 0,
      readOnly: 0,
      detail: JSON.stringify(data.detail),
    };
    CustomerInvoiceMutation.mutate(sendData);
  };

  useEffect(() => {
    if (Customerdropdowm) {
      const sessions = Customerdropdowm.map((item) => item.label);
      setItems(sessions); // Set transformed data
      method.setValue("customerName", Customerdropdowm[0].label);
    }
  }, [Customerdropdowm]);

  //===========================UseEffect Function===============================

  useEffect(() => {
    if (customerInvoiceData) {
      console.log("customerInvoiceData");
      console.log(customerInvoiceData.master);
      // Map the master fields to the form
      method.setValue(
        "FinancialSession",
        customerInvoiceData.master[0].FinancialSession || ""
      );
      method.setValue(
        "businessUnitID",
        customerInvoiceData.master[0].BusinessUnitID || ""
      );
      method.setValue(
        "TaxInvoiceNo",
        customerInvoiceData.master[0].TaxInvoiceNo || 0
      );
      method.setValue(
        "InvoiceDate",
        new Date(customerInvoiceData.master[0].EntryDateTime) || new Date()
      );
      method.setValue(
        "customerName",
        customerInvoiceData.master[0].CustomerName || ""
      );
      method.setValue(
        "description",
        customerInvoiceData.master[0].Description || ""
      );

      // Map the detail array
      method.setValue("detail", customerInvoiceData.detail || []);
    }
  }, [customerInvoiceData, method]);

  return (
    <>
      <div className="page_top flex justify-content-between align-items-center">
        <h1>{actionmode} Customer Invoice </h1>

        <div className="btn flex gap-2">
          {mode && (
            <Button
              label="Edit"
              onClick={() => setActionMode("Edit")}
              style={{ backgroundColor: "#640D5F", border: "none" }}
            />
          )}
          <Button
            type="submit"
            label="Save"
            // disabled={mode && mode !== "Edit   "}
            style={{ backgroundColor: "#640D5F", border: "none" }}
            onClick={method.handleSubmit(onsubmit)}
          />
        </div>
      </div>
      <div className="form">
        <form action="">
          <FormRow>
            <FormProvider {...method}>
              <FinancialSessionDependentField mode={actionmode} />
              <BusinessUnitDependentField mode={actionmode} />
              <FormColumn sm={12} md={4} lg={3} xl={3}>
                <CDatePicker
                  control={method.control}
                  name="InvoiceDate"
                  label="Invoice Date"
                  required={true}
                  isEnable={mode && mode !== "Edit"}
                  dateFormat="dd-M-yy"
                />
              </FormColumn>
              <CustomerDependentField mode={actionmode} />
              <FormColumn sm={12} md={4} lg={3} xl={3}>
                <CustomTextInput
                  name="description"
                  label="Description"
                  control={method.control}
                  isEnable={mode && mode === "Edit"}
                  required={false}
                />
              </FormColumn>
              <div className="form mt-5 ">
                <CustomerInvoiceRowEntryFields mode={actionmode} />
              </div>
            </FormProvider>
          </FormRow>
        </form>
      </div>
    </>
  );
};

export default NewCustomerInvoice;

function BusinessUnitDependentField({ mode }) {
  const method = useFormContext();
  const { data: Businessunitdropdown } = useQuery({
    queryKey: ["Businessunitdropdown"],
    queryFn: BusinessUnitDropdown,
  });
  const { data: Getinvoiceno, refetch: refetchInvoiceNo } = useQuery({
    queryKey: ["Getinvoiceno"],
    queryFn: () => GetInvoiceNo({ id: method.getValues("BusinessUnitID") }),
  });

  useEffect(() => {
    if (Businessunitdropdown?.length > 0) {
      method.setValue("BusinessUnitID", Businessunitdropdown[0].value);
      refetchInvoiceNo();
    }
  }, [Businessunitdropdown, method]);
  useEffect(() => {
    if (Getinvoiceno) {
      method.setValue("TaxInvoiceNo", Getinvoiceno);
    }
  }, [Getinvoiceno, method]);

  return (
    <>
      <FormColumn sm={12} md={4} lg={3} xl={3}>
        <label htmlFor="BusinessUnit">
          {" "}
          Business Unit <span className="required text-red-700">*</span>
        </label>
        <div style={{ width: "100%" }}>
          <CDropdown
            control={method.control}
            name={`BusinessUnitID`}
            optionLabel="label"
            optionValue="value"
            placeholder="Select a product"
            options={Businessunitdropdown}
            disabled={mode && mode !== "Edit"}
            required={true}
            onChange={(e) => {
              refetchInvoiceNo();
            }}
          />
        </div>
      </FormColumn>
      <FormColumn sm={12} md={4} lg={3} xl={3}>
        <CustomTextInput
          name="TaxInvoiceNo"
          label="Tax Invoice No"
          control={method.control}
          required={true}
          isEnable={false}
          defaultValue={Getinvoiceno ?? ""} // Use nullish coalescing to ensure a fallback value
        />
      </FormColumn>
    </>
  );
}
function FinancialSessionDependentField({ mode }) {
  const method = useFormContext();
  const [items, setItems] = useState([]);
  const search = (event) => {
    let query = event.query.toLowerCase();
    let _filteredItems = items.filter((item) =>
      item.toLowerCase().includes(query)
    );
    setItems(_filteredItems); // Set filtered suggestions
  };

  const { data: Financialsessiondropdown } = useQuery({
    queryKey: ["FinancialSessionDropdown"],
    queryFn: FinancialSessionDropdown,
  });

  useEffect(() => {
    if (Financialsessiondropdown) {
      const sessions = Financialsessiondropdown.map(
        (item) => item.FinancialSession
      );
      setItems(sessions); // Set transformed data
      method.setValue(
        "FinancialSession",
        Financialsessiondropdown[0].FinancialSession
      );
    }
  }, [Financialsessiondropdown]);

  return (
    <>
      <FormColumn sm={12} md={4} lg={3} xl={3}>
        <label htmlFor="FinancialSession">
          {" "}
          FinancialSession <span className="required text-red-700">*</span>
        </label>
        <div style={{ width: "100%" }}>
          <Controller
            name="FinancialSession"
            control={method.control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <>
                <AutoComplete
                  inputId={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  suggestions={items}
                  completeMethod={search}
                  disabled={mode && mode !== "Edit"}
                  dropdown
                  style={{ width: "100%" }}
                  pt={{
                    dropdownButton: {
                      root: {
                        style: {
                          padding: "0 !important",
                        },
                      },
                      icon: {
                        style: {
                          padding: "0",
                        },
                      },
                    },
                    input: {
                      style: {
                        width: "100%",
                      },
                    },
                  }}
                  className={classNames({ "p-invalid": fieldState.error })}
                />
              </>
            )}
          />
        </div>
      </FormColumn>
    </>
  );
}
function CustomerDependentField({ mode }) {
  const method = useFormContext();
  const [items, setItems] = useState([]);
  const { data: Customerdropdowm } = useQuery({
    queryKey: ["Customerdropdowm"],
    queryFn: CustomersDropdown,
  });
  const search = (event) => {
    let query = event.query.toLowerCase();
    let _filteredItems = items.filter((item) =>
      item.toLowerCase().includes(query)
    );
    setItems(_filteredItems); // Set filtered suggestions
  };
  useEffect(() => {
    if (Customerdropdowm) {
      const sessions = Customerdropdowm.map((item) => item.value);
      setItems(sessions); // Set transformed data
      method.setValue("customerName", Customerdropdowm[0].value);
    }
  }, [Customerdropdowm]);
  return (
    <>
      <FormColumn sm={12} md={4} lg={3} xl={3}>
        <label htmlFor="customerName">
          {" "}
          Customer Name <span className="required text-red-700">*</span>
        </label>
        <div style={{ width: "100%" }}>
          <Controller
            name="customerName"
            control={method.control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <>
                <AutoComplete
                  inputId={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  suggestions={items}
                  completeMethod={search}
                  disabled={mode && mode !== "Edit"}
                  dropdown
                  style={{ width: "100%" }}
                  pt={{
                    dropdownButton: {
                      root: {
                        style: {
                          padding: "0 !important",
                        },
                      },
                      icon: {
                        style: {
                          padding: "0",
                        },
                      },
                    },
                    input: {
                      style: {
                        width: "100%",
                      },
                    },
                  }}
                  className={classNames({ "p-invalid": fieldState.error })}
                />
              </>
            )}
          />
          {/* <CDropdown
            control={method.control}
            name={`customerName`}
            optionLabel="label"
            optionValue="value"
            placeholder="Select a product"
            options={Customerdropdowm}
            required={true}
            disabled={mode === "Edit" ? false : true}
          /> */}
        </div>
      </FormColumn>
    </>
  );
}
