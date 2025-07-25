import { ListItem } from '@tiptap/extension-list-item';

export const CustomListItem = ListItem.extend({
  name: 'customListItem',
  
  content: 'text*',
  
  parseHTML() {
    return [
      {
        tag: 'li',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['li', HTMLAttributes, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { editor } = this;
        const { state } = editor;
        const { selection } = state;
        
        // Check if we're in a list item
        const $pos = selection.$from;
        const listItemPos = $pos.depth > 0 ? state.doc.resolve($pos.before($pos.depth)) : null;
        
        if (listItemPos && listItemPos.parent.type.name === 'customListItem') {
          // If the current list item is empty, exit the list
          const currentNode = $pos.parent;
          if (currentNode.textContent.trim() === '') {
            return editor.chain().liftListItem('customListItem').run();
          }
          // Otherwise, create a new list item
          return editor.chain().splitListItem('customListItem').run();
        }
        
        return false;
      },
      
      'Mod-Shift-8': () => this.editor.chain().focus().toggleList('bulletList', 'customListItem').run(),
      'Mod-Shift-9': () => this.editor.chain().focus().toggleList('orderedList', 'customListItem').run(),
    };
  },
});