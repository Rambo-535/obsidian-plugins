import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, requestUrl } from 'obsidian';

interface AITitleGeneratorSettings {
	aiProvider: 'openai' | 'anthropic' | 'ollama';
	openaiApiKey: string;
	anthropicApiKey: string;
	ollamaUrl: string;
	ollamaModel: string;
	openaiModel: string;
	anthropicModel: string;
}

const DEFAULT_SETTINGS: AITitleGeneratorSettings = {
	aiProvider: 'openai',
	openaiApiKey: '',
	anthropicApiKey: '',
	ollamaUrl: 'http://localhost:11434',
	ollamaModel: 'llama2',
	openaiModel: 'gpt-4o-mini',
	anthropicModel: 'claude-3-5-sonnet-20241022'
}

export default class AITitleGenerator extends Plugin {
	settings: AITitleGeneratorSettings;

	async onload() {
		await this.loadSettings();

		// Command: Generate title from content
		this.addCommand({
			id: 'generate-title',
			name: 'Generate title from content',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.generateTitle(view);
			}
		});

		// Command: Correct existing title
		this.addCommand({
			id: 'correct-title',
			name: 'Correct title typos',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.correctTitle(view);
			}
		});

		this.addSettingTab(new AITitleGeneratorSettingTab(this.app, this));
	}

	async generateTitle(view: MarkdownView) {
		const file = view.file;
		if (!file) {
			new Notice('No active file');
			return;
		}

		const content = await this.app.vault.read(file);
		if (!content || content.trim().length === 0) {
			new Notice('Note is empty');
			return;
		}

		const notice = new Notice('Generating title...', 0);

		try {
			const prompt = `Based on the following note content, generate a concise, descriptive title (just the title, no quotes or extra text):\n\n${content.slice(0, 2000)}`;
			const newTitle = await this.callAI(prompt);

			if (newTitle && newTitle.trim()) {
				const sanitizedTitle = this.sanitizeTitle(newTitle.trim());
				await this.renameFile(file, sanitizedTitle);
				notice.hide();
				new Notice(`Title generated: ${sanitizedTitle}`);
			} else {
				notice.hide();
				new Notice('Failed to generate title');
			}
		} catch (error) {
			notice.hide();
			new Notice('Error generating title: ' + error.message);
			console.error(error);
		}
	}

	async correctTitle(view: MarkdownView) {
		const file = view.file;
		if (!file) {
			new Notice('No active file');
			return;
		}

		const currentTitle = file.basename;
		const notice = new Notice('Correcting title...', 0);

		try {
			const prompt = `Correct any typos and formatting issues in this title, keeping the same meaning. Return only the corrected title:\n\n${currentTitle}`;
			const correctedTitle = await this.callAI(prompt);

			if (correctedTitle && correctedTitle.trim()) {
				const sanitizedTitle = this.sanitizeTitle(correctedTitle.trim());
				if (sanitizedTitle !== currentTitle) {
					await this.renameFile(file, sanitizedTitle);
					notice.hide();
					new Notice(`Title corrected: ${sanitizedTitle}`);
				} else {
					notice.hide();
					new Notice('Title looks good already!');
				}
			} else {
				notice.hide();
				new Notice('Failed to correct title');
			}
		} catch (error) {
			notice.hide();
			new Notice('Error correcting title: ' + error.message);
			console.error(error);
		}
	}

	sanitizeTitle(title: string): string {
		// Remove quotes if present
		title = title.replace(/^["']|["']$/g, '');
		// Remove invalid filename characters
		title = title.replace(/[\\/:*?"<>|]/g, '-');
		// Limit length
		if (title.length > 100) {
			title = title.slice(0, 100);
		}
		return title;
	}

	async renameFile(file: TFile, newTitle: string) {
		const newPath = file.parent ? `${file.parent.path}/${newTitle}.md` : `${newTitle}.md`;
		await this.app.fileManager.renameFile(file, newPath);
	}

	async callAI(prompt: string): Promise<string> {
		switch (this.settings.aiProvider) {
			case 'openai':
				return await this.callOpenAI(prompt);
			case 'anthropic':
				return await this.callAnthropic(prompt);
			case 'ollama':
				return await this.callOllama(prompt);
			default:
				throw new Error('Invalid AI provider');
		}
	}

	async callOpenAI(prompt: string): Promise<string> {
		if (!this.settings.openaiApiKey) {
			throw new Error('OpenAI API key not set. Please configure it in settings.');
		}

		const response = await requestUrl({
			url: 'https://api.openai.com/v1/chat/completions',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.settings.openaiApiKey}`
			},
			body: JSON.stringify({
				model: this.settings.openaiModel,
				messages: [
					{ role: 'system', content: 'You are a helpful assistant that generates concise, descriptive titles for notes.' },
					{ role: 'user', content: prompt }
				],
				temperature: 0.7,
				max_tokens: 100
			})
		});

		const data = response.json;
		return data.choices[0].message.content.trim();
	}

	async callAnthropic(prompt: string): Promise<string> {
		if (!this.settings.anthropicApiKey) {
			throw new Error('Anthropic API key not set. Please configure it in settings.');
		}

		const response = await requestUrl({
			url: 'https://api.anthropic.com/v1/messages',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.settings.anthropicApiKey,
				'anthropic-version': '2023-06-01'
			},
			body: JSON.stringify({
				model: this.settings.anthropicModel,
				max_tokens: 100,
				messages: [
					{ role: 'user', content: prompt }
				]
			})
		});

		const data = response.json;
		return data.content[0].text.trim();
	}

	async callOllama(prompt: string): Promise<string> {
		const response = await requestUrl({
			url: `${this.settings.ollamaUrl}/api/generate`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: this.settings.ollamaModel,
				prompt: prompt,
				stream: false
			})
		});

		const data = response.json;
		return data.response.trim();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class AITitleGeneratorSettingTab extends PluginSettingTab {
	plugin: AITitleGenerator;

	constructor(app: App, plugin: AITitleGenerator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		containerEl.createEl('h2', {text: 'AI Title Generator Settings'});

		new Setting(containerEl)
			.setName('AI Provider')
			.setDesc('Choose which AI provider to use')
			.addDropdown(dropdown => dropdown
				.addOption('openai', 'OpenAI')
				.addOption('anthropic', 'Anthropic (Claude)')
				.addOption('ollama', 'Ollama (Local)')
				.setValue(this.plugin.settings.aiProvider)
				.onChange(async (value: 'openai' | 'anthropic' | 'ollama') => {
					this.plugin.settings.aiProvider = value;
					await this.plugin.saveSettings();
					this.display(); // Refresh to show relevant settings
				}));

		// OpenAI Settings
		if (this.plugin.settings.aiProvider === 'openai') {
			containerEl.createEl('h3', {text: 'OpenAI Settings'});

			new Setting(containerEl)
				.setName('OpenAI API Key')
				.setDesc('Enter your OpenAI API key')
				.addText(text => text
					.setPlaceholder('sk-...')
					.setValue(this.plugin.settings.openaiApiKey)
					.onChange(async (value) => {
						this.plugin.settings.openaiApiKey = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('OpenAI Model')
				.setDesc('Which OpenAI model to use')
				.addText(text => text
					.setPlaceholder('gpt-4o-mini')
					.setValue(this.plugin.settings.openaiModel)
					.onChange(async (value) => {
						this.plugin.settings.openaiModel = value;
						await this.plugin.saveSettings();
					}));
		}

		// Anthropic Settings
		if (this.plugin.settings.aiProvider === 'anthropic') {
			containerEl.createEl('h3', {text: 'Anthropic Settings'});

			new Setting(containerEl)
				.setName('Anthropic API Key')
				.setDesc('Enter your Anthropic API key')
				.addText(text => text
					.setPlaceholder('sk-ant-...')
					.setValue(this.plugin.settings.anthropicApiKey)
					.onChange(async (value) => {
						this.plugin.settings.anthropicApiKey = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('Anthropic Model')
				.setDesc('Which Claude model to use')
				.addText(text => text
					.setPlaceholder('claude-3-5-sonnet-20241022')
					.setValue(this.plugin.settings.anthropicModel)
					.onChange(async (value) => {
						this.plugin.settings.anthropicModel = value;
						await this.plugin.saveSettings();
					}));
		}

		// Ollama Settings
		if (this.plugin.settings.aiProvider === 'ollama') {
			containerEl.createEl('h3', {text: 'Ollama Settings'});

			new Setting(containerEl)
				.setName('Ollama URL')
				.setDesc('URL of your Ollama instance')
				.addText(text => text
					.setPlaceholder('http://localhost:11434')
					.setValue(this.plugin.settings.ollamaUrl)
					.onChange(async (value) => {
						this.plugin.settings.ollamaUrl = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('Ollama Model')
				.setDesc('Which model to use (must be installed in Ollama)')
				.addText(text => text
					.setPlaceholder('llama2')
					.setValue(this.plugin.settings.ollamaModel)
					.onChange(async (value) => {
						this.plugin.settings.ollamaModel = value;
						await this.plugin.saveSettings();
					}));
		}
	}
}
