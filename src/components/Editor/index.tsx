import React, { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import MDEditor from "@uiw/react-md-editor";

interface EditorAreaProps {
  isEditing: boolean;
  markdownContent: string;
  handleEditorChange: (newValue?: string | undefined) => void;
}

const EditorArea: React.FC<EditorAreaProps> = ({
  isEditing,
  markdownContent,
  handleEditorChange,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null); // Ref for the editor div

  const handleClickInside = () => {
    // Logic to handle clicks inside the editor can be added here, if any
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      editorRef.current &&
      !editorRef.current.contains(event.target as Node)
    ) {
      // Logic to handle clicks outside the editor can be added here, if any
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={editorRef} onClick={handleClickInside}>
      {
        // Conditional rendering: show editor if in editing mode, otherwise show markdown display
        isEditing ? (
          <MDEditor
            data-color-mode="dark"
            value={markdownContent}
            onChange={handleEditorChange}
          />
        ) : (
          <Markdown>{markdownContent}</Markdown>
        )
      }
    </div>
  );
};

export default EditorArea;
