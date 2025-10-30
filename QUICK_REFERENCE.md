# Quick Reference Guide

## Keyboard Shortcuts (Recommended Setup)

### AI Title Generator
- `Cmd/Ctrl + Shift + T` - Generate title from content
- `Cmd/Ctrl + Shift + C` - Correct title typos

### AI Grammar Corrector
- `Cmd/Ctrl + Shift + G` - Correct grammar (on selection or entire note)

### Project Organizer
- Open from Command Palette or click dashboard icon in ribbon

## Plugin Features Summary

### 1. AI Title Generator
**What it does:**
- Generates smart titles based on your note content
- Corrects typos and formatting in existing titles
- Supports multiple AI providers

**Usage:**
1. Write content in a note
2. Run "Generate title from content" command
3. AI creates a descriptive title and renames the file

### 2. AI Grammar Corrector
**What it does:**
- Corrects grammar, spelling, and punctuation
- Works on selected text or entire notes
- Preserves your writing style

**Usage:**
1. Select text to correct (or don't select anything for entire note)
2. Run "Correct grammar and typos" command
3. AI replaces text with corrected version

### 3. Project Organizer
**What it does:**
- Visual project management interface
- Drag-and-drop task organization
- Archive completed tasks
- Navigate to task notes with one click

**Usage:**
1. Open Project Organizer
2. Select a project file (stores task data as JSON)
3. Add tasks with linked notes
4. Drag to reorder, right-click to archive/delete

## AI Provider Comparison

| Feature | OpenAI | Anthropic | Ollama |
|---------|--------|-----------|---------|
| **Cost** | Pay per use (~$0.001/title) | Pay per use (similar to OpenAI) | Free |
| **Speed** | Fast (1-3 seconds) | Fast (1-3 seconds) | Slower (5-15 seconds) |
| **Quality** | Excellent | Excellent | Good |
| **Privacy** | Cloud-based | Cloud-based | 100% local |
| **Setup** | API key required | API key required | Install Ollama app |
| **Internet** | Required | Required | Not required |

## Common Commands

### From Command Palette (Cmd/Ctrl + P)

**AI Title Generator:**
- `AI Title Generator: Generate title from content`
- `AI Title Generator: Correct title typos`

**AI Grammar Corrector:**
- `AI Grammar Corrector: Correct grammar and typos`

**Project Organizer:**
- `Project Organizer: Open Project Organizer`

## Settings Locations

All plugin settings are in: **Settings → [Plugin Name]**

**AI Title Generator:**
- Settings → AI Title Generator
- Configure: Provider, API Key, Model

**AI Grammar Corrector:**
- Settings → AI Grammar Corrector
- Configure: Provider, API Key, Model

**Project Organizer:**
- No settings required (works out of the box)

## File Locations

**Plugin files:**
```
[Vault]/.obsidian/plugins/ai-title-generator/
[Vault]/.obsidian/plugins/ai-grammar-corrector/
[Vault]/.obsidian/plugins/project-organizer/
```

**Plugin data (settings, API keys):**
```
[Vault]/.obsidian/plugins/ai-title-generator/data.json
[Vault]/.obsidian/plugins/ai-grammar-corrector/data.json
[Vault]/.obsidian/plugins/project-organizer/data.json
```

## Tips & Tricks

### Title Generator
- Run on empty notes with placeholder text to get title ideas
- Use "Correct title" to fix manual typos without regenerating
- Generate multiple times to see different options (each run creates a new title)

### Grammar Corrector
- Select single words for quick spell-check
- Select paragraphs for grammar review
- Don't select anything to correct entire note
- Works great for cleaning up voice-to-text dictation

### Project Organizer
- Create different project files for different areas of your life
- Use descriptive task titles (they appear in the list view)
- Link tasks to existing notes or create new notes as needed
- Archive tasks instead of deleting to keep history

## Cost Optimization

**To minimize API costs:**

1. **Use cheaper models:**
   - OpenAI: `gpt-4o-mini` instead of `gpt-4o`
   - Anthropic: `claude-3-haiku-20240307` instead of `claude-3-5-sonnet-20241022`

2. **Use Ollama for free:**
   - Install: `brew install ollama` (Mac) or download from ollama.ai
   - Pull a model: `ollama pull llama3`
   - Select "Ollama" in plugin settings
   - No API costs, completely free!

3. **Be selective:**
   - Only run grammar correction on important notes
   - Generate titles only when needed (not for every note)

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Plugin doesn't appear | Restart Obsidian, check folder names |
| API key error | Re-enter key, check for extra spaces |
| Ollama not working | Run `ollama serve` in terminal |
| Slow responses | Try a smaller model or Ollama |
| File not found (Project Organizer) | Check note path, include `.md` extension |
| Command not in palette | Enable plugin, reload Obsidian |

## Example Workflows

### Daily Note Setup
1. Create daily note
2. Write rough thoughts
3. Use grammar corrector to clean up
4. Generate title based on content
5. Link to project in Project Organizer

### Project Management
1. Create project note
2. Open Project Organizer
3. Select project note as project file
4. Add tasks for each step
5. Reorder by priority
6. Archive when done

### Content Writing
1. Draft article in note
2. Use grammar corrector on each section
3. Generate title when finished
4. Use corrected title to fix any typos

## API Key Safety

- Keys are stored locally (not synced to Obsidian Sync by default)
- Keep your keys private
- Don't share screenshots with keys visible
- Rotate keys periodically for security
- Use `.gitignore` if syncing vault with Git

## Getting API Keys

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (you won't see it again!)
5. Add credits at https://platform.openai.com/account/billing

**Anthropic:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to "API Keys"
4. Click "Create Key"
5. Copy the key

**Ollama:**
1. Download from https://ollama.ai/
2. Install the app
3. Run `ollama pull llama3` in terminal
4. No API key needed!

## Model Recommendations

**For Title Generation:**
- Best quality: `gpt-4o` or `claude-3-5-sonnet-20241022`
- Best value: `gpt-4o-mini` or `llama3` (Ollama)

**For Grammar Correction:**
- Best quality: `claude-3-5-sonnet-20241022` (Claude excels at text editing)
- Best value: `gpt-4o-mini` or `mistral` (Ollama)

**For Local/Private:**
- Use Ollama with `llama3` or `mistral`
- Completely free and private
