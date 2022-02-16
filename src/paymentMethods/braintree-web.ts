import dropin from "braintree-web-drop-in";

function braintreeFn(name: string) {
  return function braintreeweb(options: any) {
    return new Promise((res, rej) => {
      const btn = document.createElement("button");
      btn.classList.add("button", "button--small");
      btn.innerHTML = "Submit";
      dropin.create(
        {
          authorization: options.clientToken,
          container: `#${name}-container`,
          vaultManager: true,
          locale: "am",
        },
        (error, dropinInstance) => {
          document.getElementById(`${name}-container`)?.appendChild(btn);
          const link1 = document.createElement("link");
          link1.rel = "stylesheet";
          link1.href =
            "https://www.paypalobjects.com/btdevdoc/styles.b75a72f0d5284cd1dab1.css";
          document.head.appendChild(link1);
          btn.addEventListener("click", () => {
            dropinInstance?.requestPaymentMethod((error, payload) => {
              if (error) rej(error);
              btn.style.display = "none";
              res(JSON.stringify({ nonce: payload.nonce }));
            });
          });
          dropinInstance?.on("paymentMethodRequestable", function (event) {
            console.log(event.type); // The type of Payment Method, e.g 'CreditCard', 'PayPalAccount'.
            console.log(event.paymentMethodIsSelected); // True if a customer has selected a payment method when paymentMethodRequestable fires.

            btn.style.display = "block";
          });

          dropinInstance?.on("noPaymentMethodRequestable", function () {
            btn.style.display = "none";
          });
        }
      );
    });
  };
}

export default braintreeFn;
