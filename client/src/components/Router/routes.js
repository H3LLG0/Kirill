import { ADDUSER_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE, QUIZLIST_ROUTE } from "../../utils/consts";
import Auth from "../../pages/Auth";
import Quizlist from "../../pages/quizlist";
import Quiz from "../../pages/Quiz";

export const authRoutes = [
    {
        path: QUIZLIST_ROUTE,
        Component: Quizlist
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    }
]