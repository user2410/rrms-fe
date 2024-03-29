"use client";

import dynamic from "next/dynamic";
import { forwardRef, useMemo } from "react";

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

  ['clean']                                         // remove formatting button
];

const Editor = forwardRef<HTMLDivElement, EditorProps>(function Render(props, ref) {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <div className="bg-white" ref={ref}>
      <ReactQuill
        modules={{
          toolbar: props.toolbarOptions || defaultToolbarOptions
        }}
        theme="snow"
        {...props}
      />
    </div>
  );
});

export default Editor;
