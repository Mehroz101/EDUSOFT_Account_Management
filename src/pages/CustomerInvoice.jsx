import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { ROUTES } from "../utils/routes";
import { data, useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  CustomerInvoiceData,
  DeleteCustomerInvoices,
  PrintCustomerInvoices,
} from "../Services/CustomerInvoiceApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPencil,
  faPrint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { notify } from "../utils/Notification";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { FilterMatchMode } from "primereact/api";
const API_URL = import.meta.env.VITE_API_URL;

const CustomerInvoice = () => {
  const navigate = useNavigate();
  document.title = "Customer Invoice";
  const [mergedData, setMergedData] = useState([]);
  const [filters, setFilters] = useState({
    TaxInvoiceNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    BusinessUnitTitle: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    CustomerName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [btndisable, setBtndisable] = useState(false);
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
      setMergedData(mergedData); // Update state with merged data
    }
  }, [customerInvoiceData]);

  const DeletecustomerInvoices = useMutation({
    mutationFn: DeleteCustomerInvoices,

    onSuccess: (data) => {
      if (data.success) {
        notify("success", "Customer Invoice Deleted Successfully");
        refetchCustomerInvoices();
      } else {
        notify("error", data.message);
      }
    },
    onError: (error) => {
      notify("error", error.message);
    },
  });
  const printMutation = useMutation({
    mutationFn: PrintCustomerInvoices,

    onSuccess: (data) => {
      if (data.success) {
        setBtndisable(false);
        console.log(`${API_URL}/files${data.FilePath}`);
        window.open(`${API_URL}/files/${data.FilePath}`, "_blank");
      } else {
        setBtndisable(false);

        notify("error", data.message);
      }
    },
    onError: (error) => {
      setBtndisable(false);

      notify("error", error.message);
    },
  });
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
            if (rowData.ReadOnly === true) {
              return notify("error", "Invoice is Read Only");
            }
            navigate(
              `${ROUTES.CUSTOMERINVOICE.INSERTORUPDATE}/${rowData.CustomerInvoiceID}/Edit`
            );
          }}
        />
        <Button
          icon={<FontAwesomeIcon icon={faTrash} />}
          className="p-button-outlined p-button-danger"
          onClick={() => {
            confirmDelete(rowData.CustomerInvoiceID);
          }}
        />
        <Button
          icon={<FontAwesomeIcon icon={faPrint} />}
          className="p-button-outlined p-button-warning"
          disabled={btndisable}
          onClick={() => {
            setBtndisable(true);
            printMutation.mutate(rowData.CustomerInvoiceID);
          }}
        />
      </div>
    </>
  );

  const accept = (data) => {
    DeletecustomerInvoices.mutate(data);
    refetchCustomerInvoices();
  };

  const reject = () => {};

  const confirmDelete = (data) => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept() {
        accept(data);
      },
      reject,
    });
  };
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
          filters={filters}
          filterDisplay="row"
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
            field="TaxInvoiceNo"
            header="Tax Invoice No"
            filter
            filterPlaceholder="Search by no"
            style={{ minWidth: "10rem" }}
          />
          <Column
            body={(rowData) => new Date(rowData.VoucherDate).toDateString()}
            header="Voucher Date"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="CustomerName"
            filter
            filterPlaceholder="Search by name"
            header="Customer Name"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="BusinessUnitTitle"
            filter
            filterPlaceholder="Search by title"
            header="Business Unit Title"
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
          <Column
            field="ReadOnly"
            header="ReadOnly"
            style={{ minWidth: "10rem" }}
          />
        </DataTable>
        <ConfirmDialog />
      </div>
    </>
  );
};

export default CustomerInvoice;
