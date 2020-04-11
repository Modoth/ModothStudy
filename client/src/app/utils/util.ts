export const isNullOrSpace = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
};
