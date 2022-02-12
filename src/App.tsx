import "./App.css";
import { useMemo, useState } from "react";
import PaymentMethods, { Status } from "./paymentMethods/pm";

const authorization =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTY0ZDNkNi1lYjU0LTQ3NGUtODA2Yi04M2M2ZmM3MTIwODYiLCJqdGkiOiJiYTVkZDM2MWI4YzI0OGZjOWU2YWJkOGMzMTE0YjRhNjY5ZTU4ZThkMWU4Yjk3MGNkNzY1ZjgyNDQzNThmN2M5MWZmZjJmNjIwNWRjNjgzZCIsImlhdCI6MTY0MjY5ODA5Mi40ODUzOTgsIm5iZiI6MTY0MjY5ODA5Mi40ODU0MDEsImV4cCI6MTY3NDIzNDA5Mi4zODkxMjEsInN1YiI6IjQiLCJzY29wZXMiOlsiKiJdfQ.j7jE6kMZtEaIuOn9PRkC04aF6-XqZ46jf8m--ebOIYIwenspZjZbTO_a3MYXu1tYaDIPps-GvROEyNQwHeRKQ_8GYUbydJX8jwjZEJnlKuUF457rnTIEGY8MdrRKOB8_bch9qGqoBEoeDZkcHjc9OJuwKlJWJo6uhkDdwk-pl4n3xZ7VRXvboZ5d5UO2j2qfxrp5s7UDtz_qp5R-6tBLQPw1xnU5Dj1s8Qb2uq5mWjr0xsWRJFNN7lb1VtJ4yasl5OZ-rPInyNIZ6GlXcSCUw39bZizzG4tlih9IIqJpQFDqbCfyp73xuSerPqjbpAwl53C0wl_3IzXUS4IUR0B5BpOIb6MDrae2p2YicFbsKx-tgz_9Sugv8k7NuEoswyklgdXq_wbJSRoXyORhHyerzwF18XNhuws0iTOqlGnWta51NpLGfJaCH4560o8VFZ_8Gs0930UqgXUxziZL3UBRyjR_-TIgjsoRaRKJ-2osFqPqhMOPfQ2RLlaWfkfWcCsWiyKqRLGRd_SJESn7T6qIS3vcfe5swOCVrpllkrs8U6YkjqE_293WsW5MPwfEIdPsgLxlUgsjsrI4oHDOzwIVlDG97-DOeOzf1L7prbHstjWNc_Ebgp-WccfgAeiC5F9jEHXF6Xl4iX7blQok8AGhGiUYmmQzfL5GElT_OUkt3Wc";
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
          action: null,
        },
        {
          method: "braintree",
          methodTitle: "Braintree",
          action: "dropin",
        },
        {
          method: "ameria",
          methodTitle: "Ameria Bank",
          action: "redirect",
        },
      ],
    },
  },
};

function App() {
  const [selected, setSelected] = useState("");

  const data1 =
    useMemo(() => {
      console.log("memo");
      return PaymentMethods.getInstance(
        {
          "X-CART-ID": 12,
          "Remote-host": "client1.ucraft.loc",
          authorization,
        },
        "http://uc-commerce-api.ucraft.loc"
      );
    }, [selected]);


  const handleSelect = (method: string, isRedirect: boolean) => {
    setSelected(method);
    data1.handleSelectPaymentMethod(method, isRedirect);
  };

  return (
    <div className="App">
      <ul id={"list"}>
        {data.data.paymentMethods.paymentMethods.map((p) => (
          <li
            key={p.method}
            onClick={() => {
              handleSelect(p.method, p.action === "redirect");
            }}
          >
            {p.methodTitle}
            <div id={`${p.method}-container`} />
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          console.log(data1, "handlePlaceOrder");

          data1.handlePlaceOrder?.();
        }}
      >
        Pay {selected}
      </button>
    </div>
  );
}

export default App;
