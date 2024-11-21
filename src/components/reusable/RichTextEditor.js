import React, { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $getRoot } from 'lexical';
import { $createLinkNode } from '@lexical/link';
import { Bold, Italic, Underline, Link } from 'lucide-react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

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
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('italic')}
          className="p-2 rounded hover:bg-gray-100"
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('underline')}
          className="p-2 rounded hover:bg-gray-100"
          type="button"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          onClick={insertLink}
          className="p-2 rounded hover:bg-gray-100"
          type="button"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const LexicalEditor = ({ onChange, initialValue = "" }) => {
  const initialConfig = {
    namespace: 'MyEditor',
    onError(error) {
      console.error(error);
    },
    editorState: initialValue,
    theme: {
      root: 'p-4 border border-gray-300 rounded-lg min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500',
      link: 'cursor-pointer text-blue-500 hover:text-blue-600 underline',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
      },
    },
  };

  const handleEditorChange = (editorState, editor) => {
    editor.update(() => {
      const rawText = $getRoot().getTextContent();
      if (onChange) {
        onChange(rawText);
      }
    });
  };

  return (
    <div className="lexical-editor">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input" />
              }
              placeholder={
                <div className="editor-placeholder text-gray-400">
                  Enter your text here...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleEditorChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;