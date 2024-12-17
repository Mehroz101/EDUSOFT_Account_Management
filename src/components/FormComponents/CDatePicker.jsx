import { Calendar } from "primereact/calendar";
import React from "react";
import { Controller } from "react-hook-form";

const CDatePicker = ({
  control,
  name,
  rules,
  required,
  defaultValue = "",
  label = "",
  isEnable = true,
  type = "date",
  placeholder = "",
  errorMessage = "This field is required!",
  showErrorMessage = true,
  autoFocus = false,
  ...props
}) => {
  return (
    <>
      <div className="custom-input-container">
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
              <Calendar
                {...field}
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                placeholder={placeholder}
                disabled={!isEnable}
                autoFocus={autoFocus}
                {...props}
                className={`custom-input border-0 p-0 w-full  ${
                  error ? "input-error" : ""
                }`}
              />

              {showErrorMessage && error && (
                <div className="error-message">{error.message}</div>
              )}
            </>
          )}
        />
      </div>
    </>
  );
};

export default CDatePicker;
