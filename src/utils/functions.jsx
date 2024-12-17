export function formatDateToISO(date) {
  const d = new Date(date);

  // Get the year, month, day, hours, minutes, and seconds
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // month is 0-indexed, so add 1
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  // Construct the formatted date string
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
export function formatDateToCustom(dateInput) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(dateInput);

  if (isNaN(date)) {
    throw new Error("Invalid date input");
  }

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function convertBase64StringToFile(imageString, withBase64 = false) {
  let base64Image = "";
  if (!withBase64) {
    base64Image = "data:image/png;base64," + imageString;
  } else {
    base64Image = imageString;
  }
  const byteString = atob(base64Image.split(",")[1]);
  const bytes = new ArrayBuffer(byteString.length);
  const byteArray = new Uint8Array(bytes);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: "image/png" });
  const fileName = "image.png";
  const file = new File([blob], fileName, { type: "image/png" });
  return file;
}

export const downloadFile = (file, fileName = null) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName ?? file.name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
