// forked from FumioNonaka's "Vue.js + ES6: TodoMVC" http://jsdo.it/FumioNonaka/wl2l
const STORAGE_KEY = 'todos-vuejs-2.0';
const todoStorage = {
	fetch() {
		const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		todos.forEach((todo, index) =>
			todo.id = index
		);
		todoStorage.uid = todos.length;
		return todos;
	},
	save(todos) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}
};
const filters = {
	all(todos) {
		return todos;
	},
	active(todos) {
		return todos.filter((todo) =>
			!todo.completed
		);
	},
	completed(todos) {
		return todos.filter((todo) =>
			todo.completed
		);
	}
};
const app = new Vue({
	data: {
		todos: todoStorage.fetch(),
		newTodo: '',
		editedTodo: null,
		visibility: 'all'
	},
	watch: {
		todos: {
			handler(todos) {
				todoStorage.save(todos);
			},
			deep: true
		}
	},
	computed: {
		filteredTodos() {
			return filters[this.visibility](this.todos);
		},
		remaining() {
			const todos = filters.active(this.todos);
			return todos.length;
		},
		allDone: {
			get() {
				return this.remaining === 0;
			},
			set(value) {
				this.todos.forEach((todo) =>
					todo.completed = value
				);
			}
		}
	},
	filters: {
		pluralize(n) {
			return n === 1 ? 'item' : 'items';
		}
	},
	methods: {
		addTodo() {
			const value = this.newTodo && this.newTodo.trim();
			if (!value) {
				return;
			}
			this.todos.push({
				id: todoStorage.uid++,
				title: value,
				completed: false
			});
			this.newTodo = '';
		},
		removeTodo(todo) {
			this.todos.splice(this.todos.indexOf(todo), 1);
		},
		editTodo(todo) {
			this.beforeEditCache = todo.title;
			this.editedTodo = todo;
		},
		doneEdit(todo) {
			if (!this.editedTodo) {
				return;
			}
			this.editedTodo = null;
			const title = todo.title.trim();
			if (title) {
				todo.title = title;
			} else {
				this.removeTodo(todo);
			}
		},
		cancelEdit(todo) {
			this.editedTodo = null;
			todo.title = this.beforeEditCache;
		},
		removeCompleted: function() {
			this.todos = filters.active(this.todos);
		}
	},
	directives: {
		['todo-focus'](element, binding) {
			if (binding.value) {
				element.focus();
			}
		}
	}
});
function onHashChange() {
	const visibility = window.location.hash.replace(/#\/?/, '');
	if (filters[visibility]) {
		app.visibility = visibility;
	} else {
		window.location.hash = '';
		app.visibility = 'all';
	}
}
window.addEventListener('hashchange', onHashChange);
onHashChange();
document.addEventListener('DOMContentLoaded', (event) =>
	app.$mount('.todoapp')
);