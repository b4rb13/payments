import dropin, { Options } from "braintree-web-drop-in";

function braintreeFn(name: string) {
  return function braintreeweb(options: any) {
    console.log(options, 'pppppppp');
    return new Promise((res, rej) => {
      dropin.create(
        {
          authorization: options.clientToken,
          container: `#${name}-container`,
        },
        (error, dropinInstance) => {
          res(function () {
            return dropinInstance?.requestPaymentMethod((error, payload) => {
              if (error) console.error(error, "error");

              console.log(payload, "<<<");

              return { nonce: payload.nonce };
            });
          });

          rej(error);
        }
      );
    });
  };
}

export default braintreeFn;
