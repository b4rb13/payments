import fetchGraphql from "./fetchGraphql";

export const placeOrderQuery = `
    mutation placeOrder($input: PlaceOrderInput!) {
        placeOrder(
            input: $input
        ){
        ... on RedirectionProcessorResult {
            success
            redirectUrl
            redirectMethod
        }
        ... on DropInProcessorResult {
            success
            order{
                id
                incrementId
                status
                invoices{
                    id
                    state
                }
            }
            invoice{
                id
                totalQty
                grandTotal
            }
                message
            }
        }
    }
`;

export const initializeConfig = `
    query paymentGatewayInitializationConfig($key: PaymentMethod!){
        paymentGatewayInitializationConfig(key: $key)
    }
`;

