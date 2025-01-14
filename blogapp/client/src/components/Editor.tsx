import { useEffect, useRef } from "react";
import { useEditorContext } from "../context/EditorContext";

const EditorPage = () => {
  const { initializeEditor } = useEditorContext();
  const editorRef = useRef<boolean>(false);

  useEffect(() => {
    if (!editorRef.current) {
      initializeEditor();
      editorRef.current = true;
    }
  }, [initializeEditor]);

  return <div id="editorjs" className="hidden lg:block mx-auto w-full"></div>;
};

export default EditorPage;
