import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [stateIngredients, setStateIngredients] = useState([]);

  const submitHandler = (ingredient) => {
    setStateIngredients((prevStateIngredents) => [
      ...prevStateIngredents,
      ingredient,
    ]);
  };

  const removeHandler = (id) => {
    setStateIngredients((prevStateIngredents) => {
      const tempArray = [...prevStateIngredents].filter((ig) => ig.id !== id);
      return tempArray;
    });
  };

  return (
    <div className="App">
      <IngredientForm onSubmit={submitHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={stateIngredients}
          onRemoveItem={removeHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
