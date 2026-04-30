# SupportFlow Visual Builder

A visual decision tree editor for building and testing customer support chatbot flows.

## Live Demo
[https://supportflow-visual-builder.vercel.app](https://supportflow-visual-builder.vercel.app)

## Overview
SupportFlow Visual Builder allows support teams to design, edit, and test automated chatbot conversation flows through an intuitive drag-and-drop flowchart interface — no spreadsheets required.

## Features

### Visual Flow Editor
- Renders conversation nodes as interactive cards on a canvas
- Nodes are positioned using absolute x/y coordinates from JSON data
- SVG bezier curves connect parent nodes to child nodes visually

### Node Editing
- Click any node to open an Edit Panel
- Edit question text in real-time
- Changes reflect immediately on the canvas

### Preview Mode
- Toggle between Editor and Preview (chat interface)
- Simulates the real customer chatbot experience
- Traverses the decision graph based on user selections
- Shows a Restart button when conversation ends

### Undo/Redo (Wildcard Feature)
- Full undo/redo history for all node edits
- Implemented using two stacks (undoStack and redoStack)
- Prevents accidental loss of work

## Why Undo/Redo?
Support teams frequently update bot scripts. Without undo, a single wrong edit means manually retyping the original text. Undo/Redo makes the editor feel professional and safe to use, directly reducing errors and frustration for non-technical managers.

## Tech Stack
- React (Vite)
- SVG for connection lines
- CSS for styling (no UI libraries)

## Constraints Met
- No react-flow, jsPlumb, or mermaid.js used
- No Bootstrap, Material UI, or Chakra UI used
- Custom SVG bezier curve connection logic built from scratch
- Node positioning uses DOM coordinates and absolute CSS positioning

## Getting Started

### Installation
npm install

### Run Development Server
npm run dev

### Build for Production
npm run build

## Project Structure
src/
├── components/
│   ├── NodeCard.jsx
│   ├── Canvas.jsx
│   ├── Connector.jsx
│   ├── EditPanel.jsx
│   └── ChatPreview.jsx
├── data/
│   └── nodes.json
├── App.jsx
└── main.jsx
