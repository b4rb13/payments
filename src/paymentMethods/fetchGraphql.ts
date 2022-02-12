const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  Accept: "application/json",
};

const fetchGraphql =
  (query: string, url: string, headers: any | undefined = defaultHeaders) =>
  (variables?: any) => {
    console.log(variables, "LLLLOO");
    return fetch(`${url}/graphql`, {
      method: "POST",
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
  };

export default fetchGraphql;
