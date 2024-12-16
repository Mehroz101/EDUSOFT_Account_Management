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
import { Dialog } from "primereact/dialog";
import CustomTextInput from "../components/FormComponents/CustomTextInput";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetAllUsers, UsersInsertUpdate } from "../Services/UserApi";
import CCheckBox from "../components/FormComponents/CCheckBox";
import { notify } from "../utils/Notification";

export default function Users() {
  document.title = "Users";

  const [userPopup, setUserPopup] = useState(false);
  const [mode, setMode] = useState("create"); // "create" or "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FullName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    Email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    UserName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const LoginUserID = localStorage.getItem("userID");
  const method = useForm({
    defaultValues: {
      userID: LoginUserID,
      UserName: "",
      FullName: "",
      Email: "",
      Password: "",
      InActive: false,
    },
  });

  //=========================== UseQuery Function===============================
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => GetAllUsers(),
  });
  //===========================UseMutation Function===============================
  const AddUser = useMutation({
    mutationFn: UsersInsertUpdate,
    onSuccess: (data) => {
      if (data.success) {
        console.log("success");
        notify("success", "User added successfully");
        refetchUsers();
        setUserPopup(false);
      } else {
        console.log("error occure");
        notify("error", data.message);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
  //===========================handleFormSubmit Function===============================
  const handleFormSubmit = (data) => {
    console.log(data);
    const sendData = {
      userID: data.UserID,
      fullName: data.FullName,
      email: data.Email,
      userName: data.UserName,
      password: data.Password,
      inActive: data.InActive ? 1 : 0,
    };
    AddUser.mutate(sendData);
  };
  const openEditPopup = (user) => {
    setMode("edit");
    setSelectedUser(user);
    method.setValue("UserID", user.UserID);
    if (user) {
      method.reset(user); // Pre-fill form with selected user data
    }
    setUserPopup(true);
  };

  const rowIndexTemplate = (rowData, options) => {
    return options.rowIndex + 1;
  };
  //===========================actionTemplate Function===============================
  const actionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<FontAwesomeIcon icon={faPencil} />}
          className="p-button-outlined p-button-info"
          onClick={() => openEditPopup(rowData)}
        />
        {/* <Button
          icon={<FontAwesomeIcon icon={faEye} />}
          className="p-button-outlined p-button-success"
        /> */}
        {/* <Button
          icon={<FontAwesomeIcon icon={faTrash} />}
          className="p-button-outlined p-button-danger"
        /> */}
      </div>
    );
  };
  //===========================checkboxTemplate Function===============================
  const checkboxTemplate = (rowData) => {
    const toggleStatus = () => {};
    return <Checkbox checked={rowData.InActive} onChange={toggleStatus} />;
  };
  //===========================render Function===============================
  return (
    <>
      <div className="page_top flex justify-content-between align-items-center">
        <h1>Users</h1>
        <Button
          label="Add User"
          style={{
            maxWidth: "200px",
            backgroundColor: "#640D5F",
            outline: "none",
            border: "none",
          }}
          onClick={() => {
            method.reset({
              FullName: "",
              UserName: "",
              Email: "",
              Password: "",
              InActive: false,
            }); // Reset all fields to empty values
            setUserPopup(true);
            setMode("create");
          }}
        />
      </div>
      <div className="table">
        <DataTable
          value={usersData}
          paginator
          stripedRows
          rows={10}
          dataKey="username" // Use a unique key for each row
          filters={filters}
          filterDisplay="row"
          emptyMessage="No users found."
        >
          <Column
            header="#"
            body={rowIndexTemplate}
            style={{
              width: "5rem",
            }}
          />
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: "10rem" }}
          />
          <Column
            field="FullName"
            header="Full Name"
            filter
            filterPlaceholder="Search by Full Name"
            style={{ minWidth: "12rem" }}
          />

          <Column
            field="Email"
            header="Email"
            filter
            filterPlaceholder="Search by Email"
            style={{ minWidth: "12rem" }}
          />

          <Column
            field="UserName"
            header="Username"
            filter
            filterPlaceholder="Search by Username"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="Password"
            header="Password"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="InActive"
            header="Active"
            body={checkboxTemplate}
            style={{ width: "6rem" }}
          />
        </DataTable>
      </div>

      <Dialog
        header={mode === "create" ? "Add User" : "Edit User"}
        visible={userPopup}
        style={{ width: "50vw" }}
        onHide={() => {
          setUserPopup(false);
          method.reset({
            FullName: "",
            UserName: "",
            Email: "",
            Password: "",
            InActive: false,
          });
          setSelectedUser(null);
        }}
      >
        <form
          onSubmit={method.handleSubmit(handleFormSubmit)}
          className="flex flex-column gap-3"
        >
          <CustomTextInput
            name="FullName"
            label="Full Name"
            control={method.control}
            rules={{ required: "Full Name is required" }}
          />
          <CustomTextInput
            name="UserName"
            label="Username"
            control={method.control}
            rules={{ required: "Username is required" }}
          />
          <CustomTextInput
            name="Email"
            label="Email"
            control={method.control}
            rules={{ required: "Email is required" }}
          />

          <CustomTextInput
            name="Password"
            label="Password"
            type="password"
            control={method.control}
            rules={{ required: "Password is required" }}
          />
          <CCheckBox name="InActive" label="Active" control={method.control} />
          <Button
            label={mode === "create" ? "Create" : "Update"}
            style={{
              maxWidth: "200px",
              backgroundColor: "#640D5F",
              outline: "none",
              border: "none",
            }}
          />
        </form>
      </Dialog>
    </>
  );
}
