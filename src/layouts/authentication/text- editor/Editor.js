import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import PropTypes from 'prop-types'; // Import PropTypes

Quill.register('modules/imageResize', ImageResize);
const VideoBlot = Quill.import('formats/video');
VideoBlot.className = 'ql-video';
Quill.register(VideoBlot, true);

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

const Editor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      if (quillRef.current) {
        quillRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div')
      );

      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
          imageResize: {},
        },
      });

      quillRef.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(quill.clipboard.convert(defaultValueRef.current));
      }

      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        onTextChangeRef.current?.(html);
      });

      quill.on('selection-change', (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

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

      quill.keyboard.addBinding({ key: 90, ctrlKey: true }, function () {
        quill.history.undo();
      });
      quill.keyboard.addBinding({ key: 89, ctrlKey: true }, function () {
        quill.history.redo();
      });

      return () => {
        ref.current = null;
        container.innerHTML = ''; // Cleanup
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  }
);

Editor.displayName = 'Editor';

// Add PropTypes validation
Editor.propTypes = {
  readOnly: PropTypes.bool,
  defaultValue: PropTypes.string,
  onTextChange: PropTypes.func.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

Editor.defaultProps = {
  readOnly: false,
  defaultValue: '',
};

export default Editor;
