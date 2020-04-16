export const copy = (content) => {
  const textSpan = document.createElement("span");
  textSpan.innerText = content;
  textSpan.style.display = "fixed";
  textSpan.style.left = "0";
  textSpan.style.right = "0";
  document.body.appendChild(textSpan);
  const range = document.createRange();
  range.selectNode(textSpan);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  const res = document.execCommand("copy");
  selection.removeAllRanges();
  document.body.removeChild(textSpan);
  return res;
};
