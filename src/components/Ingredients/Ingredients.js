import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

function Ingredients() {
  const [stateIngredients, setStateIngredients] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState();

  const submitHandler = (ingredient) => {
    setisLoading(true);
    fetch("https://burger-a52da.firebaseio.com/hook-ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setisLoading(false);
        setStateIngredients((prevStateIngredents) => [
          ...prevStateIngredents,
          { id: responseData.name, ...ingredient },
        ]);
      })
      .catch((error) => {
        setError("Somehting went wrong!");
        setisLoading(false);
      });
  };

  const removeHandler = (id) => {
    setisLoading(true);
    fetch(`https://burger-a52da.firebaseio.com/hook-ingredients/${id}.json`, {
      method: "DELETE",
    })
      .then((response) => {
        setisLoading(false);
        setStateIngredients((prevStateIngredents) => {
          const tempArray = [...prevStateIngredents].filter(
            (ig) => ig.id !== id
          );
          return tempArray;
        });
      })
      .catch((error) => {
        setError("Somehting went wrong!");
      });
  };

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setStateIngredients(filteredIngredients);
  }, []);

  const closeModal = () => {
    setError(null);
  };
  return (
    <div className="App">
      <IngredientForm onSubmit={submitHandler} loading={isLoading} />
      {error && <ErrorModal onClose={closeModal}>{error}</ErrorModal>}
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
