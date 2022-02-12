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
export type ActionType = "dropin" | "redirect";

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
    type: "dropin",
  },
  {
    name: PaymentMethods.BrainTree,
    type: "dropin",
  },
  {
    name: PaymentMethods.TwoCheckout,
    type: "dropin",
  },
  {
    name: PaymentMethods.AmeriaBank,
    type: "redirect",
    url: "https://google.com/",
  },
  {
    name: PaymentMethods.ConverseBank,
    type: "redirect",
  },
  {
    name: PaymentMethods.ArdshinBank,
    type: "redirect",
  },
  {
    name: PaymentMethods.EvocaBank,
    type: "redirect",
  },
  {
    name: PaymentMethods.Stripe,
    type: "dropin",
  },
];
