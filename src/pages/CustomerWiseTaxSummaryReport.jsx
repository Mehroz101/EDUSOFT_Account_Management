import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import CDatePicker from "../components/FormComponents/CDatePicker";
import { useForm } from "react-hook-form";
import CDropdown from "../components/FormComponents/CDropDown";
import { BusinessUnitDropdown } from "../Services/CustomerInvoiceApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  TaxedInvoiceData,
  TaxedInvoicePrint,
} from "../Services/TaxedInvoiceApi";
import { formatDateToCustom, formatDateToISO } from "../utils/functions";
import { notify } from "../utils/Notification";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilterMatchMode } from "primereact/api";
import { TaxedInvoiceReportFun } from "../Services/TaxedInvoiceReportApi";
import { CustomerWiseTaxSummaryReportFun } from "../Services/CustomerWiseTaxSummaryReportApi";
import ViewPdf from "../components/ViewPdf";
const API_URL = import.meta.env.VITE_API_URL;

const CustomerWiseTaxSummaryReport = () => {
  const [invoiceReportData, setInvoiceReportData] = useState(""); // Data for the table
  const [loading, setLoading] = useState(false);

  document.title = "Customer Wise Report";

  const method = useForm({
    defaultValues: {
      dateFrom: new Date(),
      dateTo: new Date(),
    },
  });

  // Fetch taxed invoices based on input
  const fetchTaxedInvoice = useMutation({
    mutationFn: CustomerWiseTaxSummaryReportFun,
    onSuccess: (data) => {
      if (data.success) {
        setLoading(false);
        console.log(data.FilePath);
        notify("success", "Invoice Printed Successfully");
        setInvoiceReportData(data.FilePath);
        console.log(invoiceReportData);
      } else {
        setLoading(false);
        notify("error", data.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      notify("error", error.message);
    },
  });

  const fetchinvoicedata = () => {
    fetchTaxedInvoice.mutate({
      dateFrom: formatDateToCustom(method.getValues("dateFrom")),
      dateTo: formatDateToCustom(method.getValues("dateTo")),
    });
  };

  return (
    <>
      <div className="page_top flex justify-content-between align-items-center">
        <h1>Customer Wise Tax Summary Report</h1>
        <div className="selection-fields flex gap-2 align-items-end">
          <CDatePicker
            control={method.control}
            name="dateFrom"
            label="Date From"
            dateFormat="dd-M-yy"
            onChange={(e) => {
              method.setValue("dateFrom", e.value);
            }}
          />
          <CDatePicker
            control={method.control}
            name="dateTo"
            label="Date To"
            dateFormat="dd-M-yy"
            onChange={(e) => {
              method.setValue("dateTo", e.value);
            }}
          />
        </div>
      </div>
      <div className="table_container">
        <div className="printBtn flex justify-content-end my-4">
          <Button
            label="Print"
            severity="success"
            loading={loading}
            icon={<FontAwesomeIcon icon={faPrint} />}
            style={{
              backgroundColor: "#640D5F",
              border: "none",
            }}
            onClick={() => {
              setLoading(true);
              fetchinvoicedata();
            }}
          />
        </div>
        {invoiceReportData && (
          <>
            <ViewPdf url={`${API_URL}/files/${invoiceReportData}`} />

            {/* <div className="ml-2 mr-2 min-h-screen w-full mt-2">
              <div style={{ width: "100%", height: "100vh" }}>
                <iframe
                  src={`${API_URL}/files/${invoiceReportData}`}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="PDF Viewer"
                ></iframe>
              </div>
            </div> */}
          </>
        )}
      </div>
    </>
  );
};

export default CustomerWiseTaxSummaryReport;
