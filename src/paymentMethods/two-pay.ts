function twoPayFn(name: string) {
  return function (clientId: string) {
    const jsPaymentClient = new window.TwoPayClient(clientId);
    const component = jsPaymentClient.components.create("card");
    component.mount(`#${name}-container`);
    const nameField = document.createElement("input")
    nameField.id = 'name';


    // Extract the Name field value
    const billingDetails = {
      name: "name",
    };
    jsPaymentClient.tokens
      .generate(component, billingDetails)
      .then((response: any) => {
        console.log(response.token);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
}

export default twoPayFn;
