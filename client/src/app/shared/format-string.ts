export const formatString = (str: string, ...args) => {
  return str.replace(/{(\d+)}/g, (match, idx) => {
    return typeof args[idx] !== 'undefined' ? args[idx] : match;
  });
};
