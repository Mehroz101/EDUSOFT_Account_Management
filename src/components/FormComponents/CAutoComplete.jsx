import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";

export default function CAutoComplete({
  control,
  name,
  suggestions = [],
  disabled = false,
  required = false,
  onChange, // Adding onChange to capture parent change event
}) {
  const [localSuggestions, setLocalSuggestions] = React.useState([]);

  useEffect(() => {
    if (suggestions) {
      setLocalSuggestions(suggestions);
    }
  }, [suggestions]);

  function onSearch(event) {
    let query = event.query.toLowerCase();
    let _filteredItems = suggestions.filter((item) =>
      item.toLowerCase().includes(query)
    );
    setLocalSuggestions(_filteredItems);
  }

  // Handle local change if no onChange is passed from parent
  const handleLocalChange = (e) => {
    // Call parent onChange if it exists
    if (onChange) {
      onChange(e); // Passing the event up to parent component
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required }}
      render={({ field, fieldState }) => (
        <>
          <AutoComplete
            inputId={field.name}
            value={field.value}
            onChange={(e) => {
              field.onChange(e); // Call React Hook Form's onChange
              handleLocalChange(e); // Call the local or passed onChange
            }}
            inputRef={field.ref}
            suggestions={localSuggestions}
            completeMethod={onSearch}
            disabled={disabled}
            dropdown
            style={{ width: "100%" }}
            pt={{
              dropdownButton: {
                root: {
                  style: {
                    padding: "0 !important",
                    background: "red !important",
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
  );
}
