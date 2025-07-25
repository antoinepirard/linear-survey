import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import { Editor } from "@tiptap/react";
import SlashMenu from "@/components/ui/slash-menu";

interface SlashCommandItem {
  title: string;
  description: string;
  command: (params: {
    editor: Editor;
    range: { from: number; to: number };
  }) => void;
}

interface SuggestionProps {
  editor: Editor;
  range: { from: number; to: number };
  query: string;
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
  clientRect?: () => DOMRect;
}

interface SuggestionKeyProps {
  event: KeyboardEvent;
}

const slashMenuItems: SlashCommandItem[] = [
  {
    title: "Text",
    description: "Just start typing with plain text",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Task List",
    description: "Create a task list with checkboxes",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Capture a code snippet",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().focus().run();

      // Ensure cursor is positioned inside the code block
      setTimeout(() => {
        editor.commands.focus();
      }, 0);
    },
  },
  {
    title: "Divider",
    description: "Visually divide blocks",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
];

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: { from: number; to: number };
          props: SlashCommandItem;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        pluginKey: new PluginKey("slashCommand"),
        items: ({ query }: { query: string }) => {
          return slashMenuItems.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer;
          let popup: HTMLDivElement | null = null;
          let filterIndicator: HTMLDivElement | null = null;

          return {
            onStart: (props: SuggestionProps) => {
              component = new ReactRenderer(SlashMenu, {
                props: {
                  items: props.items,
                  command: props.command,
                },
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              // Create filter indicator
              filterIndicator = document.createElement("div");
              filterIndicator.style.position = "absolute";
              filterIndicator.style.zIndex = "40";
              filterIndicator.style.padding = "2px 6px";
              filterIndicator.style.fontSize = "16px"; // Match editor font size
              filterIndicator.style.color = "#9ca3af"; // text-gray-400
              filterIndicator.style.backgroundColor = "#f8fafc"; // bg-slate-50
              filterIndicator.style.borderRadius = "4px";
              filterIndicator.style.fontFamily =
                "ui-sans-serif, system-ui, -apple-system, sans-serif";
              filterIndicator.style.display = "flex";
              filterIndicator.style.alignItems = "center";

              // Create the content: "/" + "filter" placeholder
              const slashSpan = document.createElement("span");
              slashSpan.style.color = "#000";
              slashSpan.textContent = "/";

              const filterSpan = document.createElement("span");
              filterSpan.style.color = "#9ca3af"; // placeholder color
              filterSpan.textContent = "filter";
              filterSpan.className = "filter-placeholder";

              filterIndicator.appendChild(slashSpan);
              filterIndicator.appendChild(filterSpan);
              document.body.appendChild(filterIndicator);

              // Create popup element
              popup = document.createElement("div");
              popup.style.position = "absolute";
              popup.style.zIndex = "50";
              popup.appendChild(component.element);
              document.body.appendChild(popup);

              // Position elements
              const rect = props.clientRect();
              filterIndicator.style.left = `${rect.left - 8}px`;
              filterIndicator.style.top = `${rect.top - 2}px`;
              popup.style.left = `${rect.left}px`;
              popup.style.top = `${rect.bottom + 8}px`;
            },

            onUpdate(props: SuggestionProps) {
              component?.updateProps({
                items: props.items,
                command: props.command,
              });

              if (!props.clientRect || !popup) {
                return;
              }

              // Update filter indicator content based on query
              if (filterIndicator) {
                const slashSpan = filterIndicator.querySelector(
                  "span:first-child"
                ) as HTMLSpanElement;
                const filterSpan = filterIndicator.querySelector(
                  ".filter-placeholder"
                ) as HTMLSpanElement;

                if (props.query && props.query.length > 0) {
                  // Show "/" + typed text
                  if (slashSpan) slashSpan.textContent = "/";
                  if (filterSpan) {
                    filterSpan.textContent = props.query;
                    filterSpan.style.color = "#000"; // Make typed text black
                  }
                } else {
                  // Show "/" + "filter" placeholder
                  if (slashSpan) slashSpan.textContent = "/";
                  if (filterSpan) {
                    filterSpan.textContent = "filter";
                    filterSpan.style.color = "#9ca3af"; // Keep placeholder gray
                  }
                }
              }

              // Update positions
              const rect = props.clientRect();
              if (filterIndicator) {
                filterIndicator.style.left = `${rect.left - 8}px`;
                filterIndicator.style.top = `${rect.top - 2}px`;
              }
              popup.style.left = `${rect.left}px`;
              popup.style.top = `${rect.bottom + 8}px`;
            },

            onKeyDown(props: SuggestionKeyProps) {
              if (props.event.key === "Escape") {
                if (popup) {
                  document.body.removeChild(popup);
                  popup = null;
                }
                if (filterIndicator) {
                  document.body.removeChild(filterIndicator);
                  filterIndicator = null;
                }
                return true;
              }

              return (
                (
                  component?.ref as {
                    onKeyDown?: (event: KeyboardEvent) => boolean;
                  }
                )?.onKeyDown?.(props.event) || false
              );
            },

            onExit() {
              if (popup) {
                document.body.removeChild(popup);
                popup = null;
              }
              if (filterIndicator) {
                document.body.removeChild(filterIndicator);
                filterIndicator = null;
              }
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});
