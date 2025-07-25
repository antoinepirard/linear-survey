import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export interface EmptyLinePlaceholderOptions {
  placeholder: string;
  showOnlyWhenEditable: boolean;
  showOnlyCurrent: boolean;
}

export const EmptyLinePlaceholder =
  Extension.create<EmptyLinePlaceholderOptions>({
    name: "emptyLinePlaceholder",

    addOptions() {
      return {
        placeholder: "Type / for commands",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      };
    },

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("emptyLinePlaceholder"),
          props: {
            decorations: (state) => {
              const { doc, selection } = state;
              const { $from } = selection;
              const decorations: Decoration[] = [];

              // Only show when editor is editable
              if (
                this.options.showOnlyWhenEditable &&
                !this.editor.isEditable
              ) {
                return DecorationSet.empty;
              }

              // Don't show empty line placeholder if the entire editor is empty
              // (to avoid overlapping with the main editor placeholder)
              if (this.editor.isEmpty) {
                return DecorationSet.empty;
              }

              // Check if we should show placeholder
              const currentLineStart = $from.start();
              const currentLineEnd = $from.end();
              const currentLineText = doc.textBetween(
                currentLineStart,
                currentLineEnd
              );
              const currentNode = $from.parent;

              // Skip code blocks entirely to avoid typing interference
              if (currentNode.type.name === "codeBlock") {
                return DecorationSet.empty;
              }

              // Show placeholder on empty lines
              if (currentLineText.trim() === "" && selection.empty) {
                // Get contextual placeholder text based on current node type
                const getContextualPlaceholder = () => {
                  if (currentNode.type.name === "heading") {
                    const level = currentNode.attrs.level;
                    return `Heading ${level}`;
                  } else if (currentNode.type.name === "blockquote") {
                    return "Quote";
                  } else if (currentNode.type.name === "listItem") {
                    return "List item";
                  } else if (currentNode.type.name === "taskItem") {
                    return "Task";
                  } else {
                    // Default for paragraph and other node types
                    return this.options.placeholder;
                  }
                };

                const decoration = Decoration.widget(
                  $from.pos,
                  () => {
                    const placeholder = document.createElement("span");
                    placeholder.classList.add("empty-line-placeholder");
                    placeholder.style.color = "#9ca3af"; // text-gray-400
                    placeholder.style.pointerEvents = "none";
                    placeholder.style.userSelect = "none";
                    placeholder.textContent = getContextualPlaceholder();
                    return placeholder;
                  },
                  {
                    side: 1,
                  }
                );
                decorations.push(decoration);
              }

              return DecorationSet.create(doc, decorations);
            },
          },
        }),
      ];
    },
  });
