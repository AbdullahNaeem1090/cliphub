import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currUser, setCurrUser] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get("/api/user/currUser");
          if (response.data.success) {
            setIsAuthenticated(true);
            setCurrUser(response.data.data);
          } else {
            setIsAuthenticated(false);
            setCurrUser(null);
          }
        } catch (error) {
          setIsAuthenticated(false);
          setCurrUser(null);
          console.error("Authentication check failed:", error);
        } finally {
          setIsAuthenticating(false);
        }
      };
       checkAuth()
    }, []);
  
    return (
      <AuthContext.Provider
        value={{
          currUser,
          isAuthenticated,
          setCurrUser,
          setIsAuthenticated,
          isAuthenticating,
          setIsAuthenticating,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };


export const useAuth = () => useContext(AuthContext);

//
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };


  