# Trace-by-Hand Whiteboard · 手動跑題白板

A digital whiteboard for tracing algorithm problems by hand — drag in arrays, pointers, stacks, queues, dictionaries, sets, trees, linked lists, graphs and tables, then walk through a LeetCode problem step by step before you write code.

一個「寫 code 之前先手動跑一遍」用的數位白板：把陣列、指標、堆疊、佇列、字典、集合、樹、串列、圖、表格拉到畫布上，一步一步把題目跑一遍。

**Live:** https://draw.prod-stack.com

## Features

- Components: title, text, code, sticky note, array, pointer, stack, queue, dictionary, set, 2D array, variable, tree / list / graph nodes, table
- Drawing tools: pen, eraser, rectangle, circle, line, arrow, connectors
- Multi-select, copy/paste, layers, undo/redo, minimap, zoom
- "My boards": open a board for any LeetCode problem by number or title (3,000+ problems built in)
- Export / import as JSON; everything is saved in your browser (localStorage) — nothing is sent to a server
- 7 languages: 繁體中文, 简体中文, English, 日本語, 한국어, Français, हिन्दी (auto-detected; switch in the top-left, or use `?lang=en`)

## Project structure

```
src/index.html        # page shell: <head>, HTML markup, and the ordered @include list
src/css/*.css         # styles, one file per area
src/js/*.js           # app code, one file per feature (see below)
i18n/                 # UI translations; keys are the Traditional Chinese source strings
data/problems.csv     # LeetCode problem list (id, title, slug, difficulty)
build.py              # builds public/index.html (inlines src/css + src/js, embeds problems + translations)
public/index.html     # built, self-contained page
wrangler.jsonc        # Cloudflare Workers static-assets deploy config
```

`build.py` pastes each part in at its `@include` line, in the order `src/index.html` lists them. The JS parts all run inside one function, so they share variables (`B`, `sel`, `view`, …) — order matters for top-level statements, not for function declarations. A file under `src/css` or `src/js` that isn't `@include`-d makes the build fail.

| File | What's in it |
|---|---|
| `css/base.css` | color tokens (light/dark), base element styles |
| `css/layout.css` | top bar, main area |
| `css/items.css`, `css/item-controls.css` | components on the canvas and their inline ＋/× controls |
| `css/boards.css` | "My boards" dialog |
| `css/selection-toolbar.css` | swatches, marquee, floating toolbar |
| `css/shell.css`, `css/dock.css` | app frame and palette, bottom dock, minimap/zoom, menus |
| `js/i18n.js` | `_T()`, language picking, translating static text |
| `js/state.js`, `js/storage.js` | shared state and helpers; save to localStorage, undo/redo |
| `js/make.js`, `js/render.js` | default content per component type; rendering components |
| `js/edges.js`, `js/layers.js`, `js/tree-list.js` | connectors; layer order; tree/list helpers |
| `js/duplicate.js`, `js/toolbar.js`, `js/handles.js` | duplicate-as-next-step; floating toolbar; shape resize handles |
| `js/actions.js`, `js/cells.js` | toolbar actions (`act`); cell focus, typing `2,7,11` into cells |
| `js/selection.js`, `js/groups.js`, `js/selection-ops.js` | multi-select; groups (⌘G); copy/paste/delete selection, marquee |
| `js/pointer-snap.js` | snapping pointers to cells |
| `js/mouse-down.js`, `js/mouse-move-up.js`, `js/draw-pan-zoom.js` | pointer events (select, drag, drag-to-palette delete); eraser, pen, shapes, pan, zoom |
| `js/editing.js`, `js/palette-drag.js`, `js/keyboard.js` | inline editing; dragging from the palette; shortcuts |
| `js/templates.js`, `js/minimap.js` | templates; minimap |
| `js/boards.js`, `js/menus.js` | "My boards" (per-problem boards); popup menus, color and board menus |
| `js/buttons.js`, `js/settings.js`, `js/help-fit-io.js` | undo/zoom buttons; ⚙ settings (index base, theme, name position); help, fit to screen, export/import |
| `js/init.js` | startup |

## Build & deploy

```bash
python3 build.py          # -> public/index.html
npx wrangler deploy       # deploy to Cloudflare (needs your own account / domain)
```

Opening `public/index.html` directly in a browser also works.

## Adding UI text

Wrap any new user-facing string in `_T('…')` in `src/js/*.js` (or write it in `src/index.html` for static markup), add the same key to `i18n/source_zh-TW.json`, and add translations to each `i18n/<lang>.json`.

---

LeetCode is a trademark of LeetCode LLC. This project is not affiliated with LeetCode; problem titles are only used to link to the original problems.
