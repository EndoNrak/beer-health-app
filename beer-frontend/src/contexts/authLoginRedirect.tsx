import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FitbitLoginContext } from "./fitbitAuthContext";
import { CognitoLoginContext } from "./cognitoAuthContext";

export const AuthLoginRedirect = ({ children }: { children: JSX.Element }) => {
  const [cognitoLoginContext, setCognitoLoginContext] = useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(CognitoLoginContext); // eslint-disable-line
  const [fitbitLoginContext, setFitbitLoginContext] = useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(FitbitLoginContext); // eslint-disable-line
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!cognitoLoginContext || !fitbitLoginContext) {
      navigate("/auth", {state: { from: location }});
    }    
  }, [cognitoLoginContext, fitbitLoginContext, location, navigate]);
 
  return children;
};
