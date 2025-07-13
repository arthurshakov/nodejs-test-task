const API_URL = 'http://localhost:3000/edit-quiz/';

function constructQuestionObject(question) {
	let questionObject = {
		id: question.dataset.id,
		data: {
			question: question.querySelector('.question-input')?.value,
			answers: [],
		},
	};
	
	const answerElements = question.querySelectorAll('.answer');

	answerElements.forEach(element => {
		questionObject.data.answers.push({
			text: element.querySelector('.answer-input')?.value,
			isCorrect: element.querySelector('.radio-button')?.checked,
		})
	})

	return questionObject;
}

function checkQuestionObjectValidity(questionObject) {
	let objectIsValid = true;

	// IF WE HAVE AN EMPTY ANSWER
	if (questionObject.data.answers.some(answer => answer.text.trim() === '')) {
		return false;
	}

	// IF WE HAVE AN EMPTY QUESTION
	if (questionObject.data.question.trim() === '') {
		return false;
	}

	// IF WE DON'T HAVE CORRECT ANSWERS
	if (questionObject.data.answers.every(answer => !answer.isCorrect)) {
		return false;
	}

	// IF THERE ARE NO ANSWERS AT ALL
	if (!questionObject.data.answers.length) {
		return false;
	}

	return true;
}

function showError(errorElement) {
	errorElement.innerHTML = '\n        <span class="text-danger">\n            Answer and question texts must not be empty.<br>\n            There must be at least one answer.<br>\n            At least one of the answers must be correct.\n        </span>\n    ';
}

async function saveQuestion(questionElement) {
	const questionObject = constructQuestionObject(questionElement);
	const saveStatusElement = questionElement.querySelector('.save-status');

	if (checkQuestionObjectValidity(questionObject)) {
		const method = questionObject.id === undefined ? 'POST' : 'PUT';
		const url = questionObject.id === undefined ? API_URL : `${API_URL}${questionObject.id}`;

		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(questionObject.data),
			});

			if (!response.ok) {
        throw new Error(data.error || 'Failed to save question');
      }
			
			// If this was a new question (POST), you'll get the newQuestionId here
      if (method === 'POST') {
				const data = await response.json();

				// add ID to newkly created element
				questionElement.dataset.id = data.newQuestion._id;
				// return data;
      }

			saveStatusElement.innerHTML = '<span class="text-success">Changes are saved</span>';
		} catch(error) {
			saveStatusElement.innerHTML = `<span class="text-danger">${error.message}</span>`;
      console.error('Error saving question:', error);
		}
	} else {
		showError(saveStatusElement);
		// saveStatusElement.innerHTML = '<span class="text-danger">Answer and question texts must not be empty. And at least one of the answers must be correct.</span>';
	}
};

function addAnswerElement(questionElement) {
	const questionIndex = questionElement.dataset.index;
	const answerListElement = questionElement.querySelector('.answer-list');
	const answerElements = answerListElement.querySelectorAll('.answer');

	const answerHTML = `
		<div class="answer d-flex align-items-center justify-content-between gap-4" data-answer-index="${answerElements.length}">
			<input
				type="text"
				class="form-control answer-input"
				placeholder="Enter your new answer"
				value=""
			>

			<div class="flex-shrink-0 d-flex gap-4 align-items-center">
				<label class="d-flex align-items-center gap-1 flex-shrink-0">
					<input
						class="form-check-input radio-button" 
						type="radio" 
						name="question${questionIndex}-is-correct" 
					>

					<span>Is correct</span>
				</label>

				<button class="btn btn-danger delete-answer-button flex-shrink-0">Delete answer</button>
			</div>
		</div>
	`

	answerListElement.insertAdjacentHTML('beforeend', answerHTML);
}

function addQuestionElement() {
	const quizAccordion = document.querySelector('#quizAccordion');
	const questionElements = quizAccordion.querySelectorAll('.accordion-item');
	const questionIndex = questionElements.length;

	const answerListHTML = `
		<div class="d-grid gap-3 edit-answers mt-4">
			<h4 class="h4">Edit answers</h4>
			<div class="answer-list d-grid gap-3">
				<div class="answer d-flex align-items-center justify-content-between gap-4" data-answer-index="0">
					<input
						type="text"
						class="form-control answer-input"
						placeholder="Enter your new answer"
						value=""
					>

					<div class="flex-shrink-0 d-flex gap-4 align-items-center">
						<label class="d-flex align-items-center gap-1 flex-shrink-0">
							<input
								class="form-check-input radio-button" 
								type="radio" 
								name="question${questionElements.length}-is-correct" 
							>

							<span>Is correct</span>
						</label>

						<button class="btn btn-danger delete-answer-button flex-shrink-0">Delete answer</button>
					</div>
				</div>
			</div>

			<button class="btn btn-secondary add-answer-button flex-shrink-0">+ Add answer</button>
		</div>
	`

	const questionHTML = `
		<div class="accordion-item" data-index="${questionIndex}">
			<h2 class="accordion-header" id="heading${questionIndex}">
				<button class="accordion-button" 
								type="button"
								data-bs-toggle="collapse" 
								data-bs-target="#collapse${questionIndex}" 
								aria-expanded="true"
								aria-controls="collapse${questionIndex}">
					New question
				</button>
			</h2>

			<div id="collapse${questionIndex}" 
				class="accordion-collapse collapse show" 
				aria-labelledby="heading${questionIndex}"
			>
				<div class="accordion-body d-grid gap-3">
					<div class="d-grid gap-3 edit-question mt-4">
						<h4 class="h4">Edit question</h4>

						<div class="d-flex align-items-center justify-content-between gap-4">
							<input
								type="text"
								class="form-control question-input"
								placeholder="Enter your new question here"
								value=""
							>

							<button class="btn btn-danger delete-question-button flex-shrink-0">Delete question</button>
						</div>
					</div>

					${answerListHTML}

					<div class="text-center mt-4">
						<button class="save-changes btn btn-primary" type="button">Save Changes</button>

						<div class="save-status mt-2"></div>
					</div>
				</div>
			</div>
		</div>
	`;

	quizAccordion.insertAdjacentHTML('beforeend', questionHTML);
}

async function deleteAnswer(answerElement) {
	// FIRST CHECKING IF IT'S OKAY TO DELETE THIS ANSWER
	const questionElement = answerElement.closest('.accordion-item');
	const questionElementClone = questionElement.cloneNode(true);
	questionElementClone.querySelector(`.answer[data-answer-index="${answerElement.dataset.answerIndex}"]`)?.remove();

	const cloneQuestionObjectIsValid =  checkQuestionObjectValidity(constructQuestionObject(questionElementClone));
	
	if (cloneQuestionObjectIsValid) {
		answerElement.remove();
		saveQuestion(questionElement);
	} else {
		showError(questionElement.querySelector('.save-status'));
	}
}

async function deleteQuestion(questionElement) {
	if (document.querySelectorAll('#quizAccordion .accordion-item').length > 1) {
		try {
			await fetch(`${API_URL}${questionElement.dataset.id}`, {method: 'DELETE'});
			questionElement.remove();
		} catch(error) {
			console.log(error);
		}
	} else {
		// 
	}
}

document.addEventListener('DOMContentLoaded', () => {
	document.body.addEventListener('click', (event) => {
		// SAVING CHANGES
		const saveButton = event.target.closest('.save-changes');

		if (saveButton) {
			saveQuestion(saveButton.closest('.accordion-item'));
			return;
		}

		// ADDING ANSWER
		const addAnswerButton = event.target.closest('.add-answer-button');

		if (addAnswerButton) {
			addAnswerElement(addAnswerButton.closest('.accordion-item'));
		}

		// DELETING ANSWER
		const deleteAnswerButton = event.target.closest('.delete-answer-button');

		if (deleteAnswerButton) {
			deleteAnswer(deleteAnswerButton.closest('.answer'));
		}

		// ADDING QUESTION
		const addQuestionButton = event.target.closest('.add-question-button');

		if (addQuestionButton) {
			addQuestionElement(addQuestionButton.closest('.answer'));
		}

		// DELETING QUESTION
		const deleteQuestionButton = event.target.closest('.delete-question-button');

		if (deleteQuestionButton) {
			deleteQuestion(deleteQuestionButton.closest('.accordion-item'));
		}
	});
});