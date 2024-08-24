"use client";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getTextContent } from 'lexical';

function useExtractText() {
  const [editor] = useLexicalComposerContext();

  const extractText = () => {
    return editor.getEditorState().read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      return textContent;
    });
  };

  return extractText;
}

export { useExtractText };
