# assistant-core

Natural-language and task-led workflow layer.

Owns:

- commands such as "make the hem longer" or "show unmatched seams"
- assumption summaries
- ambiguity questions
- guided task state
- links between conversational intent and structured parameter changes

This package protects the product differentiator: Pattern Lab should not become another mouse-and-keyboard CAD/3D editor.

Current v0.1 code:

- `src/commands.mjs`: narrow task-led parameter edits. The first supported package command is `lengthen hem 100mm`, which changes garment length and regenerates the pattern package.
