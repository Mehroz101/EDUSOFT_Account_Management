import React, { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { FormColumn, FormRow } from "../../components/layoutComponent";
import CustomTextInput from "../../components/FormComponents/CustomTextInput";
import {
  CustomersDropdown,
  ProductsDropdown,
  ServicesDropdown,
} from "../../Services/CustomerInvoiceApi";
import { useQuery } from "@tanstack/react-query";
import CDropdown from "../../components/FormComponents/CDropDown";
import { formatDateToISO } from "../../utils/functions";
import CNumberInput from "../../components/FormComponents/CNumberInput";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import CAutoComplete from "../../components/FormComponents/CAutoComplete";
import { notify } from "../../utils/Notification";

const CustomerInvoiceRowEntryFields = ({ mode }) => {
  const method = useFormContext();
  const [Productitems, setProductItems] = useState([]);
  const [Serviceitems, setServiceItems] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control: method.control,
    name: "detail",
  });

  //===========================UseQuery Function===============================

  const { data: Productdropdown } = useQuery({
    queryKey: ["Productdropdown"],
    queryFn: ProductsDropdown,
  });
  const { data: Servicesdropdown } = useQuery({
    queryKey: ["Servicesdropdown"],
    queryFn: ServicesDropdown,
  });
  useEffect(() => {
    if (Productdropdown) {
      const sessions = Productdropdown.map((item) => item.label);
      setProductItems(sessions);
    }
  }, [Productdropdown]);
  useEffect(() => {
    if (Servicesdropdown) {
      const sessions = Servicesdropdown.map((item) => item.label);
      setServiceItems(sessions);
    }
  }, [Servicesdropdown]);

  //===========================onplusclick Function===============================
  const onPlusClick = () => {
    try {
      if (
        !method.getValues("Product_Header") ||
        !method.getValues("Service_Header")
      ) {
        notify("error", "Please select product and service");
        return;
      }
      if (method.getValues("Qty_Header") <= 0) {
        notify("error", "Qty should be greater than 0");
        return;
      }
      append({
        Product: method.getValues("Product_Header"),
        Service: method.getValues("Service_Header"),
        Qty: method.getValues("Qty_Header"),
        Rate: method.getValues("Rate_Header"),
        Amount: method.getValues("Amount_Header"),
        TaxPercentage: method.getValues("TaxPercentage_Header"),
        TaxAmount: method.getValues("TaxAmount_Header"),
        NetAmount: method.getValues("NetAmount_Header"),
        Description: method.getValues(""),
      });
      method.setValue("Product_Header", "");
      method.setValue("Service_Header", "");
      method.setValue("Qty_Header", 1);
      method.setValue("Rate_Header", 0);
      method.setValue("Amount_Header", 0);
      method.setValue("TaxPercentage_Header", 0);
      method.setValue("TaxAmount_Header", 0);
      method.setValue("NetAmount_Header", 0);

      method.setValue("Description_Header", "");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {!mode || mode === "Edit" ? (
        // <form>
        <FormRow>
          <FormColumn sm={12} md={4} lg={4} xl={3}>
            <label className="text-md font-semibold">
              Product Name <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CAutoComplete
              name="Product_Header"
              control={method.control}
              suggestions={Productitems || []}
              disabled={mode && mode !== "Edit"}
            />
          </FormColumn>

          <FormColumn sm={12} md={4} lg={4} xl={3}>
            <label className="text-md font-semibold">
              Service Name <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CAutoComplete
              name="Service_Header"
              control={method.control}
              suggestions={Serviceitems || []}
              disabled={mode && mode !== "Edit"}
            />
          </FormColumn>

          <FormColumn sm={4} md={2} lg={2} xl={2}>
            <label className="text-md font-semibold">
              Qty <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CNumberInput
              id={"Qty_Header"}
              control={method.control}
              disabled={mode && mode !== "Edit"}
              onChange={(e) => {
                const rate = parseFloat(method.getValues("Rate_Header")) || 0; // Ensure it's a number
                const qty = e.value || 0; // Ensure it's a number
                const amount = qty * rate;
                method.setValue("Amount_Header", amount);

                method.setValue("NetAmount_Header", amount);
              }}
            />
          </FormColumn>

          <FormColumn sm={4} md={2} lg={2} xl={2}>
            <label className="text-md font-semibold">
              Rate <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CNumberInput
              id={"Rate_Header"}
              disabled={mode && mode !== "Edit"}
              onChange={(e) => {
                const qty = parseFloat(method.getValues("Qty_Header")) || 0; // Ensure it's a number
                const rate = e.value || 0; // Ensure it's a number
                const amount = rate * qty;
                method.setValue("Amount_Header", amount);
                method.setValue("NetAmount_Header", amount);
              }}
              control={method.control}
              mode="decimal"
              maxFractionDigits={2}
            />
          </FormColumn>

          <FormColumn sm={4} md={2} lg={2} xl={2}>
            <label className="text-md font-semibold">
              Amount <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CNumberInput
              id={"Amount_Header"}
              control={method.control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled
            />
          </FormColumn>

          <FormColumn sm={4} md={2} lg={2} xl={2}>
            <label className="text-md font-semibold">
              TaxPercentage <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CNumberInput
              id={"TaxPercentage_Header"}
              control={method.control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled
            />
          </FormColumn>

          <FormColumn sm={4} md={2} lg={2} xl={2}>
            <label className="text-md font-semibold">
              TaxAmount <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CNumberInput
              id={"TaxAmount_Header"}
              control={method.control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled
            />
          </FormColumn>

          <FormColumn sm={4} md={2} lg={2} xl={2}>
            <label className="text-md font-semibold">
              NetAmount <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CNumberInput
              id={"NetAmount_Header"}
              control={method.control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled
            />
          </FormColumn>

          <FormColumn sm={12} md={4} lg={4} xl={4}>
            <CustomTextInput
              name="Description_Header"
              label="Description"
              isEnable={mode && mode === "Edit"}
              control={method.control}
              required={false}
            />
          </FormColumn>

          <FormColumn sm={2} md={2} lg={2} xl={2}>
            <Button
              type="button"
              label="Add"
              style={{ backgroundColor: "#640D5F", border: "none" }}
              onClick={onPlusClick}
              disabled={mode && mode !== "Edit"}
            />
          </FormColumn>
        </FormRow>
      ) : // </form>
      null}

      <div className="table w-full mt-4">
        <CustomerInvoiceTable
          fields={fields}
          method={method}
          remove={remove}
          mode={mode} // Add this line
          Productitems={Productitems}
          Serviceitems={Serviceitems}
        />
      </div>
    </div>
  );
};

export default CustomerInvoiceRowEntryFields;

// CustomerInvoiceTable Component
const CustomerInvoiceTable = ({
  fields,
  method,
  remove,
  mode,
  Productitems,
  Serviceitems,
}) => {
  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border border-gray-300">Product</th>
            <th className="p-2 border border-gray-300">Service</th>
            <th className="p-2 border border-gray-300">Qty</th>
            <th className="p-2 border border-gray-300">Rate</th>
            <th className="p-2 border border-gray-300">Amount</th>
            <th className="p-2 border border-gray-300">Tax Percentage</th>
            <th className="p-2 border border-gray-300">Tax Amount</th>
            <th className="p-2 border border-gray-300">Net Amount</th>
            <th className="p-2 border border-gray-300">Description</th>
            <th className="p-2 border border-gray-300">Action</th>
          </tr>
        </thead>

        <tbody>
          {fields &&
            fields.length > 0 &&
            fields.map((item, index) => (
              <CustomerInvoiceTableRow
                key={item.id}
                method={method}
                index={index}
                item={item}
                remove={remove}
                mode={mode}
                Productitems={Productitems}
                Serviceitems={Serviceitems}
              />
            ))}
        </tbody>
      </table>
    </>
  );
};

// CustomerInvoiceTableRow Component
const CustomerInvoiceTableRow = ({
  method,
  index,
  item,
  remove,
  mode,
  Productitems,
  Serviceitems,
}) => {
  return (
    <tr>
      <td>
        <CAutoComplete
          control={method.control}
          name={`detail.${index}.Product`}
          suggestions={Productitems}
          disabled={mode && mode !== "Edit"}
        />
      </td>

      <td>
        <CAutoComplete
          control={method.control}
          name={`detail.${index}.Service`}
          suggestions={Serviceitems}
          disabled={mode && mode !== "Edit"}
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.Qty`}
          control={method.control}
          disabled={mode && mode !== "Edit"}
          onChange={(e) => {
            const qty = e.value || 0;
            const rate =
              parseFloat(method.getValues(`detail.${index}.Rate`)) || 0;
            const amount = qty * rate;
            method.setValue(`detail.${index}.Amount`, amount);
            // const taxAmount =
            //   parseFloat(method.getValues(`detail.${index}.TaxAmount`)) || 0;
            // const netAmount = amount + taxAmount;
            method.setValue(`detail.${index}.NetAmount`, amount);
          }}
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.Rate`}
          control={method.control}
          disabled={mode && mode !== "Edit"}
          onChange={(e) => {
            const rate = e.value || 0;
            const qty =
              parseFloat(method.getValues(`detail.${index}.Qty`)) || 0;
            const amount = parseFloat(rate * qty);
            method.setValue(`detail.${index}.Amount`, amount);
            // const taxAmount =
            //   parseFloat(method.getValues(`detail.${index}.TaxAmount`)) || 0;
            // const netAmount = amount + taxAmount;
            method.setValue(`detail.${index}.NetAmount`, amount);
          }}
          mode="decimal"
          maxFractionDigits={2}
        />
      </td>
      <td>
        <CNumberInput
          id={`detail.${index}.Amount`}
          control={method.control}
          mode="decimal"
          maxFractionDigits={2}
          disabled
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.TaxPercentage`}
          control={method.control}
          mode="decimal"
          maxFractionDigits={2}
          disabled
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.TaxAmount`}
          control={method.control}
          mode="decimal"
          maxFractionDigits={2}
          disabled
        />
      </td>
      <td>
        <CNumberInput
          id={`detail.${index}.NetAmount`}
          control={method.control}
          mode="decimal"
          maxFractionDigits={2}
          disabled
        />
      </td>
      <td>
        <CustomTextInput
          control={method.control}
          name={`detail.${index}.Description`}
          isEnable={mode && mode === "Edit"}
        />
      </td>

      <td>
        <Button
          icon={<FontAwesomeIcon icon={faTrash} />}
          className="p-button-outlined p-button-danger"
          onClick={() => remove(index)}
          disabled={mode && mode !== "Edit"}
        />
      </td>
    </tr>
  );
};
