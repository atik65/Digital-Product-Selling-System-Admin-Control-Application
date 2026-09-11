import { cn } from "@/lib/utils";
import "../../../styles/editor.css";
import JoditEditor from "jodit-react";
import { useEffect, useMemo, useRef, useState } from "react";

const TOOLBAR_VARIANTS = {
  basic: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "ul",
    "ol",
    "link",
    "hr",
    "|",
    "align",
    "undo",
    "redo",
  ],
  content: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "ul",
    "ol",
    "indent",
    "outdent",
    "link",
    "image",
    "table",
    "hr",
    "|",
    "align",
    "undo",
    "redo",
  ],
  full: [
    "source",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "superscript",
    "subscript",
    "paragraph",
    "font",
    "fontsize",
    "lineHeight",
    "brush",
    "ul",
    "ol",
    "indent",
    "outdent",
    "table",
    "image",
    "file",
    "video",
    "link",
    "hr",
    "|",
    "align",
    "undo",
    "redo",
    "selectall",
    "cut",
    "copy",
    "paste",
  ],
};

const REMOVED_BY_VARIANT = {
  basic: ["about", "preview", "print", "fullsize", "dots", "copyformat"],
  content: ["about", "preview", "print", "fullsize", "dots"],
  full: ["about", "preview"],
};

const RichTextEditor = ({
  initialValue,
  getValue,
  form,
  variant = "content", // basic | content | full
  height = 400,
  readOnly = false,
  placeholder = "Write something...",
}) => {
  const { isDirty, isSubmitted } = form.formState;
  const editor = useRef(null);
  const isFirstRender = useRef(true);
  const [content, setContent] = useState(initialValue);

  const config = useMemo(
    () => ({
      readonly: readOnly,
      height,
      toolbar: true,
      language: "en",
      toolbarButtonSize: "small",
      toolbarAdaptive: false,
      buttons: TOOLBAR_VARIANTS[variant] || TOOLBAR_VARIANTS.content,
      removeButtons: REMOVED_BY_VARIANT[variant] || REMOVED_BY_VARIANT.content,
      placeholder,
      uploader: {
        insertImageAsBase64URI: true,
      },
      controls: {
        paste: {
          pasteHTML: false,
          pasteFromWord: false,
        },
      },
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html",
      addNewLine: false,
    }),
    [height, placeholder, readOnly, variant]
  );

  // Keep local state in sync with form value when form isn't dirty
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isSubmitted && !isDirty) {
      setContent(initialValue);
    }
  }, [initialValue, isDirty]);

  return (
    <JoditEditor
      config={config}
      onBlur={(newContent) => setContent(newContent)}
      ref={editor}
      value={content}
      tabIndex={1}
      onChange={(newContent) => getValue(newContent)}
      className="prose  max-w-none"
    />
  );
};

export default RichTextEditor;
