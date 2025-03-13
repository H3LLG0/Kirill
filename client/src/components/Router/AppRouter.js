import React, { useContext } from "react";
import { Route, Routes} from 'react-router-dom';
import { Context } from "../../index";
import { authRoutes, publicRoutes } from "../Router/routes"
import Auth from "../../pages/Auth";


const AppRouter = () => {
    const {user} = useContext(Context)
    return(
        <Routes>
            {
               user.isAuth === true && authRoutes.map(({path, Component}) => <Route key={path} path={path} element={<Component/>}/>)
            }
            {
                publicRoutes.map(({path, Component}) => <Route key={path} path={path} element={<Component/>}/>)
            }
            <Route path="*" element={<Auth/>}/>
        </Routes>
    );
}

export default AppRouter;