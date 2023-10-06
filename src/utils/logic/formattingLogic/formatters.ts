export const formatNumberplate = (value: string): string => {
  // Remove all spaces
  value = value.replace(/\s+/g, "");

  if (value.length > 2) {
    value = value.slice(0, 2) + " " + value.slice(2);
  }

  if (value.length > 5) {
    value = value.slice(0, 5) + " " + value.slice(5);
  }

  return value;
};
//journalnumber logic
export const formatJournalNumber = (value: string): string => {
  // Remove all hyphens
  value = value.replace(/-/g, "");

  if (value.length > 4) {
    value = value.slice(0, 4) + "-" + value.slice(4);
  }

  if (value.length > 10) {
    value = value.slice(0, 10) + "-" + value.slice(10);
  }

  if (value.length > 16) {
    value = value.slice(0, 16) + "-" + value.slice(16);
  }

  return value;
};
//SSN logic
export const formatSSN = (value: string): string => {
  // Remove all hyphens
  value = value.replace(/-/g, "");

  if (value.length > 6) {
    value = value.slice(0, 6) + "-" + value.slice(6);
  }

  return value;
};
