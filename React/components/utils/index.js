export function copyToClipboard(text, { output = true, triggerAlert, onCopy } = {}) {
  navigator.clipboard.writeText(text);

  if (output) {
    console.log(text);
  }

  if (triggerAlert) {
    alert('Copied to clipboard');
  }

  if (typeof onCopy === 'function') {
    onCopy(text);
  }
}
