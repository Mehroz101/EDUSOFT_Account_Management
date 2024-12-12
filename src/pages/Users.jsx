import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Users() {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [loading, setLoading] = useState(true);

  const [statuses] = useState(["active", "Inactive"]);

  const getSeverity = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "Inactive":
        return "warning";
      default:
        return null;
    }
  };

  useEffect(() => {
    const users = [
      {
        fullname: "John Doe",
        email: "johndoe@example.com",
        password: "securePassword123",
        username: "johndoe",
        status: "active",
      },
      {
        fullname: "Jane Smith",
        email: "janesmith@example.com",
        password: "strongPassword456",
        username: "janesmith",
        status: "Inactive",
      },
      {
        fullname: "Alice Johnson",
        email: "alicejohnson@example.com",
        password: "alicePassword789",
        username: "alicejohnson",
        status: "active",
      },
    ];
    setCustomers(users);
    setLoading(false);
  }, []);

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const rowIndexTemplate = (rowData, options) => {
    return options.rowIndex + 1;
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<FontAwesomeIcon icon={faPencil} />}
          className="p-button-outlined p-button-info"
        />
        <Button
          icon={<FontAwesomeIcon icon={faEye} />}
          className="p-button-outlined p-button-success"
        />
        <Button
          icon={<FontAwesomeIcon icon={faTrash} />}
          className="p-button-outlined p-button-danger"
        />
      </div>
    );
  };

  const checkboxTemplate = (rowData) => {
    const isChecked = rowData.status === "active";
    const toggleStatus = () => {
      const updatedCustomers = customers.map((customer) =>
        customer.username === rowData.username
          ? { ...customer, status: isChecked ? "Inactive" : "active" }
          : customer
      );
      setCustomers(updatedCustomers);
    };
    return <Checkbox checked={isChecked} onChange={toggleStatus} />;
  };

  return (
    <div className="table">
      <DataTable
        value={customers}
        paginator
        stripedRows
        rows={10}
        dataKey="username" // Use a unique key for each row
        filters={filters}
        filterDisplay="row"
        loading={loading}
        emptyMessage="No customers found."
      >
        <Column
          header="#"
          body={rowIndexTemplate}
          style={{
            width: "5rem",
            backgroundColor: "--table-header-background",
          }}
        />
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "10rem" }}
        />
        <Column
          field="fullname"
          header="Full Name"
          filter
          filterPlaceholder="Search by Full Name"
          style={{ minWidth: "12rem" }}
        />

        <Column
          field="email"
          header="Email"
          filter
          filterPlaceholder="Search by Email"
          style={{ minWidth: "12rem" }}
        />

        <Column
          field="username"
          header="Username"
          filter
          filterPlaceholder="Search by Username"
          style={{ minWidth: "12rem" }}
        />

        <Column
          field="status"
          header="Status"
          showFilterMenu={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={statusBodyTemplate}
          filter
          filterElement={statusRowFilterTemplate}
        />

        <Column
          header="Active"
          body={checkboxTemplate}
          style={{ width: "6rem" }}
        />
      </DataTable>
    </div>
  );
}
