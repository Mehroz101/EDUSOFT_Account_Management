import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { GetBusinessUnits } from "../Services/BusinessUnitApi";
import { useForm } from "react-hook-form";
import CustomTextInput from "../components/FormComponents/CustomTextInput";
import { FormColumn, FormRow } from "../components/layoutComponent";
import { ColorPicker } from "primereact/colorpicker";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/routes";

export default function BusinessUnitTable() {
  document.title = "Business Unit";
  const [data, setData] = useState([
    {
      BusinessUnitID: 1,
      BusinessUnitTitle: "Unit 1",
      PhoneNo: "123456789",
      MobileNo: "987654321",
      Email: "unit1@example.com",
      Address: "Address 1",
      Website: "www.unit1.com",
      NTNNo: "12345",
      STNNo: "54321",
      Logo: null,
      RedColor: 255,
      GreenColor: 100,
      BlueColor: 150,
    },
    {
      BusinessUnitID: 2,
      BusinessUnitTitle: "Unit 2",
      PhoneNo: "223344556",
      MobileNo: "556677889",
      Email: "unit2@example.com",
      Address: "Address 2",
      Website: "www.unit2.com",
      NTNNo: "67890",
      STNNo: "09876",
      Logo: null,
      RedColor: 100,
      GreenColor: 200,
      BlueColor: 50,
    },
  ]);
  const [viewData, setViewData] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // To toggle between view and edit mode

  const navigate = useNavigate();
  const method = useForm({
    defaultValues: {
      BusinessUnitID: 0,
      BusinessUnitTitle: "",
      PhoneNo: "",
      MobileNo: "",
      Email: "",
      Address: "",
      Website: "",
      NTNNo: "",
      STNNo: "",
      Logo: null,
      RedColor: 255,
      GreenColor: 100,
      BlueColor: 150,
    },
  });
  //=========================== UseQuery Function===============================
  const {
    data: businessUnitsData,
    isLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["businessUnits"],
    queryFn: () => GetBusinessUnits(),
  });

  const rowIndexTemplate = (rowData, options) => {
    return options.rowIndex + 1;
  };
  useEffect(() => {
    console.log(isDialogVisible);
  }, [isDialogVisible]);
  const ActionTemplate = (rowData) => (
    <>
      <div className="flex gap-2">
        <Button
          icon={<FontAwesomeIcon icon={faEye} />}
          className="p-button-outlined p-button-success"
          onClick={() => {
            setViewData(rowData);
            setIsEditMode(false);
            navigate(
              `${ROUTES.BUSINESSUNIT.INSERTORUPDATE}/${rowData.BusinessUnitID}/View`
            );
          }}
        />
        <Button
          icon={<FontAwesomeIcon icon={faPencil} />}
          className="p-button-outlined p-button-info"
          onClick={() => {
            setViewData(rowData);
            setIsEditMode(true); // Switch to edit mode
            navigate(
              `${ROUTES.BUSINESSUNIT.INSERTORUPDATE}/${rowData.BusinessUnitID}/Edit`
            );
          }}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="page_top flex justify-content-between align-items-center">
        <h1>Business Units</h1>
        <Button
          label="Add Business Unit"
          style={{
            maxWidth: "200px",
            backgroundColor: "#640D5F",
            outline: "none",
            border: "none",
          }}
          onClick={() => {
            navigate(`${ROUTES.BUSINESSUNIT.INSERTORUPDATE}`);
          }}
        />
      </div>
      <div className="table">
        <DataTable
          value={businessUnitsData}
          paginator
          rows={15}
          stripedRows
          emptyMessage="No business units found."
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
            body={ActionTemplate}
            header="View"
            style={{ width: "6rem" }}
          />

          <Column
            field="BusinessUnitTitle"
            header="Business Unit Title"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="PhoneNo"
            header="Phone No"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="MobileNo"
            header="Mobile No"
            style={{ minWidth: "10rem" }}
          />
          <Column field="Email" header="Email" style={{ minWidth: "12rem" }} />
          <Column
            field="Address"
            header="Address"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="Website"
            header="Website"
            style={{ minWidth: "10rem" }}
          />
          <Column field="NTNNo" header="NTN No" style={{ minWidth: "8rem" }} />
          <Column field="STNNo" header="STN No" style={{ minWidth: "8rem" }} />
        </DataTable>
      </div>
    </>
  );
}
