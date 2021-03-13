import React,{ createContext, useContext, useReducer } from "react";

import {
    LOGIN_USER,
    LOGOUT_USER
} from "./actions";

const StoreContext = createContext({
    userAuth: {},
});

const { Provider } = StoreContext;

const reducer = ( state, { type, payload } ) => {

    switch( type ) {
        case LOGIN_USER:

            return { ...state, userAuth: payload };

        case LOGOUT_USER:

            return { ...state, userAuth: {} };

        default:
            return state;
    }

}

export const StoreProvider = ( { children } ) => {

    const [ store, dispatch ] = useReducer( reducer, {
        userAuth: {}
    } );

    return <Provider value={[store, dispatch]}>{ children }</Provider>

}

export const useStoreContext = () => {

    return useContext( StoreContext );

}