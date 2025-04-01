import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(()=>{
        const sessionAuth=sessionStorage.getItem('auth');
        return sessionAuth? JSON.parse(sessionAuth):false;
    });

    return (
        <AuthContext.Provider value={{setIsAuthenticated ,isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


