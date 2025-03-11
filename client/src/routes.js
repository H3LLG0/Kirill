import Admin from "./pages/Admin";
import Adduser from "./pages/Adduser";
import { ADDUSER_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE, QUIZLIST_ROUTE } from "./utils/consts";
import Auth from "./pages/Auth";
import Quizlist from "./pages/quizlist";
import Quiz from "./pages/Quiz";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        component: Admin
    },
    {
        path: ADDUSER_ROUTE,
        component: Adduser
    },

]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        component: Auth
    },
    {
        path: QUIZLIST_ROUTE + '/id',
        component: Quiz
    },
    {
        path: QUIZLIST_ROUTE,
        component: Quizlist
    }
]