import { ADDUSER_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, QUIZ_ROUTE, QUIZLIST_ROUTE, QUIZ_CONTRUCTOR_ROUTE, QUIZ_STAT_ROUTE } from "../../utils/consts";
import Auth from "../../pages/Auth";
import Quizlist from "../../pages/quizlist";
import Quiz from "../../pages/Quiz";
import Admin from "../../pages/Admin";
import UserProfile from "../../pages/UserProfile";
import Constructor from "../../pages/QuizConstructor";
import QuizStat from "../../pages/QuizStat";

export const authRoutes = [
    {
        path: QUIZLIST_ROUTE,
        Component: Quizlist
    },
    {
        path: PROFILE_ROUTE,
        Component: UserProfile
    },
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: QUIZ_CONTRUCTOR_ROUTE,
        Component: Constructor
    },
    {
        path: QUIZ_STAT_ROUTE + '/:id',
        Component: QuizStat
    }

]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: QUIZ_ROUTE + '/:id',
        Component: Quiz
    }
]