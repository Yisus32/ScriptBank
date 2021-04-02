
const db = firebase.firestore();
const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');
const dark_url = "https://stackpath.bootstrapcdn.com/bootswatch/4.5.2/darkly/bootstrap.min.css";
const light_url = "https://stackpath.bootstrapcdn.com/bootswatch/4.5.2/minty/bootstrap.min.css";
const btnTheme = document.getElementById('btn-theme');
const changeTheme = document.getElementById('main-theme');

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
			`<div class="card card-body mt-2 border-primary animate__animated animate__fadeInDown">
				
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
	changeTheme.href = dark_url;
	changeTheme.id = 'secondary_theme';
	btnTheme.innerHTML = '<i class="bi-sun-fill"></i> Light Theme'
	themeIsDark = true;

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