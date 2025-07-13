const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
	text: {
		type: String,
		required: [true, 'Answer text is required'],
		trim: true,
	},
	isCorrect: {
		type: Boolean,
		required: [true, 'Specify if the answer is correct'],
	},
}, {_id: false});

const quizQuestionSchema = new mongoose.Schema({
	question: {
		type: String,
		required: [true, 'Question is required'],
		trim: true,
		minlength: [1, 'Question too short (min 1 chars)'],
    maxlength: [500, 'Question too long (max 500 chars)'],
	},
	answers: {
		type: [quizAnswerSchema],
		required: true,
		validate: {
			validator: (answers) => answers.length >= 1,
			message: 'Provide 1 or more answers per question',
		},
	},
});

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

module.exports = QuizQuestion;

// EXAMPLE OF USE
// const sampleQuestion = {
//   question: "What is the capital of France?",
//   answers: [
//     { text: "Berlin", isCorrect: false },
//     { text: "Paris", isCorrect: true },
//     { text: "Madrid", isCorrect: false }
//   ],
//   category: "general",
//   difficulty: "easy"
// };
