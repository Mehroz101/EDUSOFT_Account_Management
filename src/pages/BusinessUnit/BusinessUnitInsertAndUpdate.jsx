import React, { useEffect, useRef, useState } from "react";
import { FormColumn, FormRow } from "../../components/layoutComponent";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import { ColorPicker } from "primereact/colorpicker";
import { Controller, useForm } from "react-hook-form";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import SingleFileUpload from "../../components/FormComponents/SingleFileUpload";
import { useMutation } from "@tanstack/react-query";
import {
  BusinessUnitsInsertUpdate,
  GetBusinessUnits,
} from "../../Services/BusinessUnitApi";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import { notify } from "../../utils/Notification";
import { classNames } from "primereact/utils";

const BusinessUnitInsertAndUpdate = () => {
  document.title = "Business Unit";

  const { id: BusinessUnitid, mode } = useParams();
  const [actionmode, setActionMode] = useState(mode);
  const method = useForm({
    defaultValues: {
      BusinessUnitTitle: "",
      PhoneNo: "",
      MobileNo: "",
      Email: "",
      Address: "",
      Website: "",
      NTNNo: "",
      STNNo: "",
      RedColor: 0,
      GreenColor: 0,
      BlueColor: 0,
    },
  });

  const navigate = useNavigate();
  const fileRef = useRef();

  const getBusinessUnit = async (BusinessUnitid) => {
    try {
      const response = await GetBusinessUnits(BusinessUnitid);
      method.setValue("BusinessUnitTitle", response[0].BusinessUnitTitle || "");
      method.setValue("PhoneNo", response[0].PhoneNo || "");
      method.setValue("MobileNo", response[0].MobileNo || "");
      method.setValue("Email", response[0].Email || "");
      method.setValue("Address", response[0].Address || "");
      method.setValue("Website", response[0].Website || "");
      method.setValue("NTNNo", response[0].NTNNo || "");
      method.setValue("STNNo", response[0].STNNo || "");

      // Set the Logo image to the state
      if (response[0]?.Logo) {
        fileRef.current?.setBase64File(
          "data:image/png;base64," + response[0]?.Logo
        );
      }
      console.log(
        response[0].RedColor,
        response[0].GreenColor,
        response[0].BlueColor
      );
      method.setValue("PrimaryColor", {
        r: response[0].RedColor ?? 0,
        g: response[0].GreenColor ?? 0,
        b: response[0].BlueColor ?? 0,
      });

      // method.setValue("RedColor", response[0].RedColor);
      // method.setValue("GreenColor", response[0].GreenColor);
      // method.setValue("BlueColor", response[0].BlueColor);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (BusinessUnitid) {
      getBusinessUnit(BusinessUnitid);
    }
  }, [BusinessUnitid]);

  const addBusinessUnit = useMutation({
    mutationFn: BusinessUnitsInsertUpdate,
    onSuccess: (data) => {
      if (data.success) {
        notify(
          "success",
          `${actionmode || "Added"} Business Unit successfully`
        );
        navigate(ROUTES.BUSINESSUNIT.PAGE);
      } else {
        notify("error", data.message);
      }
    },
  });

  const handleFormSubmit = (data) => {
    const file = fileRef.current?.getFile();
    method.setValue("Logo", file);
    if (file) {
      data.Logo = file;
    }

    if (BusinessUnitid) {
      return addBusinessUnit.mutate({
        BusinessUnitID: BusinessUnitid,
        ...data,
      });
    } else {
      addBusinessUnit.mutate(data);
    }
  };

  return (
    <>
      <div className="page_top flex justify-content-between align-items-center">
        <h1>{actionmode} Business Unit</h1>
        {mode && (
          <Button
            label="Edit"
            onClick={() => setActionMode("Edit")}
            style={{ backgroundColor: "#640D5F", border: "none" }}
          />
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <form
          onSubmit={method.handleSubmit(handleFormSubmit)}
          className="flex flex-column gap-1 w-full"
        >
          <FormRow>
            <FormColumn>
              <CustomTextInput
                label="Business Unit Title"
                name="BusinessUnitTitle"
                isEnable={actionmode === "View" ? false : true}
                control={method.control}
                rules={{ required: "This field is required!" }}
              />
            </FormColumn>
          </FormRow>
          {/* Other form fields go here */}
          <FormRow>
            <FormColumn sm={12} md={4} lg={4} xl={4}>
              <CustomTextInput
                label="Phone No"
                name="PhoneNo"
                isEnable={actionmode === "View" ? false : true}
                control={method.control}
              />
            </FormColumn>
            <FormColumn sm={12} md={4} lg={4} xl={4}>
              <CustomTextInput
                label="Mobile No"
                name="MobileNo"
                isEnable={actionmode === "View" ? false : true}
                control={method.control}
              />
            </FormColumn>

            <FormColumn sm={12} md={4} lg={4} xl={4}>
              <CustomTextInput
                label="Email"
                name="Email"
                isEnable={actionmode === "View" ? false : true}
                control={method.control}
              />
            </FormColumn>
            <FormColumn sm={12} md={4} lg={4} xl={4}>
              <CustomTextInput
                label="Address"
                name="Address"
                isEnable={actionmode === "View" ? false : true}
                control={method.control}
              />
            </FormColumn>

            <FormColumn sm={12} md={4} lg={4} xl={4}>
              <CustomTextInput
                label="Website"
                isEnable={actionmode === "View" ? false : true}
                name="Website"
                control={method.control}
              />
            </FormColumn>
            <FormColumn sm={12} md={4} lg={4} xl={4}>
              <CustomTextInput
                label="NTN No"
                isEnable={actionmode === "View" ? false : true}
                name="NTNNo"
                control={method.control}
              />
            </FormColumn>

            <FormColumn sm={12} md={4} lg={4} xl={4}>
              <CustomTextInput
                label="STN No"
                name="STNNo"
                isEnable={actionmode === "View" ? false : true}
                control={method.control}
              />
            </FormColumn>
            <FormColumn
              sm={12}
              md={4}
              lg={4}
              xl={4}
              className="mb-3 flex flex-col gap-2"
            >
              <label htmlFor="cp-rgb"> RGB Colors</label>
              <div>
                <Controller
                  name="PrimaryColor"
                  control={method.control}
                  render={({ field, fieldState }) => (
                    <ColorPicker
                      name="PrimaryColor"
                      format="rgb"
                      control={method.control}
                      value={field.value}
                      disabled={actionmode === "View" ? true : false}
                      className={classNames({
                        "p-invalid": fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.value)}
                    />
                  )}
                />
              </div>
            </FormColumn>
          </FormRow>
          <FormRow className="flex justify-content-between align-items-center">
            <FormColumn sm={12} md={4} lg={4} xl={4}>
              <label>Logo</label>
              <SingleFileUpload
                ref={fileRef}
                accept="image/*"
                mode={actionmode === "View" ? "view" : "new"}
                chooseBtnLabel="Select Image"
                changeBtnLabel="Change Image"
                errorMessage="Upload your logo"
              />
            </FormColumn>

            <FormColumn sm={12} md={2} lg={2} xl={2}>
              <Button
                type="submit"
                label={actionmode === "Edit" ? "Update" : "Save"}
                icon="pi pi-check"
                severity="success"
                className="w-full"
                disabled={actionmode === "View" ? true : false}
              />
            </FormColumn>
          </FormRow>
        </form>
      </div>
    </>
  );
};

export default BusinessUnitInsertAndUpdate;
