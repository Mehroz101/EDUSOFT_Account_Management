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
import { formatDateToISO } from "../utils/functions";
import { notify } from "../utils/Notification";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilterMatchMode } from "primereact/api";
const API_URL = import.meta.env.VITE_API_URL;

const TaxedInvoice = () => {
  const [invoiceData, setInvoiceData] = useState([]); // Data for the table
  const [selectedCustomers, setSelectedCustomers] = useState([]); // Selected rows
  const [customerIds, setCustomerIds] = useState(""); // Store IDs as a string
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    TaxInvoiceNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    BusinessUnitTitle: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    CustomerName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  document.title = "Taxed Invoice";

  const method = useForm({
    defaultValues: {
      Date: new Date(),
      BusinessUnitID: "",
    },
  });

  // Fetch business units dropdown
  const { data: Businessunitdropdown } = useQuery({
    queryKey: ["Businessunitdropdown"],
    queryFn: BusinessUnitDropdown,
  });

  // Fetch taxed invoices based on input
  const fetchTaxedInvoice = useMutation({
    mutationFn: TaxedInvoiceData,
    onSuccess: (data) => {
      if (data.success) {
        setInvoiceData(data.data);
      }
    },
  });
  const printMutation = useMutation({
    mutationFn: TaxedInvoicePrint,
    onSuccess: (data) => {
      if (data.success) {
        setLoading(false);
        console.log(`${API_URL}/files/${data.FilePath}`);
        notify("success", "Invoice Printed Successfully");
        window.open(`${API_URL}/files/${data.FilePath}`, "_blank");
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
      Date: formatDateToISO(method.getValues("Date")),
      BusinessUnitID: method.getValues("BusinessUnitID"),
    });
  };

  // Row index column
  const rowIndexTemplate = (rowData, options) => options.rowIndex + 1;

  // Handle single selection change
  const onSelectionChange = (event) => {
    const selectedRows = event.value;
    setSelectedCustomers(selectedRows);

    // Extract IDs and convert them to a comma-separated string
    const ids = selectedRows.map((item) => item.CustomerInvoiceID).join(",");
    setCustomerIds(ids);

    console.log("Selected Customer IDs:", ids);
    console.log(typeof ids);
  };

  // Handle select all change
  const onSelectAllChange = (event) => {
    const checked = event.checked;

    if (checked) {
      // Select all rows
      setSelectedCustomers(invoiceData);
      const ids = invoiceData.map((item) => item.CustomerInvoiceID).join(",");
      setCustomerIds(ids);
    } else {
      // Deselect all rows
      setSelectedCustomers([]);
      setCustomerIds("");
    }
  };

  useEffect(() => {
    if (Businessunitdropdown) {
      method.setValue("BusinessUnitID", Businessunitdropdown[0]?.value);
    }
  }, [Businessunitdropdown]);

  return (
    <>
      <div className="page_top flex justify-content-between align-items-center">
        <h1>Taxed Invoice</h1>
        <div className="selection-fields flex gap-2 align-items-end">
          <CDatePicker
            control={method.control}
            name="Date"
            label="Date"
            dateFormat="MM-yy"
            view="month"
            onChange={(e) => {
              method.setValue("Date", e.value);
              fetchinvoicedata();
            }}
          />
          <div>
            <label htmlFor="BusinessUnitID" className="font-bold">
              Business Unit{" "}
              <span className="text-danger font-bold text-red-700">*</span>
            </label>
            <CDropdown
              control={method.control}
              name="BusinessUnitID"
              optionLabel="label"
              optionValue="value"
              required={true}
              placeholder="Select a Business Unit"
              options={Businessunitdropdown}
              onChange={(e) => {
                method.setValue("BusinessUnitID", e.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="table_container">
        <div className="printBtn flex justify-content-end my-4">
          <Button
            label="Print"
            severity="success"
            loading={loading}
            disabled={selectedCustomers.length === 0}
            icon={<FontAwesomeIcon icon={faPrint} />}
            style={{
              backgroundColor: "#640D5F",
              border: "none",
            }}
            onClick={() => {
              setLoading(true);
              console.log(customerIds);
              printMutation.mutate(customerIds);
            }}
          />
        </div>
        <div className="table">
          <DataTable
            value={invoiceData}
            paginator
            rows={15}
            stripedRows
            showGridlines
            filters={filters}
            filterDisplay="row"
            emptyMessage="No customer invoices found."
            selection={selectedCustomers}
            onSelectionChange={onSelectionChange}
            selectAll={selectedCustomers.length === invoiceData.length}
            onSelectAllChange={onSelectAllChange}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column
              header="#"
              body={rowIndexTemplate}
              style={{ width: "5rem" }}
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
            {/* <Column
              field="ReadOnly"
              header="ReadOnly"
              style={{ minWidth: "10rem" }}
            /> */}
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default TaxedInvoice;
