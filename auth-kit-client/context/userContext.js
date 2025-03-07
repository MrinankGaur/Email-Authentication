import React ,{createContext, useEffect, useState, useContext} from 'react'

const UserContext = React.createContext();

export const UserContextProvider = ({children})=>{
    return(
        <UserContextProvider value={"Hello From Context"}>
            {children}
        </UserContextProvider>
    );
};


export const userContext = () => {
    return useContext(UserContext);
}