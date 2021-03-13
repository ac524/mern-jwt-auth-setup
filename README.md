# JWT Authentication Setup Guide for the MERN stack
A guide for getting up and running with JWT user authentication system for a React application using an Express + Mongo backend.

## Express Prerequisites

* `npm i mongoose dotenv passport passport-jwt bcryptjs fastest-validator`

* Connect to MongoDB using `mongoose`

## React Prerequisites

* `npm i axios jwt-decode react-router-dom`

**Note:** This guide does not currently walk through setting up any routes, but some of the authentication does import features from the `react-router-dom` library and requires a `BrowserRouter` component in place to assist with url redirects while logging in and out.

## Merging File Addons

Add / Merge all files from the `fileaddons` folder into your project structure. The `client` folder is for the React install. The rest is for the Express application.

**Other Notes**

* If you already have a `User` model, just make sure it has the 3 fields defined for the one provided here.

* If you have already implemented your own global store, you will need to merge the two actions, `LOGIN_USER` and `LOGOUT_USER`, into your implementation. You will also then need to make sure that the `dispatch` calls in `utils/auth.js` match how your store is set up.

* If you already have an `api.js` file, you will need to merge any current methods you have set up into `API` class provided in `utils/api.js`. Functionality in `utils/auth.js` requires this specific `API` class to safely assign header information.

## Server Configuration

The first part of this guide walks through needed additions and modifications to your server application. These steps require the `fileaddons` from the previous section to be merged into your project.

### **Step 1:** Create and configure a .env file

* Create the .env file at the root of your project

* *Make sure your .gitignore file as a rule to ignore this file. This file should NEVER be committed!*

* Add a new variable for `JWT_SECRET`.

```
JWT_SECRET="A random string, which is used to help generate unique keys. This can be anything you want, quotes, a short passage from a book, random letters."
```

### **Step 2:** Configure server.js

* Open your `server.js` and add the following lines of code.

**Import configuration from the .env file**

Add at the very top of the file.
```
require("dotenv").config();
```

**Import and configure passport**
`passport` helps us implement the authentication strategy. Add this somewhere near the top of the file.
```
const passport = require("passport");

app.use(passport.initialize());
// Passport config
passport.use( require("./config/jwtPassportStrategy") );
```

**Add API routes for authentication**

Add before the catch all route to serve the React index.html (This one HTML route needed for React to work on Heroku)
```
app.use( "/api", require("./routes/authentication") );
```

## React Configuration

These steps require the `fileaddons/client/src` to be merged into your React application.

### **Step 1:** Add store provider

**Note:** If you have already implemented your own global store functionality you can skip this step.

We want everything to have access to the store, including `App` so we are going to import into `index.js` and wrap it around everything.

* Inside `src/index.js` add/modify the initial JSX template to include the `StoreProvider`.

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

### **Step 2:** Set up Reauthentication

Including the `useAuthTokenStore` hook will allow your app to reauthenticate already logged in users if they refresh the page, or leave and return to the application.

**Example Usage**

The best place for this is inside your primary `App` component.

```
// Import the useAuthTokenStore hook.
import { useAuthTokenStore } from "./utils/auth";

function App() {

    // Use the hook to reauthenticate stored tokens.
    useAuthTokenStore();

    /** Rest of your App component code here */
}
```

### **Step 3:** Implement `useLogin` and `useLogout` Hooks

The next 3 sections detail using the `useLogin` and `useLogout` hooks that help simplify the steps around successfully logging a user in and out of the application while keeping the React application's state and API requests in sync.

## The `useLogin` Hook - How to Log a User In
The provided `useLogin` hook provides a function that assists with:

* Making the API request for logging in, 

* Storing the JWT token for reauthentication and applying it to the api class for authenticated API requests.

* Pushing authenticated user information into the global store.

**Example Usage**

Below is a simple login form component that implements the `useLogin` hook.
```
function LoginForm() {

    const emailRef = useRef();
    const passwordRef = useRef();

    // Get the helper login function from the `useLogin` hook.
    const login = useLogin();

    const handleSubmit = async e => {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {

            await login({ email, password });

            // User has been successfully logged in and added to state. Perform any additional actions you need here such as redirecting to a new page.

        } catch(err) {

             // Handle error responses from the API
             if( err.response && err.response.data ) console.log(err.response.data);

        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="text" ref={emailRef} placeholder="Your email" /><br />
            <input type="password" ref={passwordRef} placeholder="Your password" /><br />
            <button>Submit</button>
        </form>
    )

}
```

## The `useLogout` Hook - How to Log a User Out

The provided `useLogout` hook provides a function that assists with:

* Clearing any stored authentication information from the application to log them out and remove their user from state.

* Redirect them back to the home page.

**Example Usage**

Below is a simple button component that implements the `useLogout` hook.
```
function LogoutButton() {

    const logout = useLogout();

    return <button onClick={logout}>Logout</button>

}
```

## Registering a New User
Registering a user requires the `api.register` method to be called with at least an `email` and `password` provided. Registering a new user does not automatically log them in, but the same login functionality above could be used to log a use in after successful registration.

**Example Usage**

Below is a simple registration form component that implements the `api.register` method and `useLogin` hook.
```
function RegistrationForm() {

    const emailRef = useRef();
    const passwordRef = useRef();

    // Get the helper login function from the `useLogin` hook.
    const login = useLogin();

    const handleSubmit = async e => {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {

            // Register the user.
            await api.register({ email, password });

            // User has been successfully registered, now log them in with the same information.
            await login({ email, password });

            // User has been successfully registered, logged in and added to state. Perform any additional actions you need here such as redirecting to a new page.

        } catch(err) {

             // Handle error responses from the API. This will include
             if( err.response && err.response.data ) console.log(err.response.data);
             
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input type="text" ref={emailRef} placeholder="Your email" /><br />
            <input type="password" ref={passwordRef} placeholder="Your password" /><br />
            <button>Submit</button>
        </form>
    )

}
```

