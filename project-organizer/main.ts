import { App, ItemView, Notice, Plugin, TFile, WorkspaceLeaf, Modal, Setting } from 'obsidian';

const VIEW_TYPE_PROJECT_ORGANIZER = 'project-organizer-view';

interface ProjectData {
	tasks: TaskItem[];
	archived: TaskItem[];
}

interface TaskItem {
	id: string;
	title: string;
	filePath: string;
}

export default class ProjectOrganizer extends Plugin {
	async onload() {
		this.registerView(
			VIEW_TYPE_PROJECT_ORGANIZER,
			(leaf) => new ProjectOrganizerView(leaf, this)
		);

		this.addCommand({
			id: 'open-project-organizer',
			name: 'Open Project Organizer',
			callback: () => {
				this.activateView();
			}
		});

		this.addRibbonIcon('layout-dashboard', 'Project Organizer', () => {
			this.activateView();
		});
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_PROJECT_ORGANIZER);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({
					type: VIEW_TYPE_PROJECT_ORGANIZER,
					active: true,
				});
			}
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_PROJECT_ORGANIZER);
	}
}

class ProjectOrganizerView extends ItemView {
	plugin: ProjectOrganizer;
	projectData: ProjectData;
	currentProjectFile: TFile | null = null;
	showArchived: boolean = false;

	constructor(leaf: WorkspaceLeaf, plugin: ProjectOrganizer) {
		super(leaf);
		this.plugin = plugin;
		this.projectData = { tasks: [], archived: [] };
	}

	getViewType(): string {
		return VIEW_TYPE_PROJECT_ORGANIZER;
	}

	getDisplayText(): string {
		return 'Project Organizer';
	}

	getIcon(): string {
		return 'layout-dashboard';
	}

	async onOpen() {
		await this.render();
	}

	async render() {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass('project-organizer-container');

		// Header
		const headerEl = container.createDiv({ cls: 'project-organizer-header' });
		headerEl.createEl('h2', { text: 'Project Organizer' });

		// Project selector
		const projectSelectorEl = container.createDiv({ cls: 'project-selector' });
		const selectBtn = projectSelectorEl.createEl('button', { text: 'Select Project File' });
		selectBtn.addEventListener('click', () => {
			this.selectProjectFile();
		});

		if (this.currentProjectFile) {
			projectSelectorEl.createEl('p', {
				text: `Current: ${this.currentProjectFile.basename}`,
				cls: 'current-project'
			});
		}

		// Controls
		const controlsEl = container.createDiv({ cls: 'project-controls' });

		const addBtn = controlsEl.createEl('button', { text: '+ New Task' });
		addBtn.addEventListener('click', () => {
			this.showAddTaskModal();
		});

		const toggleArchiveBtn = controlsEl.createEl('button', {
			text: this.showArchived ? 'Hide Archived' : 'Show Archived'
		});
		toggleArchiveBtn.addEventListener('click', async () => {
			this.showArchived = !this.showArchived;
			await this.render();
		});

		// Task list
		const tasksEl = container.createDiv({ cls: 'tasks-container' });

		if (this.showArchived) {
			tasksEl.createEl('h3', { text: 'Archived Tasks' });
			this.renderTaskList(tasksEl, this.projectData.archived, true);
		} else {
			tasksEl.createEl('h3', { text: 'Active Tasks' });
			this.renderTaskList(tasksEl, this.projectData.tasks, false);
		}
	}

	renderTaskList(container: HTMLElement, tasks: TaskItem[], isArchived: boolean) {
		const listEl = container.createDiv({ cls: 'task-list' });

		if (tasks.length === 0) {
			listEl.createEl('p', {
				text: isArchived ? 'No archived tasks' : 'No tasks yet. Click "+ New Task" to add one.',
				cls: 'empty-message'
			});
			return;
		}

		tasks.forEach((task, index) => {
			const taskEl = listEl.createDiv({ cls: 'task-item' });
			taskEl.setAttribute('draggable', 'true');
			taskEl.dataset.taskId = task.id;

			// Drag and drop handlers
			if (!isArchived) {
				taskEl.addEventListener('dragstart', (e) => {
					if (e.dataTransfer) {
						e.dataTransfer.effectAllowed = 'move';
						e.dataTransfer.setData('text/plain', index.toString());
						taskEl.addClass('dragging');
					}
				});

				taskEl.addEventListener('dragend', () => {
					taskEl.removeClass('dragging');
				});

				taskEl.addEventListener('dragover', (e) => {
					e.preventDefault();
					if (e.dataTransfer) {
						e.dataTransfer.dropEffect = 'move';
					}
				});

				taskEl.addEventListener('drop', async (e) => {
					e.preventDefault();
					const fromIndex = parseInt(e.dataTransfer?.getData('text/plain') || '');
					const toIndex = index;

					if (!isNaN(fromIndex) && fromIndex !== toIndex) {
						await this.moveTask(fromIndex, toIndex);
					}
				});
			}

			// Task content
			const contentEl = taskEl.createDiv({ cls: 'task-content' });

			// Move buttons
			if (!isArchived) {
				const moveUpBtn = contentEl.createEl('button', { text: '↑', cls: 'move-btn' });
				moveUpBtn.addEventListener('click', async () => {
					if (index > 0) {
						await this.moveTask(index, index - 1);
					}
				});

				const moveDownBtn = contentEl.createEl('button', { text: '↓', cls: 'move-btn' });
				moveDownBtn.addEventListener('click', async () => {
					if (index < tasks.length - 1) {
						await this.moveTask(index, index + 1);
					}
				});
			}

			const titleEl = contentEl.createEl('span', { text: task.title, cls: 'task-title' });
			titleEl.addEventListener('click', async () => {
				await this.openTaskFile(task.filePath);
			});

			// Context menu
			taskEl.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				this.showTaskContextMenu(e, task, isArchived);
			});
		});
	}

	showTaskContextMenu(e: MouseEvent, task: TaskItem, isArchived: boolean) {
		const menu = new ContextMenuModal(this.app, task, isArchived, async (action) => {
			if (action === 'archive') {
				await this.archiveTask(task);
			} else if (action === 'unarchive') {
				await this.unarchiveTask(task);
			} else if (action === 'delete') {
				await this.deleteTask(task, isArchived);
			}
		});
		menu.open();
	}

	async selectProjectFile() {
		const files = this.app.vault.getMarkdownFiles();
		const modal = new FileSelectModal(this.app, files, async (file) => {
			this.currentProjectFile = file;
			await this.loadProjectData();
			await this.render();
		});
		modal.open();
	}

	async loadProjectData() {
		if (!this.currentProjectFile) {
			return;
		}

		try {
			const content = await this.app.vault.read(this.currentProjectFile);
			const data = JSON.parse(content);
			this.projectData = data;
		} catch (e) {
			// If file doesn't have valid JSON, initialize empty project
			this.projectData = { tasks: [], archived: [] };
		}
	}

	async saveProjectData() {
		if (!this.currentProjectFile) {
			new Notice('No project file selected');
			return;
		}

		const content = JSON.stringify(this.projectData, null, 2);
		await this.app.vault.modify(this.currentProjectFile, content);
	}

	showAddTaskModal() {
		if (!this.currentProjectFile) {
			new Notice('Please select a project file first');
			return;
		}

		const modal = new AddTaskModal(this.app, async (title, filePath) => {
			const newTask: TaskItem = {
				id: Date.now().toString(),
				title: title,
				filePath: filePath
			};

			this.projectData.tasks.push(newTask);
			await this.saveProjectData();
			await this.render();
		});
		modal.open();
	}

	async moveTask(fromIndex: number, toIndex: number) {
		const [task] = this.projectData.tasks.splice(fromIndex, 1);
		this.projectData.tasks.splice(toIndex, 0, task);
		await this.saveProjectData();
		await this.render();
	}

	async archiveTask(task: TaskItem) {
		const index = this.projectData.tasks.findIndex(t => t.id === task.id);
		if (index !== -1) {
			this.projectData.tasks.splice(index, 1);
			this.projectData.archived.push(task);
			await this.saveProjectData();
			await this.render();
			new Notice('Task archived');
		}
	}

	async unarchiveTask(task: TaskItem) {
		const index = this.projectData.archived.findIndex(t => t.id === task.id);
		if (index !== -1) {
			this.projectData.archived.splice(index, 1);
			this.projectData.tasks.push(task);
			await this.saveProjectData();
			await this.render();
			new Notice('Task unarchived');
		}
	}

	async deleteTask(task: TaskItem, isArchived: boolean) {
		const array = isArchived ? this.projectData.archived : this.projectData.tasks;
		const index = array.findIndex(t => t.id === task.id);
		if (index !== -1) {
			array.splice(index, 1);
			await this.saveProjectData();
			await this.render();
			new Notice('Task deleted');
		}
	}

	async openTaskFile(filePath: string) {
		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (file instanceof TFile) {
			await this.app.workspace.getLeaf().openFile(file);
		} else {
			new Notice('File not found: ' + filePath);
		}
	}
}

class AddTaskModal extends Modal {
	onSubmit: (title: string, filePath: string) => void;

	constructor(app: App, onSubmit: (title: string, filePath: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: 'Add New Task' });

		let title = '';
		let filePath = '';

		new Setting(contentEl)
			.setName('Task Title')
			.addText(text => text
				.setPlaceholder('Enter task title')
				.onChange(value => title = value));

		new Setting(contentEl)
			.setName('Note Path')
			.setDesc('Path to the note for this task')
			.addText(text => text
				.setPlaceholder('folder/note.md')
				.onChange(value => filePath = value));

		new Setting(contentEl)
			.addButton(btn => btn
				.setButtonText('Add Task')
				.setCta()
				.onClick(() => {
					if (title && filePath) {
						this.onSubmit(title, filePath);
						this.close();
					} else {
						new Notice('Please fill in all fields');
					}
				}));
	}
}

class FileSelectModal extends Modal {
	files: TFile[];
	onSelect: (file: TFile) => void;

	constructor(app: App, files: TFile[], onSelect: (file: TFile) => void) {
		super(app);
		this.files = files;
		this.onSelect = onSelect;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: 'Select Project File' });

		const listEl = contentEl.createDiv({ cls: 'file-list' });

		this.files.forEach(file => {
			const fileEl = listEl.createDiv({ cls: 'file-item' });
			fileEl.textContent = file.path;
			fileEl.addEventListener('click', () => {
				this.onSelect(file);
				this.close();
			});
		});
	}
}

class ContextMenuModal extends Modal {
	task: TaskItem;
	isArchived: boolean;
	onAction: (action: string) => void;

	constructor(app: App, task: TaskItem, isArchived: boolean, onAction: (action: string) => void) {
		super(app);
		this.task = task;
		this.isArchived = isArchived;
		this.onAction = onAction;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('context-menu');

		if (this.isArchived) {
			const unarchiveBtn = contentEl.createEl('button', { text: 'Unarchive' });
			unarchiveBtn.addEventListener('click', () => {
				this.onAction('unarchive');
				this.close();
			});
		} else {
			const archiveBtn = contentEl.createEl('button', { text: 'Archive' });
			archiveBtn.addEventListener('click', () => {
				this.onAction('archive');
				this.close();
			});
		}

		const deleteBtn = contentEl.createEl('button', { text: 'Delete', cls: 'danger' });
		deleteBtn.addEventListener('click', () => {
			this.onAction('delete');
			this.close();
		});
	}
}
