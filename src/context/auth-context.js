import React, { useState, createContext } from "react";

export const AuthContext = createContext({
  isAuth: false,
  login: () => {},
});

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthentucated] = useState(false);

  const loginHandler = () => {
    setIsAuthentucated(true);
  };

  return (
    <AuthContext.Provider
      value={{ isAuth: isAuthenticated, login: loginHandler }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
