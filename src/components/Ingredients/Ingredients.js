import React, { useReducer, useCallback, useEffect, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredientsState, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      return [...currentIngredientsState, action.payload];
    case "DELETE":
      return [...currentIngredientsState].filter(
        (ig) => ig.id !== action.payload
      );
    default:
      throw new Error("This option not accepted");
  }
};

function Ingredients() {
  const [stateIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === "DELETE_INGREDIENT") {
      dispatch({ type: "DELETE", payload: reqExtra });
    }

    if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT") {
      dispatch({
        type: "ADD",
        payload: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const submitHandler = useCallback(
    (ingredient) => {
      sendRequest(
        `https://burger-a52da.firebaseio.com/hook-ingredients.json`,
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeHandler = useCallback(
    (id) => {
      sendRequest(
        `https://burger-a52da.firebaseio.com/hook-ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        "DELETE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: "SET",
      payload: filteredIngredients,
    });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={stateIngredients}
        onRemoveItem={removeHandler}
      />
    );
  }, [stateIngredients, removeHandler]);

  return (
    <div className="App">
      <IngredientForm onSubmit={submitHandler} loading={isLoading} />
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
