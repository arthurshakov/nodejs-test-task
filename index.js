// const http = require('http');
// const fs = require('fs/promises');
const chalk = require('chalk');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const Note = require('./models/Note.js');
const {getQuiz, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion} = require('./quiz.controller');

const port = 3000;
// const basePath = path.join(__dirname, './pages');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');
app.use(express.static(path.resolve(__dirname, './public')));

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({
	extended: true,
}))

// QUIZ PAGE
app.get('/quiz', async (req, res) => {
  try {
		const quiz = await getQuiz();

		res.render('quiz', {
			title: 'Quiz',
			quiz,
			error: false,
		});
  } catch (error) {
   	res.render('quiz', {
			title: 'Quiz',
			quiz: null,
			error: error.message,
		});
  }
});

// EDIT QUIZ PAGE
app.get('/edit-quiz', async (req, res) => {
  try {
		const quiz = await getQuiz();

		res.render('edit-quiz', {
			title: 'Edit quiz',
			quiz,
			error: false,
		});
  } catch (error) {
   	res.render('edit-quiz', {
			title: 'Edit quiz',
			quiz: null,
			error: error.message,
		});
  }
});

app.put('/edit-quiz/:id', async (req, res) => {
  try {
		await updateQuizQuestion(req.params.id, req.body);
		const quiz = await getQuiz();

		res.render('edit-quiz', {
			title: 'Edit quiz',
			quiz,
			error: false,
		});
  } catch (error) {
   	res.render('edit-quiz', {
			title: 'Edit quiz',
			quiz: null,
			error: error.message,
		});
  }
});

app.delete('/edit-quiz/:id', async (req, res) => {
  try {
		await deleteQuizQuestion(req.params.id);
		const quiz = await getQuiz();

		res.render('edit-quiz', {
			title: 'Edit quiz',
			quiz,
			error: false,
		});
  } catch (error) {
   	res.render('edit-quiz', {
			title: 'Edit quiz',
			quiz: null,
			error: error.message,
		});
  }
});

app.post('/edit-quiz', async (req, res) => {
  try {
		const newQuestion = await addQuizQuestion(req.body);

		res.json({
      error: false,
      newQuestion: newQuestion
    });
  } catch (error) {
		res.json({
			error: true,
      newQuestion: null,
    });
  }
});

// HOME PAGE
app.get('/', async (req, res) => {
	res.render('index', {
		title: 'Quiz App',
		error: false,
	});
})

mongoose.connect('mongodb+srv://artur:8UD2LDoFaidowTzX@cluster0.hhh2ue9.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0')
	.then(() => {
		app.listen(port, () => {
			console.log(chalk.green(`Server has been started on port ${port}...`))
		});
	});
