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

  private placeOrder(
    paymentMethod: string,
    isRedirect: boolean,
    options?: () => string
  ) {
    return async () => {
      try {
        this.status = Status.PENDING;

        let res = await this.placeOrderMutation({
          input: {

            paymentMethod:PaymentMethod[paymentMethod as keyof typeof PaymentMethod],
            ...(!isRedirect && {
              options: options?.(),
            }),
          },
        });
        this.orderResult = await res.json();
        this.status = Status.SUCCESS;
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
      .then((res: () => string) => {
        console.log(res);
        this.handlePlaceOrder = this.placeOrder(
          PaymentMethod[paymentMethodName as keyof typeof PaymentMethod],
          false,
          res
        );

        console.log(this.handlePlaceOrder, "this");

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
    if (isRedirect) {
      await this.placeOrder(paymentMethod, true)();
      console.log("tttt", this.orderResult);

      this.handlePlaceOrder = this.handlePlaceOrderRedirect(
        this.orderResult.data.placeOrder.redirectUrl as any,
        this.orderResult.data.placeOrder.redirectMethod
      );

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

  private handlePlaceOrderRedirect(url: string, method: string) {
    console.log(url, method, 'method');
    return async () => {
      if (method === "GET") {
        window.location.href = url;
        return;
      }
      if (method === "POST") {
        await fetch(url, { method })
          .then(() => {
            window.location.href = url;
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
