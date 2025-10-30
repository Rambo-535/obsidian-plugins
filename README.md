# 3 AI-Powered Obsidian Plugins

Three custom Obsidian plugins created to enhance your note-taking workflow, inspired by the video demonstration.

## Plugins Included

### 1. AI Title Generator
Automatically generate descriptive titles for your notes based on their content, or correct typos in existing titles.

**Features:**
- Generate titles from note content using AI
- Correct spelling and formatting in existing titles
- Keyboard shortcut support for quick access
- Support for multiple AI providers (OpenAI, Anthropic, Ollama)

### 2. AI Grammar Corrector
Fix grammar, spelling, and punctuation errors in your notes with AI assistance.

**Features:**
- Correct entire notes or selected text
- Preserves your writing style and meaning
- Works on single words, sentences, or full documents
- Fast and accurate corrections

### 3. Project Organizer
Visual project management interface for organizing tasks and notes.

**Features:**
- Drag-and-drop task organization
- Click to navigate to task notes
- Archive completed tasks
- Move tasks up/down with buttons or drag-and-drop
- Multiple project support

## Quick Start

### Option 1: Automated Installation (Recommended)

Run the installation script:

```bash
./install.sh
```

The script will automatically:
1. Find your Obsidian vault
2. Copy all plugin files to the correct location
3. Show you the next steps

### Option 2: Manual Installation

See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for detailed step-by-step instructions.

## What's Included

```
obsidian-plugins/
├── ai-title-generator/        # AI Title Generator plugin
│   ├── manifest.json
│   ├── main.js
│   └── main.ts (source)
│
├── ai-grammar-corrector/      # AI Grammar Corrector plugin
│   ├── manifest.json
│   ├── main.js
│   └── main.ts (source)
│
├── project-organizer/         # Project Organizer plugin
│   ├── manifest.json
│   ├── main.js
│   ├── styles.css
│   └── main.ts (source)
│
├── INSTALLATION_GUIDE.md      # Complete installation instructions
├── QUICK_REFERENCE.md         # Usage guide and tips
├── install.sh                 # Automated installation script
└── README.md                  # This file
```

## Requirements

- **Obsidian**: Version 0.15.0 or higher
- **AI Provider** (choose one):
  - OpenAI account + API key
  - Anthropic account + API key
  - Ollama installed locally (free, no API key needed)

## Setup Steps

1. **Install the plugins** (see above)
2. **Restart Obsidian**
3. **Enable plugins** in Settings → Community plugins
4. **Configure AI provider** in each plugin's settings
5. **Start using!** (see QUICK_REFERENCE.md for usage)

## AI Provider Options

| Provider | Pros | Cons | Cost |
|----------|------|------|------|
| **OpenAI** | Fast, high quality | Requires internet & API key | ~$0.001 per request |
| **Anthropic** | Excellent for text editing | Requires internet & API key | Similar to OpenAI |
| **Ollama** | Free, private, offline | Slower, requires setup | Free |

## Documentation

- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Complete installation and setup guide for beginners
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick usage guide, keyboard shortcuts, and tips

## Usage Examples

### AI Title Generator

```
1. Write a note about a topic
2. Press Cmd/Ctrl + P → "Generate title from content"
3. AI creates a descriptive title and renames your file
```

### AI Grammar Corrector

```
1. Write or paste text with errors
2. Select the text (or don't select to correct entire note)
3. Press Cmd/Ctrl + P → "Correct grammar and typos"
4. Your text is replaced with the corrected version
```

### Project Organizer

```
1. Open Project Organizer (ribbon icon or command palette)
2. Select or create a project file
3. Add tasks with linked notes
4. Drag to reorder, right-click to archive
5. Click tasks to open their notes
```

## Keyboard Shortcuts (Recommended)

Set these up in Settings → Hotkeys:

- `Cmd/Ctrl + Shift + T` - Generate title
- `Cmd/Ctrl + Shift + C` - Correct title
- `Cmd/Ctrl + Shift + G` - Correct grammar

## Privacy & Security

- **API Keys** are stored locally in your vault
- **Your notes** are sent to AI providers for processing (except Ollama)
- **OpenAI & Anthropic** do not use API data for training
- **For maximum privacy**: Use Ollama (runs 100% locally)

## Cost Optimization

To minimize costs:

1. **Use free Ollama** for unlimited local processing
2. **Use cheaper models**: `gpt-4o-mini` instead of `gpt-4o`
3. **Be selective**: Only run corrections when needed

Typical costs with OpenAI/Anthropic:
- Title generation: ~$0.001 per title
- Grammar correction: ~$0.002-0.01 per paragraph

## Troubleshooting

**Plugins don't appear:**
- Restart Obsidian
- Check folder names match exactly
- Enable Community Plugins

**API errors:**
- Verify API key is correct (no extra spaces)
- Check you have credits/billing enabled
- Test your API key at the provider's website

**Ollama not working:**
- Make sure Ollama is running: `ollama serve`
- Pull a model: `ollama pull llama3`
- Check the URL is correct: `http://localhost:11434`

See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for more troubleshooting help.

## Technical Details

All plugins are written in TypeScript and compiled to JavaScript using esbuild.

**Technology stack:**
- TypeScript 4.7.4
- Obsidian API
- esbuild for bundling
- Various AI provider APIs

**Source code structure:**
- `main.ts` - Plugin source code
- `manifest.json` - Plugin metadata
- `styles.css` - UI styling (Project Organizer only)
- `main.js` - Compiled output

## Development

If you want to modify the plugins:

```bash
cd ai-title-generator  # or other plugin
npm install
npm run dev            # Watch mode
npm run build          # Production build
```

## Inspired By

These plugins were created based on the demonstration in [this YouTube video](https://www.youtube.com/watch?v=EB7Oo6j68ws) by Santi Younger, showcasing AI-powered Obsidian plugins.

## License

MIT License - Feel free to modify and distribute as needed.

## Support

For issues or questions:
1. Check [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for setup help
2. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for usage help
3. Review the troubleshooting section above

## Credits

- Created using AI assistance (Claude Code)
- Inspired by Santi Younger's video demonstration
- Built with the Obsidian Plugin API

---

**Happy note-taking! 📝✨**
