// Editor.tsx
import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from '@liveblocks/react-lexical'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useThreads } from '@liveblocks/react/suspense';
import { $getRoot } from 'lexical';
import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import Loader from '../Loader';
import Comments from '../Comments';
import { DeleteModal } from '../DeleteModal';

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

function EditorContent({ onContentChange }: { onContentChange?: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (onContentChange) {
      const unregister = editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const content = root.getTextContent();
          console.log('Editor content updated:', content); // デバッグ用ログ
          onContentChange(content);
        });
      });

      return () => {
        unregister();
      };
    }
  }, [editor, onContentChange]);

  return null;
}

export function Editor({ roomId, currentUserType, onContentChange }: { roomId: string, currentUserType: UserType, onContentChange?: (content: string) => void }) {
  const status = useEditorStatus();
  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === 'editor',
  });

  useEffect(() => {
    console.log('Editor component mounted'); // デバッグ用ログ
    return () => {
      console.log('Editor component unmounted'); // デバッグ用ログ
    };
  }, []);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-full justify-between">
          <ToolbarPlugin />
          {currentUserType === 'editor' && <DeleteModal roomId={roomId} />}
        </div>

        <div className="editor-wrapper flex flex-col items-center justify-start">
          {status === 'not-loaded' || status === 'loading' ? <Loader /> : (
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType === 'editor' && <FloatingToolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
              <EditorContent onContentChange={onContentChange} />
            </div>
          )}

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]" />
            <FloatingThreads threads={threads} />
            <Comments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}