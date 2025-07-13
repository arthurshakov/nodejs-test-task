const quizIsDoneEvent = new CustomEvent('quizIsDone');
let swiper = null;

function padNumber (number) {
	return number.toString().padStart(2, '0');
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('history')) || [];
  } catch {
    return [];
  }
}

function formatDate(date = new Date()) {
	const day = padNumber(date.getDate());
	const month = padNumber(date.getMonth() + 1);
	const year = date.getFullYear();

	return `${day}.${month}.${year}`;
}

function formatTime(date = new Date()) {
	const hours = padNumber(date.getHours());
	const minutes = padNumber(date.getMinutes());
	const seconds = padNumber(date.getSeconds());

	return `${hours}:${minutes}:${seconds}`;
}

function setupSlider() {
	const quizSwiperEl = document.querySelector('.quiz-swiper');

	swiper = new Swiper(quizSwiperEl, {
		allowTouchMove: false,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

	swiper.slides.forEach((slide) => {
		function answerChoiceClickListener(event) {
			const answerEl = event.target.closest('.answer-choice');

			if (!answerEl) {
				return;
			}

			// Mark selected answer
			answerEl.classList.add('active');

			// Visual feedback
			if (answerEl.dataset.correct === 'true') {
				answerEl.classList.add('bg-success');
				slide.classList.add('is-answered-correctly');
			} else {
				const answers = this.closest('.swiper-slide')?.querySelectorAll('.answer-choice');

				answers.forEach(answerEl => {
					if (answerEl.dataset.correct === 'true') {
						answerEl.classList.add('bg-success');
					} else {
						answerEl.classList.add('bg-danger');
					}
				})
			}

			slide.removeEventListener('click', answerChoiceClickListener);
			slide.classList.add('is-answered');

			if (swiper.slides.every(innerLoopSlide => innerLoopSlide.classList.contains('is-answered'))) {
				document.body.dispatchEvent(quizIsDoneEvent);
			}
		}

		slide.addEventListener('click', answerChoiceClickListener);
	})	
}

function setupSavingLogic() {
	const saveButton = document.querySelector('#save-results');
	const saveStatus = document.querySelector('#save-status');

	if (!localStorage.getItem('history')) {
		localStorage.setItem('history', '[]');
	}

	document.body.addEventListener('quizIsDone', () => {
		saveButton.removeAttribute('disabled');
	})

	saveButton.addEventListener('click', () => {
		saveButton.setAttribute('disabled', '');
		const now = new Date();

		const history = JSON.parse(localStorage.getItem('history'));
		const correctAnswers = swiper.el.querySelectorAll('.is-answered-correctly').length;
		const totalQuestions = swiper.slides.length;

		history.push({
			date: formatDate(now),
			time: formatTime(now),
			totalQuestions,
			correctAnswers,
		})

		localStorage.setItem('history', JSON.stringify(history));
		saveStatus.innerHTML = `
			Result is saved.<br>Correct: ${correctAnswers} out of ${totalQuestions}
		`;
	});
}

document.addEventListener('DOMContentLoaded', () => {
	setupSlider();
	setupSavingLogic();
});