import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';

interface AIGrammarCorrectorSettings {
	aiProvider: 'openai' | 'anthropic' | 'ollama';
	openaiApiKey: string;
	anthropicApiKey: string;
	ollamaUrl: string;
	ollamaModel: string;
	openaiModel: string;
	anthropicModel: string;
}

const DEFAULT_SETTINGS: AIGrammarCorrectorSettings = {
	aiProvider: 'openai',
	openaiApiKey: '',
	anthropicApiKey: '',
	ollamaUrl: 'http://localhost:11434',
	ollamaModel: 'llama2',
	openaiModel: 'gpt-4o-mini',
	anthropicModel: 'claude-3-5-sonnet-20241022'
}

export default class AIGrammarCorrector extends Plugin {
	settings: AIGrammarCorrectorSettings;

	async onload() {
		await this.loadSettings();

		// Command: Correct grammar in selection or entire note
		this.addCommand({
			id: 'correct-grammar',
			name: 'Correct grammar and typos',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.correctGrammar(editor);
			}
		});

		this.addSettingTab(new AIGrammarCorrectorSettingTab(this.app, this));
	}

	async correctGrammar(editor: Editor) {
		let textToCorrect = editor.getSelection();
		let hasSelection = true;

		if (!textToCorrect || textToCorrect.trim().length === 0) {
			textToCorrect = editor.getValue();
			hasSelection = false;

			if (!textToCorrect || textToCorrect.trim().length === 0) {
				new Notice('No text to correct');
				return;
			}
		}

		const notice = new Notice('Correcting grammar...', 0);

		try {
			const correctedText = await this.callAI(textToCorrect);

			if (correctedText && correctedText.trim()) {
				if (hasSelection) {
					editor.replaceSelection(correctedText);
				} else {
					editor.setValue(correctedText);
				}
				notice.hide();
				new Notice('Grammar corrected!');
			} else {
				notice.hide();
				new Notice('Failed to correct grammar');
			}
		} catch (error) {
			notice.hide();
			new Notice('Error correcting grammar: ' + error.message);
			console.error(error);
		}
	}

	async callAI(text: string): Promise<string> {
		switch (this.settings.aiProvider) {
			case 'openai':
				return await this.callOpenAI(text);
			case 'anthropic':
				return await this.callAnthropic(text);
			case 'ollama':
				return await this.callOllama(text);
			default:
				throw new Error('Invalid AI provider');
		}
	}

	async callOpenAI(text: string): Promise<string> {
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
					{
						role: 'system',
						content: 'You are a professional copy editor. Correct grammar, spelling, and punctuation errors while preserving the original meaning and style. Return only the corrected text without any explanations or comments.'
					},
					{ role: 'user', content: text }
				],
				temperature: 0.3
			})
		});

		const data = response.json;
		return data.choices[0].message.content.trim();
	}

	async callAnthropic(text: string): Promise<string> {
		if (!this.settings.anthropicApiKey) {
			throw new Error('Anthropic API key not set. Please configure it in settings.');
		}

		const prompt = `Please correct any grammar, spelling, and punctuation errors in the following text while preserving the original meaning and style. Return only the corrected text without any explanations:\n\n${text}`;

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
				max_tokens: 4096,
				messages: [
					{ role: 'user', content: prompt }
				]
			})
		});

		const data = response.json;
		return data.content[0].text.trim();
	}

	async callOllama(text: string): Promise<string> {
		const prompt = `Please correct any grammar, spelling, and punctuation errors in the following text while preserving the original meaning and style. Return only the corrected text without any explanations:\n\n${text}`;

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

class AIGrammarCorrectorSettingTab extends PluginSettingTab {
	plugin: AIGrammarCorrector;

	constructor(app: App, plugin: AIGrammarCorrector) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		containerEl.createEl('h2', {text: 'AI Grammar Corrector Settings'});

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
