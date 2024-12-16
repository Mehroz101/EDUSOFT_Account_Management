import React from "react";
import { Controller } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";

const NumberInput = ({
  label = "",
  id,
  control,
  enterKeyOptions,
  required = false,
  disabled = false,
  ...options
}) => {
  return (
    <Controller
      name={id}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <>
          <InputNumber
            id={field.name}
            inputRef={field.ref}
            value={field.value}
            onBlur={field.onBlur}
            onValueChange={(e) => {
              field.onChange(e);
            }}
            className={classNames({
              "p-invalid": fieldState.error,
            })}
            pt={{
              root: {
                className: "small-input",
              },
              input: {
                root: {
                  style: {
                    width: "100%",
                  },
                },
              },
            }}
            style={{
              width: "100%",
            }}
            onKeyDown={(e) => {
              if (enterKeyOptions) {
                if (e.key === "Enter") {
                  enterKeyOptions();
                }
              }
            }}
            disabled={disabled}
            aria-autocomplete="off"
            {...options}
          />
        </>
      )}
    />
  );
};

export default NumberInput;
