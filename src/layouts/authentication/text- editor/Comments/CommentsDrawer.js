import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, Drawer, List, ListItem, ListItemText, TextField } from "@mui/material";

const CommentDrawer = ({ open, onClose, comments, onEditCommentClick, handleSaveEdit }) => {
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
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, padding: 2, position: "relative", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          All Comments
        </Typography>
        <List>
          {comments.map(({ id, comment }) => (
            <ListItem key={id} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
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
                    <Button onClick={saveEdit} variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                      Save
                    </Button>
                    <Button onClick={() => setEditingId(null)} size="small">
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <ListItemText primary={comment} />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => startEditing(id, comment)}
                    sx={{ mt: 1 }}
                  >
                    Edit
                  </Button>
                </>
              )}
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          onClick={onEditCommentClick}
          sx={{ mt: 2, backgroundColor: "#E53471", color: "white" }}
        >
          Add Comment
        </Button>
      </Box>
    </Drawer>
  );
};

CommentDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  onEditCommentClick: PropTypes.func.isRequired,
  handleSaveEdit: PropTypes.func.isRequired,
};

export default CommentDrawer;
