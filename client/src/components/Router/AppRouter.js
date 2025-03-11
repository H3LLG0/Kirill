import React, { useContext } from "react";
import { Route, Routes} from 'react-router-dom';
import { authRoutes, publicRoutes } from "../../routes";
import { Context } from "../../index";

const AppRouter = () => {
    const {user} = useContext(Context)
    console.log(user)
    const isAuth = false;
    return(
        <Routes>
            {user.isAuth && authRoutes.map(({path, component}) => 
                <Route key={path} path={path} component={component} exact/>
            )}
            {publicRoutes.map(({path, component}) => 
                <Route key={path} path={path} component={component} exact/>
            )}
        </Routes>
    );
}

export default AppRouter;