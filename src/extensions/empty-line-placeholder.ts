import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface EmptyLinePlaceholderOptions {
  placeholder: string;
  showOnlyWhenEditable: boolean;
  showOnlyCurrent: boolean;
}

export const EmptyLinePlaceholder = Extension.create<EmptyLinePlaceholderOptions>({
  name: 'emptyLinePlaceholder',

  addOptions() {
    return {
      placeholder: 'Type / for commands',
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('emptyLinePlaceholder'),
        props: {
          decorations: (state) => {
            const { doc, selection } = state;
            const { $from } = selection;
            const decorations: Decoration[] = [];

            // Only show when editor is editable
            if (this.options.showOnlyWhenEditable && !this.editor.isEditable) {
              return DecorationSet.empty;
            }

            // Check if we should show placeholder
            const currentLineStart = $from.start();
            const currentLineEnd = $from.end();
            const currentLineText = doc.textBetween(currentLineStart, currentLineEnd);

            // Show placeholder on empty lines
            if (currentLineText.trim() === '' && selection.empty) {
              const decoration = Decoration.widget(
                $from.pos,
                () => {
                  const placeholder = document.createElement('span');
                  placeholder.classList.add('empty-line-placeholder');
                  placeholder.style.color = '#9ca3af'; // text-gray-400
                  placeholder.style.pointerEvents = 'none';
                  placeholder.style.userSelect = 'none';
                  placeholder.textContent = this.options.placeholder;
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