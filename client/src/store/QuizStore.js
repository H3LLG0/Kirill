import {makeAutoObservable} from "mobx"

export default class QuizStore {
    constructor() {
        this._quizzes = []
        makeAutoObservable(this);
    }
    SetQuizzes(quizzes) {
        this._quizzes = quizzes;
    }
    get Quizzes() {
        return this._quizzes
    }
}