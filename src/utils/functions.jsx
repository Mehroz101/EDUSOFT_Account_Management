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
