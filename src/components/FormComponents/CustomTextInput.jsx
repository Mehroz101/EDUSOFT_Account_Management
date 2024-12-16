import React from "react";
import { Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
const CustomTextInput = ({
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
  ...props
}) => {
  return (
    <div className="custom-input-container  ">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <label htmlFor={field.name} className={`custom-label `}>
              {label}
              {required && <span className="text-red-700 fw-bold ">*</span>}
            </label>
            <InputText
              {...field}
              id={field.name}
              type={type}
              placeholder={placeHolder}
              autoFocus={autoFocus}
              disabled={!isEnable}
              placeHolder={placeHolder}
              className={`custom-input ${error ? "input-error" : ""}`}
            />

            {showErrorMessage && error && (
              <span className="error-message">{errorMessage}</span>
            )}
          </>
        )}
      />
    </div>
  );
};

export default CustomTextInput;
