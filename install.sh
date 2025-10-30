#!/bin/bash

# Installation script for Obsidian plugins
# This script will copy the plugins to your Obsidian vault

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Obsidian Plugin Installer                                ║"
echo "║   Installing: AI Title Generator, AI Grammar Corrector,    ║"
echo "║              and Project Organizer                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Detect the vault location
VAULT_PATH="/Users/tvince/Library/Mobile Documents/iCloud~md~obsidian/Documents/tmq_obsidian_vault"

if [ ! -d "$VAULT_PATH" ]; then
    echo "⚠️  Default vault not found at:"
    echo "   $VAULT_PATH"
    echo ""
    read -p "Enter your Obsidian vault path: " VAULT_PATH
fi

if [ ! -d "$VAULT_PATH" ]; then
    echo "❌ Error: Vault path does not exist: $VAULT_PATH"
    exit 1
fi

echo "✓ Found vault at: $VAULT_PATH"
echo ""

# Check if .obsidian folder exists
OBSIDIAN_DIR="$VAULT_PATH/.obsidian"
if [ ! -d "$OBSIDIAN_DIR" ]; then
    echo "❌ Error: .obsidian folder not found in vault"
    echo "   Make sure this is a valid Obsidian vault"
    exit 1
fi

# Create plugins directory if it doesn't exist
PLUGINS_DIR="$OBSIDIAN_DIR/plugins"
if [ ! -d "$PLUGINS_DIR" ]; then
    echo "📁 Creating plugins directory..."
    mkdir -p "$PLUGINS_DIR"
fi

echo "✓ Plugins directory ready"
echo ""

# Get the script directory (where the plugins are)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to install a plugin
install_plugin() {
    local plugin_name=$1
    local has_styles=$2

    echo "📦 Installing $plugin_name..."

    local source_dir="$SCRIPT_DIR/$plugin_name"
    local target_dir="$PLUGINS_DIR/$plugin_name"

    # Check if source exists
    if [ ! -d "$source_dir" ]; then
        echo "   ❌ Error: Source directory not found: $source_dir"
        return 1
    fi

    # Create target directory
    mkdir -p "$target_dir"

    # Copy files
    if [ -f "$source_dir/manifest.json" ]; then
        cp "$source_dir/manifest.json" "$target_dir/"
        echo "   ✓ Copied manifest.json"
    else
        echo "   ❌ Error: manifest.json not found"
        return 1
    fi

    if [ -f "$source_dir/main.js" ]; then
        cp "$source_dir/main.js" "$target_dir/"
        echo "   ✓ Copied main.js"
    else
        echo "   ❌ Error: main.js not found"
        return 1
    fi

    if [ "$has_styles" = "true" ]; then
        if [ -f "$source_dir/styles.css" ]; then
            cp "$source_dir/styles.css" "$target_dir/"
            echo "   ✓ Copied styles.css"
        fi
    fi

    echo "   ✅ $plugin_name installed successfully"
    echo ""
}

# Install each plugin
install_plugin "ai-title-generator" "false"
install_plugin "ai-grammar-corrector" "false"
install_plugin "project-organizer" "true"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   ✅ All plugins installed successfully!                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Restart Obsidian (completely quit and reopen)"
echo "2. Go to Settings → Community plugins"
echo "3. Enable the three new plugins:"
echo "   • AI Title Generator"
echo "   • AI Grammar Corrector"
echo "   • Project Organizer"
echo "4. Configure your AI provider and API key in plugin settings"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - INSTALLATION_GUIDE.md (complete setup guide)"
echo "   - QUICK_REFERENCE.md (usage tips and shortcuts)"
echo ""
echo "🎉 Happy note-taking!"
