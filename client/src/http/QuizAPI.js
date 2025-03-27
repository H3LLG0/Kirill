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