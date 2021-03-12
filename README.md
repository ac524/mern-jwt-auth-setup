# JWT Authentication Setup Guide for the MERN stack
A guide for getting up and running with JWT user authentication system for a React application using an Express + Mongo backend.

## Express Prerequisites

* `npm i mongoose dotenv passport passport-jwt bcryptjs`

* Connect to MongoDB using `mongoose`

## Express Prerequisites

* `npm i axios jwt-decode`

## Install file dependecies

* Add / Merge all files from the `fileaddons` folder into your project structure.

## Create and configure a .env file

* Create the .env file at the root of your project

* *Make sure your .gitignore file as a rule to ignore this file. This file should NEVER be commited!*

* Add a new variable for `JWT_SECRET`.

```
JWT_SECRET="A random string, which is used to help generate unique keys. This can be anything you want, quotes, a short passage from a book, random letters."
```

## Configure server files

* Open `server.js` and add the following lines of code.

**Add at the very top.**

```
require("dotenv").config();
```

**Add somewhere near the top.**

```
const passport = require("passport");

app.use(passport.initialize());
// Passport config
passport.use( require("./config/jwtPassportStrategy");
```

**Add before the catch all route to serve the React index.html**
```
app.use( "/api", require("./routes/authentication") );
```

## Configure React with store and utilties

**Add store provider**

* We want everything to have access to the store, including `App` so we are going to import into `index.js` and wrap it around everythng.

* Inside `src/index.js` add/modify

```
import { StoreProvider } from "./store";

ReactDOM.render(
    <React.StrictMode>
        <StoreProvider>
            <App />
        </StoreProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
```

## Configure App to authenticate existing tokens

* Including the `useAuthTokenStore` hook will allow your app to reauthenticate already logged in users if they refresh the page, or leave and return to the application.

* Open `src/App.js` and add/modify

```
// Import the useAuthTokenStore hook.
import { useAuthTokenStore } from "./utils/auth";

function App() {

    // Use the hook to reauthenticate stored tokens.
    useAuthTokenStore();

    /** Rest of your App component code here */
}
```

## Configure register form with api and auth utils
```
import api from "../utils/api";
import { useLogin } from "../utils/auth";
```

* Then, inside the component with the form, use the hook, to get a `login` method you can pass user credentials into.

```
const login = useLogin();

// Example `handleSubmit` method for the form. You would need to provide `email` and `password` from state variables.
const handleSubmit = async (e) => {

    e.preventDefault();

    await api.register({ name, email, password, password2 });

    // Auto Login after registration
    await login( { email, password } );

    window.location.href = "./";
        
};
```

## Configure login form with auth utils

* In the component where you build your login form, add the following code

```
import { useLogin } from "../utils/auth";
```

* Then, inside the component with the form, use the hook, to get a `login` method you can pass user credentials into.

```
const login = useLogin();

// Example `handleSubmit` method for the form. You would need to provide `email` and `password` from state variables.
const handleSubmit = async (e) => {

    e.preventDefault();

    login( { email, password } )
        .then( userAuth => console.log( userAuth ) )
        .catch( errors => errors );
        
};
```

## Configure logout button with auth utils

* Below is generic code for a `LogoutButton` component. Import and use where needed
```
import React from "react";
import { useLogout } from "../utils/auth";

function LogoutButton({ children, ...props }) {

    const logout = useLogout()

    return <button onClick={logout} {...props}>{children || "Logout"}</button>

}
```