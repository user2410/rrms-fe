"use client";

import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  toolbarOptions?: any[];
};

const defaultToolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['image', 'blockquote'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['table']                                         // remove formatting button
];

export default function ContractEditor(props : EditorProps) {
  const reactQuillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (!reactQuillRef.current || !reactQuillRef.current.editor) {
      return;
    }
    reactQuillRef.current.editor.root.setAttribute("spellcheck", "false");
  }, []);

  return (
    <div className="bg-white">
      <ReactQuill
        ref={reactQuillRef}
        modules={{
          toolbar: props.toolbarOptions || defaultToolbarOptions
        }}
        theme="snow"
        {...props}
      />
    </div>
  );
};
