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
    const content = quillRef.current.root.innerHTML; // Get the HTML content
    const printWindow = window.open('', '_blank'); // Open a new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Document</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #fff;
              width: 210mm; /* A4 width */
              height: 297mm; /* A4 height */
              overflow: hidden; /* Hide overflow */
            }
            /* Add any additional print styles here */
          </style>
        </head>
        <body>
          ${content} <!-- Insert the editor content here -->
        </body>
      </html>
    `);
    printWindow.document.close(); // Close the document for writing
    printWindow.print(); // Trigger print
    printWindow.close(); // Close the print window after printing
  };

  const handleSaveDraft = () => {
    const content = quillRef.current.root.innerHTML; // Get the HTML content
    // Add your save draft logic here (e.g., send to server or save locally)
    console.log("Draft saved:", content);
    alert('Draft saved!'); // Placeholder alert for demonstration
  };

  const handleView = () => {
    // Add your view logic here (e.g., navigate to a different view or modal)
    alert('Viewing the document!'); // Placeholder alert for demonstration
  };

  if (!isLoaded) {
    return <div>Loading document...</div>;  // Show loading indicator while document is loading
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>Document Title</h1>
      </header>
      {/* Quill editor container styled to mimic A4 paper */}
      <div 
        id="editor-container" 
        style={{
          width: '210mm', // A4 width in millimeters
          height: '297mm', // A4 height in millimeters
          border: '1px solid #ccc', 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '5px', 
          overflowY: 'auto', // Enable scrolling if content exceeds the page height
          margin: '20px auto 0', // Added top margin for spacing
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
        }} 
      />
      <footer style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={handleView} style={{ margin: '0 10px', padding: '10px 15px', fontSize: '16px' }}>View</button>
        <button onClick={handleSaveDraft} style={{ margin: '0 10px', padding: '10px 15px', fontSize: '16px' }}>Save Draft</button>
        <button onClick={handlePrint} style={{ margin: '0 10px', padding: '10px 15px', fontSize: '16px' }}>Print Document</button>
      </footer>
    </div>
  );
};

export default DocumentView;
