import braintreeFn from "./braintree-web";
import { placeOrderQuery, initializeConfig } from "./query";
import { PaymentMethod } from "./paymentMethodsEnum";
import AddScript from "./addScript";
import fetchGraphql from "./fetchGraphql";

type PackagesType = {
  [key: string]: Function;
};

const packages: PackagesType = {
  braintree: braintreeFn,
  // twopay: twoPayFn,
};

export enum Status {
  PENDING,
  ERROR,
  SUCCESS,
}

class PaymentMethods {
  handlePlaceOrder: (() => Promise<void>) | null;
  handleSelectPaymentMethod: (
    paymentMethod: string,
    isRedirect: boolean
  ) => void;
  showPayButton: boolean;
  status: Status | null;

  private readonly placeOrderMutation: Function;
  private readonly initializeConfigQuery: Function;
  private readonly headers: any | undefined;
  private readonly url: string;
  private orderResult: any;

  private static instance: PaymentMethods;

  public static getInstance(
    headers: any | undefined,
    url: string
  ): PaymentMethods {
    if (!PaymentMethods.instance) {
      PaymentMethods.instance = new PaymentMethods(headers, url);
    }

    return PaymentMethods.instance;
  }
  private constructor(headers: any | undefined, url: string) {
    this.handleSelectPaymentMethod = this.handleSelectPaymentMethodFn;
    this.status = null;
    this.showPayButton = false;
    this.handlePlaceOrder = null;

    this.headers = headers;
    this.url = url;
    this.orderResult = null;
    this.placeOrderMutation = fetchGraphql(
      placeOrderQuery,
      this.url,
      this.headers
    );
    this.initializeConfigQuery = fetchGraphql(
      initializeConfig,
      this.url,
      this.headers
    );
  }

  public getStatus = () => {
    return this.status;
  };

  private placeOrder(
    paymentMethod: string,
    isRedirect: boolean,
    options?: string
  ) {
    return async () => {
      try {
        this.status = Status.PENDING;

        let res = await this.placeOrderMutation({
          input: {
            paymentMethod:
              PaymentMethod[paymentMethod as keyof typeof PaymentMethod],
            ...(!isRedirect && {
              options,
            }),
          },
        });
        this.orderResult = await res.json();
        if ("errors" in this.orderResult) {
          this.status = Status.ERROR;
        } else {
          this.status = Status.SUCCESS;
        }
      } catch (e) {
        console.log(e);
        this.status = Status.ERROR;
      }
    };
  }

  private initializeDropin(paymentMethodName: string, data: any) {
    packages[paymentMethodName](paymentMethodName)(
      data.paymentGatewayInitializationConfig
    )
      .then((res: string) => {
        this.handlePlaceOrder = this.placeOrder(
          PaymentMethod[paymentMethodName as keyof typeof PaymentMethod],
          false,
          res
        );


        return;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public handleSelectPaymentMethodFn = async (
    paymentMethod: string,
    isRedirect: boolean
  ) => {
    if (paymentMethod === 'cashondelivery') {
      this.handlePlaceOrder = this.placeOrder(paymentMethod, false);
      return;
    }
    if (isRedirect) {
      this.handlePlaceOrder = this.handlePlaceOrderRedirect(paymentMethod);

      return;
    }

    const res = (await this.initializeConfigQuery({
      key: PaymentMethod[paymentMethod as keyof typeof PaymentMethod],
    })) as any;

    const data = await res.json();
    this.showPayButton =
      data.data.paymentGatewayInitializationConfig?.hasPayButton;
    if (data) {
      if (
        paymentMethod in packages &&
        !data.data.paymentGatewayInitializationConfig?.script
      ) {
        this.initializeDropin(paymentMethod, data.data);
      } else if (data.data.paymentGatewayInitializationConfig?.script) {
        AddScript(
          data.data.paymentGatewayInitializationConfig?.script,
          paymentMethod,
          () => {
            this.initializeDropin(paymentMethod, data.data);
          }
        );
      }
    }
  };

  private handlePlaceOrderRedirect(paymentMethod: string) {
    return async () => {
      await this.placeOrder(paymentMethod, true)();

      if (this.orderResult.data.placeOrder.redirectMethod === "GET") {
        window.open(this.orderResult.data.placeOrder.redirectUrl, "_top");
        return;
      }
      if (this.orderResult.data.placeOrder.redirectMethod === "POST") {
        await fetch(this.orderResult.data.placeOrder.redirectUrl, {
          method: this.orderResult.data.placeOrder.redirectMethod,
        })
          .then(() => {
            window.location.href = this.orderResult.data.placeOrder.redirectUrl;
          })
          .catch((err) => {
            console.log(err);
            this.status = Status.ERROR;
          });
      }
    };
  }
}

export default PaymentMethods;
