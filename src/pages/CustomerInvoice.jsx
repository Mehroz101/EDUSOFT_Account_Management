import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { ROUTES } from "../utils/routes";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  CustomerInvoiceData,
  CustomerInvoiceInsertUpdate,
} from "../Services/CustomerInvoiceApi";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPencil,
  faPrint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
const invoiceData = [
  {
    customerInvoiceID: 1,
    voucherDate: "2024-12-01",
    customerName: "John Doe",
    businessUnitID: 101,
    totalAmount: 5000,
    totalTaxAmount: 500,
    totalNetAmount: 4500,
    financialSession: "2024-25",
    taxInvoiceNo: 1001,
    description: "Invoice for services rendered in December",
    readOnly: 0,
    detail: "Paid via credit card",
  },
  {
    customerInvoiceID: 2,
    voucherDate: "2024-12-02",
    customerName: "Jane Smith",
    businessUnitID: 102,
    totalAmount: 7500,
    totalTaxAmount: 750,
    totalNetAmount: 6750,
    financialSession: "2024-25",
    taxInvoiceNo: 1002,
    description: "Invoice for subscription renewal",
    readOnly: 1,
    detail: "Pending confirmation",
  },
  {
    customerInvoiceID: 3,
    voucherDate: "2024-12-03",
    customerName: "Alan Walker",
    businessUnitID: 103,
    totalAmount: 3000,
    totalTaxAmount: 300,
    totalNetAmount: 2700,
    financialSession: "2024-25",
    taxInvoiceNo: 1003,
    description: "Invoice for product purchase",
    readOnly: 0,
    detail: "Shipped on 2024-12-04",
  },
];

const CustomerInvoice = () => {
  const navigate = useNavigate();
  document.title = "Customer Invoice";
  const [mergedData, setMergedData] = useState([]);

  //=========================== UseQuery Function===============================
  const {
    data: customerInvoiceData,
    isLoading,
    refetch: refetchCustomerInvoices,
  } = useQuery({
    queryKey: ["customerInvoices"],
    queryFn: () => CustomerInvoiceData(),
  });

  const rowIndexTemplate = (rowData, options) => {
    return options.rowIndex + 1;
  };
  // Handle merging master and detail arrays
  useEffect(() => {
    if (customerInvoiceData) {
      // Assuming data structure: { master: [...], detail: [...] }
      const mergedData = customerInvoiceData.master.map((invoice) => {
        // Find matching detail data for each invoice
        const invoiceDetail = customerInvoiceData.detail.filter(
          (detail) => detail.customerInvoiceID === invoice.customerInvoiceID
        );

        return {
          ...invoice,
          detail: invoiceDetail, // Attach the related detail to the invoice
        };
      });
      console.log(mergedData);
      setMergedData(mergedData); // Update state with merged data
    }
  }, [customerInvoiceData]);

  const ActionTemplate = (rowData) => (
    <>
      <div className="flex gap-2">
        <Button
          icon={<FontAwesomeIcon icon={faEye} />}
          className="p-button-outlined p-button-success"
          onClick={() => {
            navigate(
              `${ROUTES.CUSTOMERINVOICE.INSERTORUPDATE}/${rowData.CustomerInvoiceID}/View`
            );
          }}
        />
        <Button
          icon={<FontAwesomeIcon icon={faPencil} />}
          className="p-button-outlined p-button-info"
          onClick={() => {
            navigate(
              `${ROUTES.CUSTOMERINVOICE.INSERTORUPDATE}/${rowData.CustomerInvoiceID}/Edit`
            );
          }}
        />
        {/* <Button
          icon={<FontAwesomeIcon icon={faTrash} />}
          className="p-button-outlined p-button-danger"
          onClick={() => {
            navigate(
              `${ROUTES.CUSTOMERINVOICE.EDIT}/${rowData.customerInvoiceID}`
            );
          }}
        /> */}
        <Button
          icon={<FontAwesomeIcon icon={faPrint} />}
          className="p-button-outlined p-button-warning"
          onClick={() => {
            // navigate(
            //   `${ROUTES.CUSTOMERINVOICE.EDIT}/${rowData.customerInvoiceID}`
            // );
          }}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="page_top flex justify-content-between align-items-center">
        <h1>Customer Invoice</h1>
        <Button
          label="Add Customer Invoice"
          style={{
            maxWidth: "200px",
            backgroundColor: "#640D5F",
            outline: "none",
            border: "none",
          }}
          onClick={() => {
            navigate(`${ROUTES.CUSTOMERINVOICE.INSERTORUPDATE}`);
          }}
        />
      </div>

      <div className="table">
        <DataTable
          value={mergedData}
          paginator
          rows={15}
          stripedRows
          emptyMessage="No customer invoices found."
          loading={isLoading}
        >
          <Column
            header="#"
            body={rowIndexTemplate}
            style={{ width: "5rem" }}
          />
          <Column
            body={ActionTemplate}
            header="Actions"
            style={{ width: "6rem" }}
          />
          <Column
            field="CustomerInvoiceID"
            header="Invoice ID"
            style={{ minWidth: "10rem" }}
          />
          <Column
            body={(rowData) => new Date(rowData.VoucherDate).toDateString()}
            header="Voucher Date"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="CustomerName"
            header="Customer Name"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="BusinessUnitID"
            header="Business Unit ID"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="TotalAmount"
            header="Total Amount"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="TotalTaxAmount"
            header="Total Tax Amount"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="TotalNetAmount"
            header="Total Net Amount"
            style={{ minWidth: "10rem" }}
          />
        </DataTable>
      </div>
    </>
  );
};

export default CustomerInvoice;
