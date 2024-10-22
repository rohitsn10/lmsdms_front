import React, { useEffect, useState, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import Mammoth from 'mammoth';

// Register the ImageResize module
Quill.register('modules/imageResize', ImageResize);

// Toolbar options for the editor
const toolbarOptions = [
  [{ 'font': [] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'size': ['small', 'normal', 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['link', 'image', 'video', 'blockquote', 'hr', 'formula'],
  ['clean'],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  ['code-block'],
  ['emoji'],
];

const DocumentView = () => {
  const [docContent, setDocContent] = useState('');  // State to hold document content
  const [isLoaded, setIsLoaded] = useState(false);  // State to check if document is loaded
  const quillRef = useRef(null);  // Reference for the Quill editor

  // Load the document when the component mounts
  useEffect(() => {
    fetch('/SOP template.docx')  // Fetch the .docx file from the public folder
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const result = await Mammoth.convertToHtml({ arrayBuffer });
          setDocContent(result.value);  // Set the HTML content converted from .docx
          setIsLoaded(true);  // Set document as loaded
        };
        reader.readAsArrayBuffer(blob);
      });
  }, []);

  useEffect(() => {
    if (isLoaded && !quillRef.current) {
      // Initialize Quill editor once the document is loaded
      const quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
          imageResize: {},  // Enable image resizing
        },
      });

      quillRef.current = quill;  // Set Quill editor instance
      quill.clipboard.dangerouslyPasteHTML(docContent);  // Load the document content into the editor

      const videoButton = document.querySelector('.ql-video');
      if (videoButton) {
        videoButton.addEventListener('click', () => {
          const videoUrl = prompt('Enter video URL');
          if (videoUrl) {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'video', videoUrl);
          }
        });
      }
    }
  }, [isLoaded, docContent]);

  const handlePrint = () => {
    window.print();  // Trigger browser's print functionality
  };

  if (!isLoaded) {
    return <div>Loading document...</div>;  // Show loading indicator while document is loading
  }

  return (
    <div>
      <h2>Edit Document</h2>
      {/* Quill editor container */}
      <div id="editor-container" style={{ border: '1px solid black', padding: '10px', minHeight: '500px' }} />
      <button onClick={handlePrint} style={{ marginTop: '20px' }}>Print Document</button>
    </div>
  );
};

export default DocumentView;
