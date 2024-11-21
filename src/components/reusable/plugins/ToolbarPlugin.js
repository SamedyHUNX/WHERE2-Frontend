import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Bold , Italic , Underline , Link } from 'lucide-react';
const ToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();
    
    const formatText = (format) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.formatText(format);
        }
      });
    };
  
    const insertLink = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const url = prompt('Enter URL:');
          if (url) {
            selection.insertNodes([$createLinkNode(url, {
              rel: 'noopener noreferrer',
              target: '_blank',
            })]);
          }
        }
      });
    };
  
    return (
      <div className="toolbar">
        <div className="flex items-center space-x-2 p-2 border-b border-gray-200">
          <button
            onClick={() => formatText('bold')}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText('italic')}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText('underline')}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            onClick={insertLink}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Link className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  export default ToolbarPlugin