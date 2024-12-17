import { useMutation, useQuery } from "@tanstack/react-query";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";
import { AddClosingMonth, GetMonthClosing } from "../Services/MonthClosingApi";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { FormColumn, FormRow } from "../components/layoutComponent";
import CDatePicker from "../components/FormComponents/CDatePicker";
import { notify } from "../utils/Notification";
import { formatDateToISO } from "../utils/functions";
const MonthClosing = () => {
  document.title = "  Closing Month";
  const [visible, setVisible] = useState(false);
  const { data: MonthClosing, refetch: refetchMonthClosing } = useQuery({
    queryKey: ["MonthClosing"],
    queryFn: () => GetMonthClosing(),
  });
  const method = useForm({
    defaultValues: {
      monthClosingID: 0,
      closingMonth: new Date(),
    },
  });
  const rowIndexTemplate = (rowData, options) => {
    return options.rowIndex + 1;
  };
  const Addclosingmonth = useMutation({
    mutationFn: AddClosingMonth,
    onSuccess: (data) => {
      if (data.success) {
        notify("success", "Closing Month Added Successfully");
        refetchMonthClosing();
        setVisible(false);
        method.reset();
      } else {
        method.reset();
        notify("error", data.message);
      }
    },
  });
  return (
    <>
      <div className="page_top flex justify-content-between align-items-center">
        <h1>Month Closing</h1>
        <Button
          label="Add Closing Month"
          style={{
            maxWidth: "200px",
            backgroundColor: "#640D5F",
            outline: "none",
            border: "none",
          }}
          onClick={(e) => {
            setVisible(true);
          }}
        />
      </div>
      <div className="table">
        <DataTable
          value={MonthClosing}
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
            field="EntryDate"
            header=" Entry Date"
            style={{ minWidth: "12rem" }}
          />

          <Column
            field="ClosedMonth"
            header="Closed Month"
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      </div>
      <Dialog
        header="Add Closing Month"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <FormRow>
          <FormColumn sm={12} md={12} lg={12} xl={12}>
            <CDatePicker
              control={method.control}
              name="closingMonth"
              label="Closing Month"
              dateFormat="MM -  yy"
              view="month"
            />
          </FormColumn>
          <FormColumn sm={12} md={12} lg={12} xl={12}>
            <Button
              label="Add"
              style={{
                maxWidth: "200px",
                backgroundColor: "#640D5F",
                outline: "none",
                border: "none",
              }}
              onClick={method.handleSubmit((data) => {
                method.setValue(
                  "closingMonth",
                  formatDateToISO(data.closingMonth)
                );
                Addclosingmonth.mutate(data);
              })}
            />
          </FormColumn>
        </FormRow>
      </Dialog>
    </>
  );
};

export default MonthClosing;
