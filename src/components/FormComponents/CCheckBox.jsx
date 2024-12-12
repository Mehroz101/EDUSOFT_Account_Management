import { Checkbox } from "primereact/checkbox";
import React from "react";
import { Controller } from "react-hook-form";

const CCheckBox = ({
  control,
  name,
  rules,
  required,
  defaultValue = "",
  label = "",
  isEnable = true,
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
              </label>
              <Checkbox
                {...field}
                id={field.name}
                name={field.name}
                checked={field.value}
                disabled={!isEnable}
                autoFocus={autoFocus}
              />
              {showErrorMessage && error && (
                <span className="error-message">{errorMessage}</span>
              )}
            </>
          )}
        />
      </div>
    </>
  );
};

export default CCheckBox;
