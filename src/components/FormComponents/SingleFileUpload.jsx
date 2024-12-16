import { Button } from "primereact/button";

import { Image } from "primereact/image";
import React, { useRef, useState } from "react";
import { useClickOutside } from "primereact/hooks";
import { convertBase64StringToFile, downloadFile } from "../../utils/functions";

const SingleFileUpload = React.forwardRef(
  (
    {
      height = "35vh",
      accept = "",
      background = "",
      chooseBtnLabel = "Choose File...",
      changeBtnLabel = "Change File...",
      mode = "new",
      errorMessage = "Please select a file",
    },
    ref
  ) => {
    const [currentFile, setCurrentFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showPdf, setShowPdf] = useState(false);

    const imageRef = useRef();
    const inputRef = useRef();
    const overLayRef = useRef();

    React.useImperativeHandle(ref, () => ({
      getFile(getFromInputField = true) {
        if (getFromInputField && inputRef.current?.files[0]) {
          return inputRef.current?.files[0];
        } else {
          return currentFile;
        }
      },
      setFile(file) {
        setCurrentFile(file);
      },
      setError() {
        setError(true);
      },
      setBase64File(base64String) {
        try {
          const file = convertBase64StringToFile(base64String, true);

          setCurrentFile(file);
        } catch (e) {
          console.log(e.message);
        }
      },
      removeFile() {
        setCurrentFile(null);
      },
      emptyInputField() {
        setCurrentFile(null);
      },
    }));

    const onFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setCurrentFile(file);
        setError(false);
      }
    };

    useClickOutside(overLayRef, () => {
      setShowPdf(false);
    });

    // useKeyDownListnerHook(
    //   () => {
    //     setShowPdf(false);
    //   },
    //   ["Escape"],
    //   showPdf
    // );

    return (
      <>
        <div
          className={`flex flex-column  p-2`}
          style={{
            minHeight: height,
            border: "dashed",
            borderRadius: ".5rem",
            borderColor: error ? "red" : "",
            background: background,
            position: "relative",
          }}
        >
          <div className="flex-none">
            {error ? (
              <p
                style={{
                  padding: 0,
                  margin: 0,
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                {errorMessage}
              </p>
            ) : null}
          </div>
          <div className="flex flex-1 w-full">
            <div className="flex align-items-center justify-content-center w-full">
              <div className="flex flex-column gap-2">
                <Button
                  label={currentFile === null ? chooseBtnLabel : changeBtnLabel}
                  icon="pi pi-plus"
                  onClick={() => inputRef.current?.click()}
                  severity="secondary"
                  type="button"
                  className="rounded w-full"
                  disabled={mode === "view"}
                  pt={{
                    label: {
                      className: "hidden md:block lg:block",
                    },
                  }}
                />
                {currentFile?.type.includes("pdf") && (
                  <>
                    <Button
                      label="Preview"
                      icon="pi pi-eye"
                      onClick={() => setShowPdf(!showPdf)}
                      severity="info"
                      type="button"
                      className="rounded w-full"
                      disabled={currentFile === null}
                      pt={{
                        label: {
                          className: "hidden md:block lg:block",
                        },
                      }}
                    />
                  </>
                )}

                <Button
                  label="Remove"
                  icon="pi pi-times"
                  onClick={() => {
                    setShowPdf(false);
                    setCurrentFile(null);
                  }}
                  severity="danger"
                  type="button"
                  className="rounded w-full p-button-text"
                  disabled={currentFile === null || mode === "view"}
                  pt={{
                    label: {
                      className: "hidden md:block lg:block",
                    },
                  }}
                />

                {mode === "view" && (
                  <>
                    <Button
                      label="Download"
                      icon="pi pi-download"
                      onClick={() => {
                        downloadFile(currentFile);
                      }}
                      severity="primary "
                      type="button"
                      className="rounded w-full"
                      disabled={currentFile === null}
                      pt={{
                        label: {
                          className: "hidden md:block lg:block",
                        },
                      }}
                    />
                  </>
                )}
              </div>

              <input
                type="file"
                style={{ display: "none" }}
                id="file"
                name="file"
                onChange={onFileChange}
                ref={inputRef}
                accept={accept}
              />
            </div>
            <div
              className="flex align-items-center justify-content-center"
              style={{ minWidth: "65%" }}
            >
              {isLoading ? (
                <>
                  <CustomSpinner />
                </>
              ) : (
                <>
                  {currentFile !== null &&
                  currentFile?.type.includes("image") ? (
                    <>
                      <Image
                        src={URL.createObjectURL(currentFile)}
                        alt="Uploaded File"
                        ref={imageRef}
                        width="100"
                        height="100"
                        preview
                        style={{
                          userSelect: "none",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      {currentFile?.type.includes("pdf") ? (
                        <>
                          <div
                            onClick={() => setShowPdf(!showPdf)}
                            style={{ cursor: "pointer" }}
                          >
                            <iframe
                              src={URL.createObjectURL(currentFile)}
                              height={"100%"}
                              width={"100%"}
                            ></iframe>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex align-items-center flex-column gap-2">
                            <i className="pi pi-file text-7xl"></i>

                            <span className="text-sm">
                              {currentFile?.name ?? "No file uploaded"}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {showPdf && (
          <>
            <div
              className="flex align-items-center justify-content-center"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                background: "rgba(0,0,0,0.5)",
              }}
            >
              <iframe
                ref={overLayRef}
                src={URL.createObjectURL(currentFile)}
                style={{
                  width: "80vw",
                  height: "90vh",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              ></iframe>
            </div>
          </>
        )}
      </>
    );
  }
);

export default SingleFileUpload;
