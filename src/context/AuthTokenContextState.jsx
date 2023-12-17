import React, { useState } from "react";
import AuthTokenContext from "./AuthTokenContext";

function AuthTokenContextState(props) {
  let [authToken, setAuthToken] = useState("");
  return (
    <AuthTokenContext.Provider value={{ authToken, setAuthToken }}>
      {props.children}
    </AuthTokenContext.Provider>
  );
}

export default AuthTokenContextState;
