import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorContent, useEditor, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Mammoth from "mammoth";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

import { useGetTemplateQuery, useCreateDocumentMutation } from "api/auth/texteditorApi";
import { useCreateCommentMutation } from "api/auth/commentsApi";

const CustomComment = Extension.create({
  name: "comment",
  addOptions() {
    return {
      comments: [],
    };
  },
  addAttributes() {
    return {
      comment: {
        default: null,
        renderHTML: (attributes) => ({
          "data-comment": attributes.comment,
        }),
      },
    };
  },
});

const AntiCopyPattern = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
        background: `
          repeating-linear-gradient(
            45deg,
            rgba(255,0,0,0.05) 0,
            rgba(255,0,0,0.05) 10px,
            transparent 10px,
            transparent 20px
          )
        `,
        opacity: 0.3,
        userSelect: "none",
      }}
    />
  );
};

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [docContent, setDocContent] = useState("");
  const [comments, setComments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);

  const [createDocument] = useCreateDocumentMutation();
  const [createComment] = useCreateCommentMutation();
  const { data, error, isLoading } = useGetTemplateQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    const fetchDocxFile = async () => {
      if (data?.template_url) {
        try {
          const response = await fetch(data.template_url);
          const arrayBuffer = await response.arrayBuffer();
          const result = await Mammoth.convertToHtml({ arrayBuffer });
          setDocContent(result.value);
        } catch (err) {
          console.error("Error converting DOCX to HTML:", err);
        }
      }
    };

    fetchDocxFile();
  }, [data]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
      Link,
      Placeholder.configure({
        placeholder: "Start editing your document...",
      }),
      CustomComment,
    ],
    content: docContent,
  });

  const handleConfirmSave = async () => {
    if (!editor) return;

    const content = editor.getHTML();
    const documentData = { document_id: id, document_data: content };

    await createDocument(documentData);

    const commentsObject = {};
    comments.forEach((comment, index) => {
      const key = comment.selectedText?.trim() || `comment-${index}`;
      commentsObject[key] = comment.comment;
    });

    await createComment({
      document: id,
      comment_description: commentsObject,
    });

    setOpenDialog(false);
  };

  const handleAddComment = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");

    if (selectedText.trim()) {
      setSelectedRange({ from, to });
      setOpenCommentDialog(true);
    } else {
      alert("Please select text to add a comment.");
    }
  };

  const handleSaveComment = () => {
    if (!currentComment.trim()) return;

    const selectedText = editor.state.doc.textBetween(selectedRange.from, selectedRange.to, " ");

    setComments([
      ...comments,
      {
        id: Date.now(),
        selectedText,
        comment: currentComment,
      },
    ]);

    editor.commands.setMark(CustomComment, { comment: currentComment });

    setCurrentComment("");
    setOpenCommentDialog(false);
  };

  const handleSaveAsDocx = async () => {
    if (!editor) return;

    const htmlContent = editor.getHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const plainText = doc.body.innerText.split("\n");

    const docxDocument = new Document({
      sections: [
        {
          children: plainText.map((line) => new Paragraph(line)),
        },
      ],
    });

    Packer.toBlob(docxDocument).then((blob) => {
      saveAs(blob, "document.docx");
    });
  };

  const handlePrint = () => {
    navigate(`/print-document/${id}`);
  };

  if (isLoading) return <Box padding={2}>Loading document...</Box>;
  if (error) return <Box padding={2}>Error loading document</Box>;

  return (
    <Box
      sx={{
        fontFamily: "Arial, sans-serif",
        padding: 2,
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      <AntiCopyPattern />

      <MDButton
        variant="gradient"
        color="submit"
        onClick={handlePrint}
        sx={{ float: "right", mt: 1, mr: 1 }}
      >
        Print
      </MDButton>

      <Box
        sx={{
          width: "210mm",
          height: "297mm",
          margin: "20px auto",
          padding: 2,
          border: "1px solid #ccc",
          backgroundColor: "#fff",
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      <Dialog open={openCommentDialog} onClose={() => setOpenCommentDialog(false)}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <textarea
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            placeholder="Enter your comment"
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCommentDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveComment}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Save Document</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to save this document & all comments?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <MDBox mt={2} display="flex" justifyContent="center" gap={2}>
        <MDButton variant="gradient" color="submit" onClick={() => setOpenDialog(true)}>
          Submit
        </MDButton>
        <MDButton variant="gradient" color="submit">
          Save Draft
        </MDButton>
      </MDBox>
    </Box>
  );
};

export default DocumentView;
