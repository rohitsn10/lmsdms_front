import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, List, ListItem, ListItemText, TextField } from "@mui/material";
import MDButton from "components/MDButton";

const CommentDrawer = ({ comments, onEditCommentClick, handleSaveEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = () => {
    handleSaveEdit(editingId, editText);
    setEditingId(null);
    setEditText("");
  };

  return (
    <Box
      sx={{
        width: 300,
        padding: 2,
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#f5f5f5",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom>
        All Comments
      </Typography>
      <List>
        {comments.map(({ id, username, word, comment }) => (
          <ListItem
            key={id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              borderBottom: "1px solid #ddd",
              paddingBottom: 2,
              marginBottom: 2,
            }}
          >
            {editingId === id ? (
              <>
                <TextField
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ mb: 2 }}
                />
                <Box>
                  <MDButton onClick={saveEdit} variant="gradient" color="submit" size="small" sx={{ mr: 1 }}>
                    Save
                  </MDButton>
                  <MDButton onClick={() => setEditingId(null)} variant="gradient" color="error" size="small">
                    Cancel
                  </MDButton>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold", mb: 1 }}>
                  {username} commented on <span style={{ fontStyle: "italic" }}>{word}</span>
                </Typography>
                <ListItemText primary={comment} sx={{ mb: 1 }} />
                <MDButton
                  variant="gradient"
                  color="submit"
                  size="small"
                  onClick={() => startEditing(id, comment)}
                  sx={{ mt: 1 }}
                >
                  Edit
                </MDButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        disabled
        onClick={onEditCommentClick}
        sx={{
          mt: 2,
          backgroundColor: "#E53471",
          color: "344767",
          width: "100%",
        }}
      >
        All Comment
      </Button>
    </Box>
  );
};

CommentDrawer.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      word: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEditCommentClick: PropTypes.func.isRequired,
  handleSaveEdit: PropTypes.func.isRequired,
};

export default CommentDrawer;
