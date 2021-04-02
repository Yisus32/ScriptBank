
const db = firebase.firestore();
const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');
const btnTheme = document.querySelector('#btn-theme');
const navTheme = document.querySelector('#nav-theme');
const myCard = document.querySelector('#myCard');
const taskCard = document.getElementById('taskCard');

const saveTask = (title, description) => db.collection('tasks').doc().set({
		title,
		description
	});

const onGetTask = (callback) => db.collection('tasks').onSnapshot(callback);
const deleteTask = id => db.collection('tasks').doc(id).delete();
const getTask = id => db.collection('tasks').doc(id).get();
const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

let editStatus = false;
let themeIsDark = false;
let id = '';

window.addEventListener('DOMContentLoaded', async(e) => {
	
	onGetTask((querySnapshot) => {
		taskContainer.innerHTML = '';
		querySnapshot.forEach(doc => {
		console.log(doc.data())

		const task = doc.data();
		task.id = doc.id;

			taskContainer.innerHTML += 
			`<div id="taskCard" class="card card-body mt-2 border-primary animate__animated animate__fadeInDown">
				
				<h3 class="h5">${task.title}</h3>
				<p>${task.description}</p>
				
				<div>
					<button class="btn btn-primary btn-delete" data-id="${task.id}"> <i class="bi-trash-fill"></i> Eliminar</button>
					<button class="btn btn-secondary btn-edit" data-id="${task.id}"> <i class="bi-pencil-fill"></i> Editar</button>
				</div>

			</div>`;

			const btnsDelete = document.querySelectorAll('.btn-delete');
			btnsDelete.forEach(btn => {
				btn.addEventListener('click', async (e) => {
					await deleteTask(e.target.dataset.id);
				});
			});

			const btnsEdit = document.querySelectorAll('.btn-edit');
			btnsEdit.forEach(btn => {
				btn.addEventListener('click', async (e) => {
					const doc = await getTask(e.target.dataset.id);
					const task = doc.data();

					editStatus = true;
					id = doc.id;

					taskForm['task-title'].value = task.title;
					taskForm['task-description'].value = task.description;
					taskForm['btn-task-form'].innerText = 'Actualizar';
				});
			});
		});
	});
});


	btnTheme.addEventListener('click', () => {
		document.body.classList.toggle('dark');
		navTheme.classList.toggle('bg-dark');
		myCard.classList.toggle('bg-dark');
		btnTheme.innerHTML = '<i class="bi-sun-fill"></i> Light Theme';
	});

taskForm = addEventListener('submit', async (e) => {
	e.preventDefault();
	
	const title = taskForm["task-title"];
	const description = taskForm["task-description"];

	if (!editStatus) {
		await saveTask(title.value, description.value);
	}else{
		await updateTask(id, {
			title: title.value,
			description: description.value
		});

		editStatus = false;

		id = '';
		taskForm['btn-task-form'].innerText = 'Actualizar';
	}

	taskForm.reset();
	title.focus();


	return '200 ok';
});