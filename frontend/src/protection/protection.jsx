import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated,isAuthenticating } = useAuth();


  if(isAuthenticating){
    return <p>laoding</p>
  }

  return isAuthenticated ? children : <Navigate to="/logIn" />;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
