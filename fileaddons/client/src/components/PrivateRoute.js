import { Route, Redirect } from "react-router-dom";
import { useIsAuthenticated } from "../utils/auth";

const PrivateRoute = ({ component: Component, children, redirectTo = "/", ...props }) => {

    const isAuth = useIsAuthenticated();

    const render = () => (
        isAuth
        
            ? (Component ? <Component /> : children)
            
            : <Redirect to={{ pathname: redirectTo, state: { from: location } }} />
    );

    return (
        <Route
          {...props}
          render={render}
        />
    );

}

export default PrivateRoute;