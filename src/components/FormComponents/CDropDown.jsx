import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import React from "react";
import { Controller } from "react-hook-form";

const CDropdown = ({
  control,
  name,
  onChange,
  focusOptions = () => null,
  options = [],
  placeholder = "",
  optionLabel = "label",
  optionValue = "value",
  required = false,
  showOnFocus = true,
  showClear = false,
  filter = true,
  disabled = false,
  showErrorMessage = true,
  errorMessage = "This field is required!",
  value,
  autoFocus = false,
  ...moreOptions
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field, fieldState }) => (
          <>
            <Dropdown
              id={field.name}
              value={field.value}
              optionLabel={optionLabel}
              optionValue={optionValue}
              placeholder={placeholder}
              options={options}
              focusInputRef={field.ref}
              ref={field.ref}
              autoFocus={autoFocus}
              onChange={(e) => {
                field.onChange(e.value);
                if (focusOptions) {
                  if (
                    e.originalEvent.key === "ArrowDown" ||
                    e.originalEvent.key === "ArrowUp"
                  ) {
                  } else {
                    focusOptions(e);
                    let obj = {
                      value: e.value,
                      label: e?.originalEvent?.target?.innerText,
                      ref: field.ref,
                    };

                    if (onChange) {
                      onChange(obj);
                    }
                  }
                }
              }}
              defaultValue={""}
              onKeyDown={(e) => {
                if (focusOptions) {
                  if (e.key === "Enter") {
                    focusOptions(e);
                    let obj = {
                      value: field.value,
                    };
                    if (onChange) {
                      onChange(obj);
                    }
                  }
                }
              }}
              showOnFocus={showOnFocus}
              disabled={disabled}
              showClear={showClear}
              className={classNames({
                "p-invalid": fieldState.error,
              })}
              filter={filter}
              style={{
                width: "100%",
              }}
              pt={{
                input: {
                  style: {
                    padding: "0.25rem 0.4rem",
                    fontSize: ".9em",
                  },
                },
                item: {
                  style: {
                    padding: "0.4rem 0.4rem",
                  },
                },
              }}
              resetFilterOnHide
              {...moreOptions}
            />
            {showErrorMessage && (
              <>
                <span className="text-red-700 text-sm">
                  {fieldState.error ? errorMessage : ""}
                </span>
              </>
            )}
          </>
        )}
      />
    </>
  );
};

export const CDropdownWithOutControl = ({
  name,
  onChange,
  focusOptions,
  options = [],
  placeholder = "",
  optionLabel = "label",
  optionValue = "value",
  required = false,
  showOnFocus = true,
  showClear = false,
  filter = true,
  disabled = false,
  ...moreOptions
}) => {
  return (
    <Dropdown
      id={name}
      value={options.value}
      optionLabel={optionLabel}
      optionValue={optionValue}
      placeholder={placeholder}
      options={options}
      filter
      pt={{
        input: {
          style: {
            padding: "0.25rem 0.4rem",
            fontSize: ".9em",
          },
        },
        item: {
          style: {
            padding: "0.4rem 0.4rem",
          },
        },
      }}
      resetFilterOnHide
      {...moreOptions}
    />
  );
};

export default CDropdown;
