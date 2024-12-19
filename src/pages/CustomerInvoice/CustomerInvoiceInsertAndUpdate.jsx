import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import React, { useEffect, useMemo, useState } from "react";
import {
  Controller,
  Form,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  BusinessUnitDropdown,
  CustomerInvoiceData,
  CustomerInvoiceInsertUpdate,
  CustomersDropdown,
  FinancialSessionDropdown,
  GetCustomerInfo,
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
import { formatDateToISO } from "../../utils/functions";
import CAutoComplete from "../../components/FormComponents/CAutoComplete";
import { notify } from "../../utils/Notification";
import { ROUTES } from "../../utils/routes";
const NewCustomerInvoice = () => {
  document.title = "New Customer Invoice";
  const { mode, id } = useParams();
  const [actionmode, setActionMode] = useState(mode);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState({
    totalAmount: 0,
    totalTaxAmount: 0,
    totalNetAmount: 0,
  });
  const method = useForm({
    defaultValues: {
      customerInvoiceID: 0,
      FinancialSession: "",
      businessUnitID: "",
      TaxInvoiceNo: 0,
      InvoiceDate: new Date(),
      customerName: "",
      description: "",
      CustomerInfo: "",
      detail: [],
      // Header Specific Fields
      Product_Header: "",
      Service_Header: "",
      Qty_Header: 1,
      Rate_Header: 0,
      Amount_Header: 0,
      TaxPercentage_Header: 0,
      TaxAmount_Header: 0,
      NetAmount_Header: 0,
      Description_Header: "",
    },
    shouldUnregister: false, // Retain field values without causing unnecessary re-renders
  });
  const navigate = useNavigate();
  //===========================UseQuery Function===============================

  const { data: customerInvoiceData } = useQuery({
    queryKey: ["GetCustomerInvoiceDetail", id],

    queryFn: () => {
      return CustomerInvoiceData(id);
    },
    enabled: !!mode && !!id, // Fetch only when both mode and id exist
  });

  //=========================== UseMutation Function===============================
  const CustomerInvoiceMutation = useMutation({
    mutationFn: CustomerInvoiceInsertUpdate,
    onSuccess: (data) => {
      if (data.success) {
        notify(
          "success",
          `${actionmode || "Added"} Customer Invoice successfully`
        );
        navigate(ROUTES.CUSTOMERINVOICE.PAGE);
        return;
      } else {
        notify("error", data.message);
      }
    },
  });

  const onsubmit = (data) => {
    if (data.totalNetAmount <= 0) {
      notify("error", "Net Amount should be greater than 0");
      return;
    }

    const details = data.detail.map((item) => ({
      Product: item.Product,
      Service: item.Service,
      Qty: parseFloat(item.Qty),
      Rate: parseFloat(item.Rate),
      Amount: parseFloat(item.Amount),
      TaxPercentage: parseFloat(item.TaxPercentage),
      TaxAmount: parseFloat(item.TaxAmount),
      NetAmount: parseFloat(item.NetAmount),
      Description: item.Description,
    }));
    const sendData = {
      CustomerInfo: data.CustomerInfo,
      customerInvoiceID: data.customerInvoiceID,
      financialSession: data.FinancialSession,
      businessUnitID: data.businessUnitID || 0,
      taxInvoiceNo: data.TaxInvoiceNo,
      voucherDate: formatDateToISO(data.InvoiceDate),
      customerName: data.customerName,
      description: data.description,
      totalAmount: data.totalAmount,
      totalTaxAmount: data.totalTaxAmount,
      totalNetAmount: data.totalNetAmount,
      readOnly: 0,
      detail: JSON.stringify(details),
    };
    CustomerInvoiceMutation.mutate(sendData);
  };

  //===========================UseEffect Function===============================

  useEffect(() => {
    if (customerInvoiceData) {
      method.setValue(
        "CustomerInfo",
        customerInvoiceData.master[0]?.CustomerInfo || ""
      );
      method.setValue(
        "customerInvoiceID",
        customerInvoiceData.master[0]?.CustomerInvoiceID || 0
      );
      method.setValue(
        "FinancialSession",
        customerInvoiceData.master[0]?.FinancialSession || ""
      );

      method.setValue(
        "businessUnitID",
        customerInvoiceData.master[0]?.BusinessUnitID || ""
      );
      method.setValue(
        "TaxInvoiceNo",
        customerInvoiceData.master[0]?.TaxInvoiceNo || 0
      );
      method.setValue(
        "InvoiceDate",
        new Date(customerInvoiceData.master[0]?.InvoiceDate) || new Date()
      );
      method.setValue(
        "customerName",
        customerInvoiceData.master[0]?.CustomerName || ""
      );
      method.setValue(
        "description",
        customerInvoiceData.master[0]?.Description || ""
      );
      method.setValue(
        "totalAmount",
        customerInvoiceData.master[0]?.TotalAmount || 0
      );
      method.setValue(
        "totalTaxAmount",
        customerInvoiceData.master[0]?.TotalTaxAmount || 0
      );
      method.setValue(
        "totalNetAmount",
        customerInvoiceData.master[0]?.TotalNetAmount || 0
      );
      method.setValue(
        "readOnly",
        customerInvoiceData.master[0]?.ReadOnly || false
      );

      method.setValue("detail", customerInvoiceData.detail || []);
    }
  }, [customerInvoiceData, method]);
  function CustomerInvoiceDetailTotal() {
    const method = useFormContext();

    const details = useWatch({
      control: method.control,
      name: "detail",
    });

    const stableDetails = useMemo(() => details, [details]);

    useEffect(() => {
      calculateTotal(stableDetails);
    }, [stableDetails]);

    function calculateTotal(details) {
      let totalAmount = 0;
      let totalTaxAmount = 0;
      let totalNetAmount = 0;
      details.forEach((item) => {
        totalAmount += parseFloat(item.Amount || 0);
        totalTaxAmount += parseFloat(item.TaxAmount || 0);
        totalNetAmount += parseFloat(item.NetAmount || 0);
      });
      if (
        totalAmount !== total.totalAmount ||
        totalTaxAmount !== total.totalTaxAmount ||
        totalNetAmount !== total.totalNetAmount
      ) {
        setTotal({ totalAmount, totalTaxAmount, totalNetAmount });
      }
      method.setValue("totalTaxAmount", totalTaxAmount);
      method.setValue("totalNetAmount", totalNetAmount);
      method.setValue("totalAmount", totalAmount);
    }

    return null;
  }
  return (
    <>
      <div className="page_top flex justify-content-between align-items-center">
        <h1>{actionmode} Customer Invoice </h1>

        <div className="btn flex gap-2">
          {mode && (
            <Button
              label="Edit"
              onClick={() => {
                if (method.getValues("readOnly") === true) {
                  return notify("error", "Invoice is Read Only");
                }
                setActionMode("Edit");
              }}
              style={{ backgroundColor: "#640D5F", border: "none" }}
            />
          )}
          <Button
            type="button"
            label="Save"
            disabled={actionmode && actionmode !== "Edit"}
            style={{ backgroundColor: "#640D5F", border: "none" }}
            onClick={method.handleSubmit(onsubmit)}
          />
        </div>
      </div>
      <div className="form">
        <form>
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
                  isEnable={actionmode && actionmode === "Edit"}
                  dateFormat="dd-M-yy"
                />
              </FormColumn>
              <CustomerDependentField mode={actionmode} />
              <FormColumn sm={12} md={4} lg={3} xl={3}>
                <CustomTextInput
                  name="description"
                  label="Description"
                  control={method.control}
                  isEnable={actionmode && actionmode === "Edit"}
                  required={false}
                />
              </FormColumn>

              <div className="form mt-5 ">
                <CustomerInvoiceRowEntryFields mode={actionmode} />
              </div>
              <div className="total w-full">
                <CustomerInvoiceDetailTotal />
                <FormRow className="mt-5 bg-gray-200 flex justify-content-between align-items-center gap-4 w-full">
                  <FormColumn
                    sm={12}
                    md={4}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <label
                      htmlFor="totalAmount"
                      className="text-lg font-semibold text-gray-700"
                    >
                      Total Amount
                    </label>
                    {total.totalAmount.toFixed(2)}
                  </FormColumn>
                  <FormColumn
                    sm={12}
                    md={4}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <label
                      htmlFor="totalAmount"
                      className="text-lg font-semibold text-gray-700"
                    >
                      Total Tax Amount
                    </label>
                    {total.totalTaxAmount.toFixed(2)}
                  </FormColumn>
                  <FormColumn
                    sm={12}
                    md={4}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <label
                      htmlFor="totalAmount"
                      className="text-lg font-semibold text-gray-700"
                    >
                      Total Net Amount
                    </label>
                    {total.totalNetAmount.toFixed(2)}
                  </FormColumn>
                </FormRow>
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
    queryFn: () => GetInvoiceNo({ id: method.getValues("businessUnitID") }),
    enabled: false,
  });
  const stableMethod = React.useMemo(() => method, [method]);

  useEffect(() => {
    if (Businessunitdropdown?.length > 0) {
      if (method.getValues("businessUnitID") === "") {
        method.setValue("businessUnitID", Businessunitdropdown[0]?.value);
      }
      console.log(method.getValues("businessUnitID"));
      if (
        method.getValues("businessUnitID") !== null ||
        method.getValues("businessUnitID") !== undefined
      ) {
        refetchInvoiceNo({ id: method.getValues("businessUnitID") });
      }
    }
  }, [Businessunitdropdown, stableMethod, refetchInvoiceNo, method]);

  useEffect(() => {
    if (Getinvoiceno) {
      console.log("Getinvoiceno");
      console.log(Getinvoiceno);

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
            name={`businessUnitID`}
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Business Unit"
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
        Financialsessiondropdown[0]?.FinancialSession
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
          <CAutoComplete
            name="FinancialSession"
            control={method.control}
            required={true}
            suggestions={items || []}
            disabled={mode && mode !== "Edit"}
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
  const fetchCustomerInfo = useMutation({
    mutationFn: GetCustomerInfo,
    onSuccess: (data) => {},
  });

  useEffect(() => {
    if (Customerdropdowm) {
      const sessions = Customerdropdowm.map((item) => item.value);
      setItems(sessions); // Set transformed data
      // method.setValue("customerName", Customerdropdowm[0].value);
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
          <CAutoComplete
            name="customerName"
            control={method.control}
            suggestions={items || []}
            required={true}
            disabled={mode && mode !== "Edit"}
            onChange={(e) => {
              fetchCustomerInfo.mutate(e.value);
            }}
          />
        </div>
      </FormColumn>
      <FormColumn sm={12} md={4} lg={3} xl={3}>
        <CustomTextInput
          name="CustomerInfo"
          label="CustomerInfo"
          control={method.control}
          isEnable={mode && mode === "Edit"}
        />
      </FormColumn>
    </>
  );
}
