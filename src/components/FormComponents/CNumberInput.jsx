import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import React from "react";
import { Controller } from "react-hook-form";

const CNumberInput = ({
  control,
  name,
  rules,
  required,
  defaultValue = "",
  label = "",
  isEnable = true,
  type = "text",
  placeHolder = "",
  errorMessage = "This field is required!",
  showErrorMessage = true,
  autoFocus = false,
  keyFilter = "num",
  ...props
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <label htmlFor={field.name} className={`custom-label `}>
              {label}
            </label>
            <InputText
              {...field}
              id={field.name}
              type={type}
              placeholder={placeHolder}
              autoFocus={autoFocus}
              disabled={!isEnable}
              keyfilter={keyFilter}
              className={`custom-input ${error ? "input-error" : ""}`}
              value={field.value || 0} // Ensure the value is a valid number (default to 0 if undefined)
              onValueChange={(e) => {
                // Ensure the value is always set as a number
                field.onChange(e.value);
              }}
            />

            {showErrorMessage && error && (
              <span className="error-message">{errorMessage}</span>
            )}
          </>
        )}
      />
    </>
  );
};

export default CNumberInput;
