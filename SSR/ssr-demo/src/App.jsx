import React, { useState } from "react";
import ReactDOM from "react-dom";

const Counter = ({ count }) => {
  const [counter, setCounter] = useState(count ?? 0);

  const handleIncrement = () => {
    setCounter(counter + 1);
  };

  const handleDecrement = () => {
    setCounter(counter - 1);
  };

  return (
    <div>
      <p>Count: {counter}</p>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </div>
  );
};

export default Counter;
