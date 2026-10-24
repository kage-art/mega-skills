#!/usr/bin/env bash
# MegaSkills 1-Click Shell Installer for macOS & Linux
# Usage:
#   ./install.sh
#   curl -fsSL https://raw.githubusercontent.com/kage-art/mega-skills/main/install.sh | bash

set -e

PROFILE="full"
TARGET="all"
DEST=""
LINK=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --target)
      TARGET="$2"
      shift 2
      ;;
    --dest)
      DEST="$2"
      shift 2
      ;;
    --link)
      LINK="--link"
      shift
      ;;
    --help|-h)
      echo "Usage: ./install.sh [--profile <full|master|mobile|anti-slop|engineering|creative>] [--target <all|antigravity|claude|cursor|agents|codex>] [--dest <path>]"
      exit 0
      ;;
    *)
      shift
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" >/dev/null 2>&1 && pwd)"

# If executed via pipe or skills dir missing, download archive from GitHub
if [ ! -d "$SCRIPT_DIR/skills" ]; then
  echo "[*] Downloading latest MegaSkills package from GitHub..."
  TMP_DIR="$(mktemp -d)"
  curl -fsSL "https://codeload.github.com/kage-art/mega-skills/tar.gz/refs/heads/main" | tar -xz -C "$TMP_DIR"
  EXTRACTED_DIR="$(find "$TMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
  SCRIPT_DIR="$EXTRACTED_DIR"
fi

if command -v node >/dev/null 2>&1; then
  node "$SCRIPT_DIR/bin/cli.mjs" install --profile "$PROFILE" --target "$TARGET" ${DEST:+--dest "$DEST"}
else
  echo "[*] Node.js not found. Copying skills using bash fallback..."
  TARGET_DIR="${DEST:-$HOME/.gemini/config/skills}"
  mkdir -p "$TARGET_DIR/mega-master-skill"
  cp "$SCRIPT_DIR/SKILL.md" "$TARGET_DIR/mega-master-skill/SKILL.md"
  
  if [ "$PROFILE" != "master" ]; then
    cp -r "$SCRIPT_DIR/skills/"*/* "$TARGET_DIR/"
  fi
  
  # Deploy rules
  mkdir -p "$HOME/.gemini/config" "$HOME/.claude"
  [ -f "$SCRIPT_DIR/rules/GEMINI.md" ] && cp "$SCRIPT_DIR/rules/GEMINI.md" "$HOME/.gemini/config/GEMINI.md"
  [ -f "$SCRIPT_DIR/rules/CLAUDE.md" ] && cp "$SCRIPT_DIR/rules/CLAUDE.md" "$HOME/.claude/CLAUDE.md"
  [ -f "$SCRIPT_DIR/rules/.cursorrules" ] && cp "$SCRIPT_DIR/rules/.cursorrules" "./.cursorrules"
  [ -f "$SCRIPT_DIR/rules/.windsurfrules" ] && cp "$SCRIPT_DIR/rules/.windsurfrules" "./.windsurfrules"

  echo "[OK] Installed MegaSkills suite to $TARGET_DIR"
fi
