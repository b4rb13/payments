export enum PaymentMethods {
  PayPal = "paypal",
  BrainTree = "braintree",
  TwoCheckout = "twopay",
  AmeriaBank = "ameria",
  ConverseBank = "converse",
  ArdshinBank = "ardshin",
  EvocaBank = "evoca",
  Stripe = "stripe",
}
export type ActionType = "drop-in" | "redirection";

interface ConfigType {
  name: PaymentMethods;
  type: ActionType;
  clientId?: string;
  clientTokenPropName?: string;
  url?: string;
}

type ConfigsType = Array<ConfigType>;

export const paymentConfigs: ConfigsType = [
  {
    name: PaymentMethods.PayPal,
    type: "drop-in",
  },
  {
    name: PaymentMethods.BrainTree,
    type: "drop-in",
  },
  {
    name: PaymentMethods.TwoCheckout,
    type: "drop-in",
  },
  {
    name: PaymentMethods.AmeriaBank,
    type: "redirection",
    url: "https://google.com/",
  },
  {
    name: PaymentMethods.ConverseBank,
    type: "redirection",
  },
  {
    name: PaymentMethods.ArdshinBank,
    type: "redirection",
  },
  {
    name: PaymentMethods.EvocaBank,
    type: "redirection",
  },
  {
    name: PaymentMethods.Stripe,
    type: "drop-in",
  },
];
