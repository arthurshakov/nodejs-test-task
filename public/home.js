function createHistoryCard(historyItem) {
	return `
		<div class="card mt-2">
			<div class="card-body d-flex justify-content-between align-items-center">
				<div>
					<h4 class="card-title">${historyItem.date}</h4>
					<div class="card-title">${historyItem.time}</div>
				</div>
				<div class="h5">Correct: ${historyItem.correctAnswers} out of ${historyItem.totalQuestions}</div>
			</div>
		</div>
	`;
}

function setupHistory() {
	const historyEl = document.querySelector('.history');
	const localStorageHistory = localStorage.getItem('history');

	if (localStorageHistory) {
		const history = JSON.parse(localStorageHistory);

		history.forEach(item => {
			historyEl.insertAdjacentHTML('beforeend', createHistoryCard(item));
		});
	} else {
		historyEl.innerHTML = '<div class="mt-2">There\'s no history yet';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	setupHistory();
});