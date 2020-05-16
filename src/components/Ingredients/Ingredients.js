import React, { useReducer, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...httpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.payload };
    case "CLEAR":
      return { loading: false, error: null };
    default:
      throw new Error("This option not accepted");
  }
};
function Ingredients() {
  const [stateIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  //const [stateIngredients, setStateIngredients] = useState([]);
  //const [isLoading, setisLoading] = useState(false);
  //const [error, setError] = useState();

  const submitHandler = (ingredient) => {
    httpDispatch({ type: "SEND" });
    fetch("https://burger-a52da.firebaseio.com/hook-ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        httpDispatch({ type: "RESPONSE" });
        dispatch({
          type: "ADD",
          payload: { id: responseData.name, ...ingredient },
        });
        // setStateIngredients((prevStateIngredents) => [
        //   ...prevStateIngredents,
        //   { id: responseData.name, ...ingredient },
        // ]);
      })
      .catch((error) => {
        httpDispatch({ type: "ERROR", payload: "Somehting went wrong!" });
      });
  };

  const removeHandler = (id) => {
    httpDispatch({ type: "SEND" });
    fetch(`https://burger-a52da.firebaseio.com/hook-ingredients/${id}.json`, {
      method: "DELETE",
    })
      .then((response) => {
        httpDispatch({ type: "RESPONSE" });
        dispatch({
          type: "DELETE",
          payload: id,
        });
        // setStateIngredients((prevStateIngredents) => {
        //   const tempArray = [...prevStateIngredents].filter(
        //     (ig) => ig.id !== id
        //   );
        //   return tempArray;
        // });
      })
      .catch((error) => {
        httpDispatch({ type: "ERROR", payload: "Somehting went wrong!" });
      });
  };

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: "SET",
      payload: filteredIngredients,
    });
    //setStateIngredients(filteredIngredients);
  }, []);

  const closeModal = () => {
    httpDispatch({ type: "CLEAR" });
  };
  return (
    <div className="App">
      <IngredientForm onSubmit={submitHandler} loading={httpState.loading} />
      {httpState.error && (
        <ErrorModal onClose={closeModal}>{httpState.error}</ErrorModal>
      )}
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={stateIngredients}
          onRemoveItem={removeHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
