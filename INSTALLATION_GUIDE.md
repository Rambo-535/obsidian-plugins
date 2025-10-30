# Installation Guide: 3 AI-Powered Obsidian Plugins

This guide will walk you through installing three custom Obsidian plugins:
1. **AI Title Generator** - Generate and correct note titles using AI
2. **AI Grammar Corrector** - Correct grammar and typos in your notes
3. **Project Organizer** - Visual project management with drag-and-drop

## Prerequisites

Before you begin, make sure you have:
- Obsidian installed on your computer
- An existing Obsidian vault (or create a new one)
- An API key from your chosen AI provider:
  - **OpenAI**: Get your API key at https://platform.openai.com/api-keys
  - **Anthropic**: Get your API key at https://console.anthropic.com/
  - **Ollama**: Install from https://ollama.ai/ (runs locally, no API key needed)

## Part 1: Locating Your Obsidian Plugins Folder

### Step 1: Find Your Vault's Plugin Folder

1. Open Obsidian
2. Open your vault
3. In Obsidian, go to **Settings** (click the gear icon in the bottom left)
4. Click on **Community plugins**
5. If you see a message about "Restricted mode", click **Turn off restricted mode**
6. Click on the folder icon next to "Installed plugins" OR manually navigate to your vault folder

Your plugins folder is located at:
```
[Your Vault Folder]/.obsidian/plugins/
```

**Note**: The `.obsidian` folder is hidden by default. To see it:

**On Mac:**
- Press `Cmd + Shift + .` in Finder to show hidden files
- Or navigate to your vault in Terminal and run: `open .obsidian/plugins`

**On Windows:**
- In File Explorer, click "View" > "Show" > "Hidden items"
- Or type `%USERPROFILE%\Documents\[YourVault]\.obsidian\plugins` in the address bar

**On Linux:**
- Press `Ctrl + H` in your file manager to show hidden files
- Or navigate to `~/.config/obsidian/[YourVault]/.obsidian/plugins/`

## Part 2: Installing the Plugins

For each plugin, you'll need to copy three files into a new folder. Here's how:

### Plugin 1: AI Title Generator

1. Navigate to your plugins folder (found in Part 1)
2. Create a new folder named: `ai-title-generator`
3. Copy these 3 files from the downloaded plugin into that folder:
   - `manifest.json`
   - `main.js`
   - (styles.css is not needed for this plugin)

**Files to copy:**
```
Source: obsidian-plugins/ai-title-generator/
Copy to: [Your Vault]/.obsidian/plugins/ai-title-generator/

Files:
✓ manifest.json
✓ main.js
```

### Plugin 2: AI Grammar Corrector

1. In your plugins folder, create a new folder named: `ai-grammar-corrector`
2. Copy these 3 files:
   - `manifest.json`
   - `main.js`

**Files to copy:**
```
Source: obsidian-plugins/ai-grammar-corrector/
Copy to: [Your Vault]/.obsidian/plugins/ai-grammar-corrector/

Files:
✓ manifest.json
✓ main.js
```

### Plugin 3: Project Organizer

1. In your plugins folder, create a new folder named: `project-organizer`
2. Copy these 3 files:
   - `manifest.json`
   - `main.js`
   - `styles.css`

**Files to copy:**
```
Source: obsidian-plugins/project-organizer/
Copy to: [Your Vault]/.obsidian/plugins/project-organizer/

Files:
✓ manifest.json
✓ main.js
✓ styles.css
```

### Your folder structure should look like this:

```
[Your Vault]/.obsidian/plugins/
├── ai-title-generator/
│   ├── manifest.json
│   └── main.js
├── ai-grammar-corrector/
│   ├── manifest.json
│   └── main.js
└── project-organizer/
    ├── manifest.json
    ├── main.js
    └── styles.css
```

## Part 3: Enabling the Plugins

1. **Reload Obsidian** or restart the app
2. Go to **Settings** → **Community plugins**
3. You should now see three new plugins in your list:
   - AI Title Generator
   - AI Grammar Corrector
   - Project Organizer
4. Toggle each plugin **ON** (the switch should turn blue/green)

## Part 4: Configuring the Plugins

### Configuring AI Title Generator

1. Go to **Settings** → Scroll down to find **AI Title Generator** in the plugin settings
2. Choose your **AI Provider** from the dropdown:
   - OpenAI
   - Anthropic (Claude)
   - Ollama (Local)
3. Enter your API key (if using OpenAI or Anthropic)
4. Optionally change the model name if desired

**Default models:**
- OpenAI: `gpt-4o-mini`
- Anthropic: `claude-3-5-sonnet-20241022`
- Ollama: `llama2` (must be installed via `ollama pull llama2`)

### Configuring AI Grammar Corrector

1. Go to **Settings** → **AI Grammar Corrector**
2. Choose your **AI Provider** (same as above)
3. Enter your API key
4. Configure the model if needed

### Configuring Project Organizer

The Project Organizer doesn't require API keys! It works out of the box.

## Part 5: Using the Plugins

### Using AI Title Generator

**Generate a title:**
1. Create or open a note
2. Write some content in your note
3. Open the **Command Palette** (`Cmd/Ctrl + P`)
4. Type: `Generate title from content`
5. Press Enter
6. The AI will generate a title and rename your file

**Correct a title:**
1. Open a note with a title that has typos
2. Open Command Palette (`Cmd/Ctrl + P`)
3. Type: `Correct title typos`
4. Press Enter
5. The AI will fix spelling and formatting

**Pro Tip:** Assign keyboard shortcuts!
- Go to Settings → Hotkeys
- Search for "AI Title Generator"
- Assign shortcuts like:
  - `Cmd/Ctrl + Shift + T` for "Generate title"
  - `Cmd/Ctrl + Shift + C` for "Correct title"

### Using AI Grammar Corrector

1. Open a note with text
2. **Select the text** you want to correct (or select nothing to correct the entire note)
3. Open Command Palette (`Cmd/Ctrl + P`)
4. Type: `Correct grammar and typos`
5. Press Enter
6. The AI will replace your text with the corrected version

**Pro Tip:** Assign a keyboard shortcut!
- Go to Settings → Hotkeys
- Search for "AI Grammar Corrector"
- Assign a shortcut like `Cmd/Ctrl + Shift + G`

### Using Project Organizer

**Opening the Project Organizer:**
- Click the dashboard icon in the left ribbon, OR
- Open Command Palette and type: `Open Project Organizer`

**Setting up a project:**
1. Click **"Select Project File"**
2. Choose an existing note or create a new one (this will store your project data)
3. Click **"+ New Task"**
4. Enter:
   - **Task Title**: Name of the task
   - **Note Path**: Path to a note related to this task (e.g., `Projects/Task1.md`)
5. Click **"Add Task"**

**Managing tasks:**
- **Click on a task** to open the linked note
- **Drag and drop** tasks to reorder them
- **Use ↑ ↓ buttons** to move tasks up/down
- **Right-click** a task to see options:
  - Archive (for completed tasks)
  - Delete
- Click **"Show Archived"** to view archived tasks
- Right-click archived tasks to unarchive or delete them

## Troubleshooting

### Plugins Don't Appear in Settings

- Make sure you copied the files to the correct location
- The folder names must match exactly: `ai-title-generator`, `ai-grammar-corrector`, `project-organizer`
- Restart Obsidian completely (quit and reopen)
- Check that Community Plugins is enabled (not in Restricted Mode)

### "API Key Not Set" Error

- Go to Settings → Plugin Settings
- Make sure you've entered your API key correctly
- For OpenAI: Keys start with `sk-`
- For Anthropic: Keys start with `sk-ant-`
- Make sure there are no extra spaces before or after the key

### Ollama Not Working

- Make sure Ollama is installed and running
- Check that the Ollama URL is correct (default: `http://localhost:11434`)
- Make sure you've pulled the model: `ollama pull llama2`
- Test Ollama by running: `ollama run llama2 "Hello"` in terminal

### "File Not Found" in Project Organizer

- Make sure the note path exists in your vault
- Paths are relative to your vault root
- Use forward slashes: `folder/note.md` (not backslashes)
- Include the `.md` extension

### Commands Don't Show in Command Palette

- Make sure the plugin is enabled (toggle is ON)
- Try reloading Obsidian
- Check if there are any error messages in the console (Settings → Developer → Toggle Developer Tools)

## Cost Considerations

### OpenAI Pricing (as of 2024)
- GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Title generation: ~$0.001 per title
- Grammar correction: ~$0.002-0.01 per paragraph

### Anthropic Pricing
- Claude 3.5 Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Similar costs to OpenAI for typical usage

### Ollama (Free!)
- Completely free if you run it locally
- Requires decent hardware (8GB+ RAM recommended)
- Slower than cloud APIs but private and unlimited

## Privacy & Security

- **API Keys**: Your API keys are stored locally in your vault at `.obsidian/plugins/[plugin-name]/data.json`
- **Data**: Your notes are sent to the AI provider's API for processing (except Ollama, which runs locally)
- **OpenAI & Anthropic**: Do NOT use your notes to train their models (as per their API policies)
- **For sensitive data**: Use Ollama to keep everything local

## Advanced: Customizing Models

You can use different models by changing the model name in settings:

**OpenAI Models:**
- `gpt-4o-mini` (cheapest, fastest)
- `gpt-4o` (most capable)
- `gpt-4-turbo`

**Anthropic Models:**
- `claude-3-5-sonnet-20241022` (recommended)
- `claude-3-opus-20240229` (most capable)
- `claude-3-haiku-20240307` (fastest, cheapest)

**Ollama Models:**
- `llama2` (7B parameters)
- `llama3` (8B parameters, better quality)
- `mistral` (7B, good for grammar)
- Install any model: `ollama pull [model-name]`

## Getting Help

If you encounter issues:
1. Check the Developer Console: Settings → Developer → Toggle Developer Tools
2. Look for error messages in red
3. Make sure your API keys are valid and have credits
4. Verify your internet connection (for OpenAI/Anthropic)
5. Test your Ollama installation (for Ollama)

## Next Steps

Now that you have the plugins installed:
1. Try generating titles for your existing notes
2. Use grammar correction to polish your writing
3. Set up a project in the Project Organizer
4. Assign keyboard shortcuts for faster workflow
5. Experiment with different AI providers to find what works best for you

Enjoy your new AI-powered Obsidian workflow!
