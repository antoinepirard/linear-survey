import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import SlashMenu from '@/components/ui/slash-menu';

const slashMenuItems = [
  {
    title: 'Text',
    description: 'Just start typing with plain text',
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Big section heading',
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering',
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quote',
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: 'Code Block',
    description: 'Capture a code snippet',
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: 'Divider',
    description: 'Visually divide blocks',
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
];

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
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
        pluginKey: new PluginKey('slashCommand'),
        items: ({ query }: { query: string }) => {
          return slashMenuItems.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer;
          let popup: HTMLDivElement | null = null;

          return {
            onStart: (props: any) => {
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

              // Create popup element
              popup = document.createElement('div');
              popup.style.position = 'absolute';
              popup.style.zIndex = '50';
              popup.appendChild(component.element);
              document.body.appendChild(popup);

              // Position popup
              const rect = props.clientRect();
              popup.style.left = `${rect.left}px`;
              popup.style.top = `${rect.bottom + 8}px`;
            },

            onUpdate(props: any) {
              component?.updateProps({
                items: props.items,
                command: props.command,
              });

              if (!props.clientRect || !popup) {
                return;
              }

              // Update position
              const rect = props.clientRect();
              popup.style.left = `${rect.left}px`;
              popup.style.top = `${rect.bottom + 8}px`;
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                if (popup) {
                  document.body.removeChild(popup);
                  popup = null;
                }
                return true;
              }

              return component?.ref?.onKeyDown?.(props.event) || false;
            },

            onExit() {
              if (popup) {
                document.body.removeChild(popup);
                popup = null;
              }
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});