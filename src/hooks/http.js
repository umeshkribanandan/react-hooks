import { useReducer, useCallback } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  reqExtra: null,
  reqIdentifier: null,
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        reqExtra: null,
        reqIdentifier: action.reqIdentifier,
      };
    case "RESPONSE":
      return {
        ...httpState,
        loading: false,
        data: action.payload,
        reqExtra: action.reqExtra,
      };
    case "ERROR":
      return { loading: false, error: action.payload, data: null };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("This option not accepted");
  }
};

const useHttp = () => {
  const [httpState, httpDispatch] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => httpDispatch({ type: "CLEAR" }), []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      httpDispatch({ type: "SEND", reqIdentifier });
      fetch(url, {
        method: method,
        body: body,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          httpDispatch({
            type: "RESPONSE",
            payload: responseData,
            reqExtra: reqExtra,
          });
        })
        .catch((error) => {
          httpDispatch({ type: "ERROR", payload: "Somehting went wrong!" });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest,
    reqExtra: httpState.reqExtra,
    reqIdentifier: httpState.reqIdentifier,
    clear: clear,
  };
};

export default useHttp;
