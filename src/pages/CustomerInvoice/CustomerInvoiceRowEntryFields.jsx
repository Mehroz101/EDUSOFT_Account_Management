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

const CustomerInvoiceRowEntryFields = ({ mode }) => {
  const method = useFormContext();
  const [Productitems, setProductItems] = useState([]);
  const [Serviceitems, setServiceItems] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control: method.control,
    name: "detail",
  });

  const methods = useForm({
    defaultValues: {
      Product: "",
      Service: "",
      Qty: 1,
      Rate: 0,
      Amount: 0,
      TaxPercentage: 0,
      TaxAmount: 0,
      NetAmount: 0,
      Description: "",
    },
  });
  //===========================UseQuery Function===============================
  // const { data: Customerdropdown } = useQuery({
  //   queryKey: ["Customerdropdown"],
  //   queryFn: CustomersDropdown,
  // });
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
      console.log("Productdropdown");
      console.log(Productdropdown[0].label);
      const sessions = Productdropdown.map((item) => item.label);
      setProductItems(sessions);
      methods.setValue("Product", Productdropdown[0].label);
    }
  }, [Productdropdown]);
  useEffect(() => {
    if (Servicesdropdown) {
      console.log("Servicesdropdown");
      console.log(Servicesdropdown[0].label);
      const sessions = Servicesdropdown.map((item) => item.label);
      setServiceItems(sessions);
      methods.setValue("Service", Servicesdropdown[0].label);
    }
  }, [Servicesdropdown]);
  const Productsearch = (event) => {
    let query = event.query.toLowerCase();
    let _filteredItems = Productitems.filter((item) =>
      item.toLowerCase().includes(query)
    );
    setProductItems(_filteredItems); // Set filtered suggestions
  };
  const Servicesearch = (event) => {
    let query = event.query.toLowerCase();
    let _filteredItems = Serviceitems.filter((item) =>
      item.toLowerCase().includes(query)
    );
    setServiceItems(_filteredItems); // Set filtered suggestions
  };

  //===========================onplusclick Function===============================
  const onPlusClick = () => {
    const currentValues = methods.getValues();
    if (!currentValues.Product || !currentValues.Service) {
      return;
    }
    if (currentValues.Qty <= 0) {
      return;
    }
    append({
      Product: currentValues.Product,
      Service: currentValues.Service,
      Qty: currentValues.Qty || 1,
      Rate: currentValues.Rate || 0,
      Amount: currentValues.Amount || 0,
      TaxPercentage: currentValues.TaxPercentage || 0,
      TaxAmount: currentValues.TaxAmount || 0,
      NetAmount: currentValues.NetAmount || 0,
      Description: currentValues.Description || "",
    });
  };
  const calculateTotals = () => {
    const totalAmount = fields.reduce(
      (sum, item) => sum + (item.Amount || 0),
      0
    );
    methods.setValue("totalAmount", totalAmount);
    const totalTaxAmount = fields.reduce(
      (sum, item) => sum + (item.TaxAmount || 0),
      0
    );
    methods.setValue("totalTaxAmount", totalTaxAmount);
    const totalNetAmount = fields.reduce(
      (sum, item) => sum + (item.NetAmount || 0),
      0
    );
    methods.setValue("totalNetAmount", totalNetAmount);
    return { totalAmount, totalTaxAmount, totalNetAmount };
  };

  const { totalAmount, totalTaxAmount, totalNetAmount } = calculateTotals();
  return (
    <div>
      <form onSubmit={methods.handleSubmit(onPlusClick)}>
        <FormRow>
          <FormColumn sm={12} md={4} lg={4} xl={3}>
            <label className="text-md font-semibold">
              Product Name <span className="text-red-700 fw-bold ">*</span>
            </label>
            <Controller
              name="Product"
              control={methods.control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <AutoComplete
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    suggestions={Productitems}
                    completeMethod={Productsearch}
                    disabled={mode && mode !== "Edit"}
                    dropdown
                    style={{ width: "100%" }}
                    pt={{
                      dropdownButton: {
                        root: {
                          style: {
                            padding: "0 !important",
                          },
                        },
                        icon: {
                          style: {
                            padding: "0",
                          },
                        },
                      },
                      input: {
                        style: {
                          width: "100%",
                        },
                      },
                    }}
                    className={classNames({ "p-invalid": fieldState.error })}
                  />
                </>
              )}
            />
          </FormColumn>

          <FormColumn sm={12} md={4} lg={4} xl={3}>
            <label className="text-md font-semibold">
              Service Name <span className="text-red-700 fw-bold ">*</span>
            </label>
            <Controller
              name="Service"
              control={methods.control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <AutoComplete
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    suggestions={Serviceitems}
                    completeMethod={Servicesearch}
                    disabled={mode && mode !== "Edit"}
                    dropdown
                    style={{ width: "100%" }}
                    pt={{
                      dropdownButton: {
                        root: {
                          style: {
                            padding: "0 !important",
                          },
                        },
                        icon: {
                          style: {
                            padding: "0",
                          },
                        },
                      },
                      input: {
                        style: {
                          width: "100%",
                        },
                      },
                    }}
                    className={classNames({ "p-invalid": fieldState.error })}
                  />
                </>
              )}
            />
          </FormColumn>

          <FormColumn sm={4} md={2} lg={2} xl={2}>
            <label className="text-md font-semibold">
              Qty <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CNumberInput
              id={"Qty"}
              control={methods.control}
              required
              disabled={mode && mode !== "Edit"}
              onChange={(e) => {
                const rate = parseFloat(methods.getValues("Rate")) || 0; // Ensure it's a number
                const qty = e.value || 0; // Ensure it's a number
                const amount = qty * rate;
                methods.setValue("Amount", amount);
                const taxAmount =
                  parseFloat(methods.getValues("TaxAmount")) || 0; // Ensure it's a number
                methods.setValue("NetAmount", amount + taxAmount);
              }}
            />
          </FormColumn>

          <FormColumn sm={4} md={2} lg={2} xl={2}>
            <label className="text-md font-semibold">
              Rate <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CNumberInput
              id={"Rate"}
              disabled={mode && mode !== "Edit"}
              onChange={(e) => {
                const qty = parseFloat(methods.getValues("Qty")) || 0; // Ensure it's a number
                const rate = e.value || 0; // Ensure it's a number
                const amount = rate * qty;
                methods.setValue("Amount", amount);
                const taxAmount =
                  parseFloat(methods.getValues("TaxAmount")) || 0; // Ensure it's a number
                methods.setValue("NetAmount", amount + taxAmount);
              }}
              control={methods.control}
              mode="decimal"
              maxFractionDigits={2}
            />
          </FormColumn>

          <FormColumn sm={4} md={2} lg={2} xl={2}>
            <label className="text-md font-semibold">
              Amount <span className="text-red-700 fw-bold ">*</span>
            </label>
            <CNumberInput
              id={"Amount"}
              control={methods.control}
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
              id={"TaxPercentage"}
              control={methods.control}
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
              id={"TaxAmount"}
              control={methods.control}
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
              id={"NetAmount"}
              control={methods.control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled
            />
          </FormColumn>

          <FormColumn sm={12} md={4} lg={4} xl={4}>
            <CustomTextInput
              name="Description"
              label="Description"
              isEnable={mode && mode === "Edit"}
              control={methods.control}
              required={false}
            />
          </FormColumn>

          <FormColumn sm={2} md={2} lg={2} xl={2}>
            <Button
              type="button"
              label="Add"
              color="primary"
              onClick={onPlusClick}
              disabled={mode === "Edit" ? false : true}
            />
          </FormColumn>
        </FormRow>
      </form>
      <div className="table w-full mt-4">
        <CustomerInvoiceTable
          fields={fields}
          method={methods}
          append={append}
          remove={remove}
          mode={mode} // Add this line
        />
      </div>

      <div className="totalAmounts mt-8 p-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-content-center gap-4 space-x-6">
          <div
            className=" box flex flex-col"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p className="text-lg font-semibold text-gray-700">Total Amount</p>
            <p className="text-lg font-semibold bg-gray-200 p-2 rounded-lg text-gray-800">
              {totalAmount}
            </p>
          </div>
          <div
            className="box flex flex-col items-end"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p className="text-lg font-semibold text-gray-700">
              Total Tax Amount
            </p>
            <p className="text-lg font-semibold bg-gray-200 p-2 rounded-lg text-gray-800">
              {totalTaxAmount}
            </p>
          </div>
          <div
            className=" boxflex flex-col items-end"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p className="text-lg font-semibold text-gray-700">
              Total Net Amount
            </p>
            <p className="text-lg font-semibold bg-gray-200 p-2 rounded-lg text-gray-800">
              {totalNetAmount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInvoiceRowEntryFields;

// CustomerInvoiceTable Component
const CustomerInvoiceTable = ({ fields, method, append, remove, mode }) => {
  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border border-gray-300">Product</th>
            <th className="p-2 border border-gray-300">Service</th>
            <th className="p-2 border border-gray-300">Qty</th>
            <th className="p-2 border border-gray-300">Rate</th>
            <th className="p-2 border border-gray-300">Net Amount</th>
            <th className="p-2 border border-gray-300">Tax Percentage</th>
            <th className="p-2 border border-gray-300">Tax Amount</th>
            <th className="p-2 border border-gray-300">Amount</th>
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
                control={method.control}
                method={method}
                index={index}
                item={item}
                remove={remove}
                mode={mode}
              />
            ))}
        </tbody>
      </table>
    </>
  );
};

// CustomerInvoiceTableRow Component
const CustomerInvoiceTableRow = ({
  control,
  method,
  index,
  item,
  remove,
  mode,
}) => {
  const [amount, setAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  useEffect(() => {
    console.log(item.Amount);
    setAmount(item.Amount);
    setNetAmount(item.NetAmount);
  }, [item.Amount, item.NetAmount, item.Qty, item.Rate, item.TaxPercentage]);
  return (
    <tr>
      <td>
        <CustomTextInput
          control={control}
          name={`detail.${index}.Product`}
          defaultValue={item.Product}
          isEnable={mode && mode === "Edit"}
        />
      </td>

      <td>
        <CustomTextInput
          control={control}
          name={`detail.${index}.Service`}
          defaultValue={item.Service}
          isEnable={mode && mode === "Edit"}
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.Qty`}
          control={control}
          value={item.Qty}
          disabled={mode && mode !== "Edit"}
          onChange={(e) => {
            const rate = parseFloat(item.Rate) || 0;
            const qty = e.value || 0;
            const amount = qty * rate;
            //  setAmount(amount);
            method.setValue(`detail.${index}.Amount`, amount);

            // Recalculate TaxAmount (if any logic is involved)
            const taxAmount = parseFloat(item.TaxAmount) || 0;
            const netAmount = amount + taxAmount;
            //    setNetAmount(netAmount);
            method.setValue(`detail.${index}.NetAmount`, netAmount);
            console.log(
              "NetAmount:",
              method.getValues(`detail.${index}.NetAmount`)
            );
            console.log("Amount:", method.getValues(`detail.${index}.Amount`));
          }}
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.Rate`}
          control={control}
          value={item.Rate}
          disabled={mode && mode !== "Edit"}
          onChange={(e) => {
            const rate = e.value || 0;
            const qty = parseFloat(item.Qty) || 0;
            const amount = rate * qty;
            setAmount(amount);
            method.setValue(`detail.${index}.Amount`, amount);

            // Recalculate NetAmount when Rate is changed
            const taxAmount = parseFloat(item.taxAmount) || 0;
            const netAmount = amount + taxAmount;
            setNetAmount(netAmount);
            method.setValue(`detail.${index}.NetAmount`, netAmount);

            console.log(
              "NetAmount:",
              method.getValues(`detail.${index}.NetAmount`)
            );
            console.log("Amount:", method.getValues(`detail.${index}.Amount`));
          }}
          mode="decimal"
          maxFractionDigits={2}
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.NetAmount`}
          control={control}
          value={netAmount}
          mode="decimal"
          maxFractionDigits={2}
          disabled
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.TaxPercentage`}
          control={control}
          value={item.TaxPercentage}
          mode="decimal"
          maxFractionDigits={2}
          disabled
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.TaxAmount`}
          control={control}
          value={item.TaxAmount}
          mode="decimal"
          maxFractionDigits={2}
          disabled
        />
      </td>

      <td>
        <CNumberInput
          id={`detail.${index}.Amount`}
          control={control}
          value={amount}
          mode="decimal"
          maxFractionDigits={2}
          disabled
        />
      </td>

      <td>
        <CustomTextInput
          control={control}
          name={`detail.${index}.Description`}
          defaultValue={item.Description}
          isEnable={mode && mode === "Edit"}
        />
      </td>

      <td>
        <Button
          icon={<FontAwesomeIcon icon={faTrash} />}
          className="p-button-outlined p-button-danger"
          onClick={() => remove(index)}
        />
      </td>
    </tr>
  );
};
