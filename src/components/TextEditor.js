import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const TextEditor = () => {
  const [content, setContent] = useState('');
  const quillRef = useRef(null); // Initialize the quillRef
  const [isVisible, setIsVisible] = useState(true); // New state for visibility

  const handleImageUpload = () => {
    // ... (your existing image upload logic)
  };

  const handleSubmit = async () => {
    // ... (your existing logic for submitting data)
    setIsVisible(false); // Hide the component after submission (optional)
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  return (
    <div className="text-editor" style={{ display: isVisible ? 'block' : 'none' }}>  {/* Control visibility using isVisible state */}
      <ReactQuill ref={quillRef} value={content} onChange={setContent} modules={modules} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TextEditor;
