function deleteExistingScript(scriptId: string): void {
  const existingScript = document.getElementById(`${scriptId}-script`);

  if (existingScript) {
    existingScript.remove();
  }
}

const AddScript = (
  src: string,
  paymentMethodeCode: string,
  onLoad: (this: GlobalEventHandlers, ev: Event) => void
) => {
  deleteExistingScript(paymentMethodeCode);
  const script = document.createElement("script");
  script.src = src;
  script.id = `${paymentMethodeCode}-script`;
  script.async = true;
  script.onload = onLoad;
  document.body.appendChild(script);
  return script;
};

export default AddScript;
