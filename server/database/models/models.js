const sequelize = require('../database');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type:DataTypes.INTEGER(8), primaryKey:true, autoIncrement:true},
    name: {type:DataTypes.STRING(40), require},
    surname: {type:DataTypes.STRING(40), require},
    email: {type:DataTypes.STRING, require, unique:true},
    type: {type:DataTypes.STRING(8), require, defaultValue:'USER'},
    login: {type:DataTypes.STRING, unique:true, require},
    password: {type:DataTypes.STRING, require},
})
const Quiz = sequelize.define('quiz',{
    id: {type:DataTypes.INTEGER(8), primaryKey:true, autoIncrement:true},
    title: {type:DataTypes.STRING(255), require},
    description: {type:DataTypes.STRING(1000), require},
    certificate: {type:DataTypes.STRING(255),}
})
const QuizQuestion = sequelize.define('quiz_question', {
    id: {type:DataTypes.INTEGER(8), primaryKey:true, autoIncrement:true},
    question: {type:DataTypes.STRING(255), require},
    type: {type:DataTypes.STRING(30), require},
})
const AnswerVariant = sequelize.define('answer_variant', {
    id: {type:DataTypes.INTEGER(8), primaryKey:true, autoIncrement:true},
    answer: {type:DataTypes.STRING(255), require},
})
const QuizResult = sequelize.define('quiz_results', {
    id: {type:DataTypes.INTEGER(8), primaryKey:true, autoIncrement:true},
    answer: {type: DataTypes.STRING(255), require}
})
Quiz.hasMany(QuizQuestion, { onDelete: 'CASCADE' });
QuizQuestion.belongsTo(Quiz);

QuizQuestion.hasMany(AnswerVariant, { onDelete: 'CASCADE' });
AnswerVariant.belongsTo(QuizQuestion);

Quiz.hasMany(QuizResult, { onDelete: 'CASCADE' });
QuizResult.belongsTo(Quiz);

QuizQuestion.hasMany(QuizResult, { onDelete: 'CASCADE' });
QuizResult.belongsTo(QuizQuestion);


module.exports = {
    User,
    Quiz,
    QuizQuestion,
    AnswerVariant,
    QuizResult
}