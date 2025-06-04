import { $host, $authHost } from ".";

export const GetQuizzes = async () => {
    const {data} = await $authHost.get('quiz/getAllQuizzes');

    return data;
}

export const GetOneQuiz = async (id) => {
    const {data} = await $host.post('quiz/GetOneQuiz',{id})

    return data;
}

export const SaveQuizChanges = async (quiz) => {
    const {message} = await $authHost.post('quiz/SaveQuizChanges', quiz)
    
    return message;
}

export const SaveQuizCertificate = async(certificate) => {
    const {message} = await $authHost.post('quiz/SaveQuizCertificate', certificate)

    return message;
}

export const SaveQuizResults = async (quizResults) => {
    const {message} = await $host.post('quiz/SaveQuizResults', quizResults);

    return message;
}
export const CreateNewQuiz = async (quizData) => {
    const message = await $authHost.post('quiz/CreateQuiz', quizData);

    return message;
}

export const GetQuizResults = async (id)=> {
    const data = await $authHost.post('quiz/GetQuizResults', {id:id})

    return data;
}

export const DeleteQuiz = async (id) => {
    const message = await $authHost.post('quiz/DeleteQuiz', {id:id})

    return message;
}