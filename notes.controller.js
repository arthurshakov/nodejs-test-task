// const fs = require('fs/promises');
// const path = require('path');
const chalk = require('chalk');
const Note = require('./models/Note');

// const notesPath = path.join(__dirname, 'db.json');

async function addNote(title, owner) {
	// const notes = require('./db.json');
	// const buffer = await fs.readFile(notesPath);
	// const notes = Buffer.from(buffer).toString('utf-8');
	// const notes = await getNotes();

	// const note = {
	// 	title,
	// 	id: Date.now().toString(),
	// }

	// notes.push(note);

	// await fs.writeFile(notesPath, JSON.stringify(notes));

	await Note.create({title, owner});
}

async function getNotes() {
	// return require('./db.json');
	// const notesJSON = await fs.readFile(notesPath, {encoding: 'utf-8'});
	// const notes = JSON.parse(notesJSON);

	const notes = await Note.find();

	return Array.isArray(notes) ? notes : [];
}

// async function printNotes() {
// 	const notes = await getNotes();

// 	console.log(chalk.bgBlue('Here is the list of notes'));

// 	notes.forEach(note => {
// 		console.log(
// 			chalk.green(note.id),
// 			chalk.blue(note.title)
// 		);
// 	});
// }

async function removeNote(noteId, owner) {
	// const notes = await getNotes();

	// const noteIndex = notes.findIndex(({id}) => id === noteId);

	// if (noteIndex === -1) {
	// 	console.log(chalk.red(`Note with id "${noteId}" not found!`));
	// 	return;
	// }

	// const removedNote = notes.splice(noteIndex, 1)[0];

	// await fs.writeFile(notesPath, JSON.stringify(notes));

	// console.log(chalk.green(`Note "${removedNote.title}" (ID: ${noteId}) was removed!`));

	const result = await Note.deleteOne({_id: noteId, owner});

	if (result.matchedCount === 0) {
		throw new Error('No note to delete');
	}
}

async function updateNote(noteData, owner) {
	// const notes = await getNotes();

	// const index = notes.findIndex(({id}) => id === noteId);

	// if (index === -1) {
	// 	console.log(chalk.red(`Note with id ${id} doesn't exist`));
	// 	return;
	// }

	// notes[index].title = newTitle;

	// await fs.writeFile(notesPath, JSON.stringify(notes));

	const result = await Note.updateOne({_id: noteData.id, owner}, {title: noteData.title});

	if (result.matchedCount === 0) {
		throw new Error('No note to edit');
	}

	console.log(result);

	console.log(chalk.green('Note was updated'));
}

module.exports = {
	addNote, removeNote, getNotes, updateNote,
}