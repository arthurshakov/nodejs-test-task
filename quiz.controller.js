const QuizQuestion = require('./models/QuizQuestion');
const chalk = require('chalk');

async function getQuiz() {
	try {
		const quizQuestions = await QuizQuestion.find();

		if (!quizQuestions.length) {
			throw new Error('No quizzes found in database');
		}
		
		console.log(chalk.green('Fetched quiz successfully'));
		return quizQuestions;
	} catch(error) {
		console.error(chalk.red('DB Error:'), error);
		throw error;
	}
}

async function addQuizQuestion(questionData) {
	try {	
		const question = await QuizQuestion.create(questionData);

		return question;
	} catch(error) {
		console.log(error);
		throw error;
	}
}

async function updateQuizQuestion(id, questionData) {
	const result = await QuizQuestion.updateOne({_id: id}, questionData);

	if (result.matchedCount === 0) {
		throw new Error('No question to edit');
	}
}

async function deleteQuizQuestion(id) {
	const result = await QuizQuestion.deleteOne({_id: id});

	if (result.matchedCount === 0) {
		throw new Error('No question to delete');
	}
}

module.exports = {getQuiz, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion};