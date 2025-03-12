import React, { useContext } from "react";
import { Route, Routes} from 'react-router-dom';
import { Context } from "../../index";
import Admin from "../../pages/Admin";
import Adduser from "../../pages/Adduser";
import { ADDUSER_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE, QUIZLIST_ROUTE } from "../../utils/consts";
import Auth from "../../pages/Auth";
import Quizlist from "../../pages/quizlist";
import Quiz from "../../pages/Quiz";

const AppRouter = () => {
    const {user} = useContext(Context)
    return(
        <Routes>
            <Route path={LOGIN_ROUTE} element={<Auth/>}/>
            <Route path={QUIZLIST_ROUTE} element={<Quizlist/>}/>
        </Routes>
    );
}

export default AppRouter;