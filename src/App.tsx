import "./App.css";
import { useEffect, useMemo, useState } from "react";
import PaymentMethods, { Status } from "./paymentMethods/pm";

const authorization =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTVhNDhiMC1jMDc1LTQ3Y2MtYTZjNi1iNzEyMjViZTRiZWEiLCJqdGkiOiJmMzA5MmEyOWY3YTdhODg0ZWVlNTZiMWM2YzUyZGFjMzgxOWFiNDk4ZjdjY2NlYTVkOTUxMTE0ZTkwMzhlNjUyZjgxMDFkZmYwM2VhNDc3NiIsImlhdCI6MTY0NDk5NjYwOS44NzQ3NjUsIm5iZiI6MTY0NDk5NjYwOS44NzQ3NjgsImV4cCI6MTY3NjUzMjYwOS44Njg1NTEsInN1YiI6IjI4OCIsInNjb3BlcyI6WyIqIl19.loXmRbgDljLQbuJbxuAlBswIfWcKX2cU1NWuwvrc_PkkBN3WfsCUy0d6OZ-4taH5SpEYLdH1jLrbgTmCgia3y3vpDLwjt4HCUiJtdqFgyTqL5DUINCoyERAm7cQLF47cefHKvCwyeRytHLNVHSC1_4BsfB7d_ljBhONzARxEEXPX7PkmMwGcnF9TLkbqXrcHfT7GbBDh8AydJpJRuyX8B3Mbg83VNchQueuw5IDc-aLhv5WsqcCcI3N97a0JzgFoAYyov39sl_ER_cxG5dH4O3i1RZHjSujXrZBnH-Ot_eNN_ctH3GDC8lqNr_T2i1BdaPFLTqhKVOqaO4iDClMS5fakeK53Ew1SUU3qCwkJF7AtwQ3k3ghVkXQ4c3OFZwBrifvg1_0XhZrG5FZ0Fixgb8PIATnvnh7ZXm7L54v1ClmfG4Cx1DhWMnlonqAdAva5SNNsYJP4Odt4BdPap981k2QMAuUTDPRhBA3FvIddeVgFTP_D5gs8bW5DFsJ6oAtDTWPLqNp4WogC-UP3_37hRoBrdgUNO0rDj0oZlw4894_w-DCxT1-6Q-emx--DEudfWBZkQoCzRbe6aGg62MMOpb0U4aNXKD5KgH7bqiu2kLXIZZzKRF_QZUIJsirYJ2Hp6krxR3wVqCievC7o2lqE7V7aj7nyqVrVp4sabN-I5tY";
declare global {
  interface Window {
    TwoPayClient: any;
    braintree: any;
  }
}

const data = {
  data: {
    paymentMethods: {
      success: "Success: Shipment has been selected successfully.",
      paymentMethods: [
        {
          method: "cashondelivery",
          methodTitle: "Cash On Delivery",
          interactionType: null,
        },
        {
          method: "braintree",
          methodTitle: "Braintree",
          interactionType: "drop-in",
        },
        {
          method: "ameria",
          methodTitle: "Ameria Bank",
          interactionType: "redirection",
        },
      ],
    },
  },
};

function App() {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [isRedirect, setIsRedirect] = useState(false);

  const data1 = useMemo(() => {
    return PaymentMethods.getInstance(
      {
        "X-CART-ID": 1,
        "Remote-host": "poi.ucraft.loc",
        authorization,
      },
      "http://uc-commerce-api.ucraft.loc"
    );
  }, [selected]);

  const handleSelect = (method: string, isRedirect: boolean) => {
    setSelected(method);
    setIsRedirect(isRedirect);
  };

  useEffect(() => {
    if (selected) {
      data1.handleSelectPaymentMethod(selected, isRedirect);
    }
  }, [selected, isRedirect]);

  return (
    <div className="App">
      <ul id={"list"}>
        {data.data.paymentMethods.paymentMethods.map((p) => (
          <li
            key={p.method}
            className={selected === p.method ? "active" : ""}
            onClick={() => {
              handleSelect(p.method, p.interactionType === "redirection");
            }}
          >
            {p.methodTitle}
            <div id={`${p.method}-container`} />
          </li>
        ))}
      </ul>

      <button
        disabled={!selected}
        onClick={async () => {
          try {
            setLoading(true);
            await data1.handlePlaceOrder?.();
          } catch (e) {
            console.log(e);
          } finally {
            setLoading(false);
            setStatus(data1.getStatus());
          }
        }}
      >
        {loading ? "Loading ..." : `Pay ${selected}`}
      </button>

      <br />
      <br />
      <div
        className={`status-${status && (status === 1 ? "ERROR" : "SUCCESS")}`}
      >
        {status && (status === 1 ? "ERROR" : "SUCCESS")}
      </div>
    </div>
  );
}

export default App;
