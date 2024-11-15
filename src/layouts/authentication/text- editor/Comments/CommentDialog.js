import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, TextField, Typography, Dialog, DialogContent, List, ListItem, ListItemText } from "@mui/material";

const CommentModal = ({
  open,
  onClose,
  currentComment,
  setCurrentComment,
  handleSaveComment,
  comments,
  handleEditComment,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = () => {
    handleEditComment(editingId, editText);
    setEditingId(null);
    setEditText("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box sx={{ padding: 2, position: "relative", height: "100%" }}>
          <Typography variant="h6">Add Comment</Typography>
          <TextField
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            rows={4}
            multiline
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleSaveComment}
            sx={{ marginBottom: 2 }}
            style={{ backgroundColor: "#E53471", color: "white" }}
          >
            Save Comment
          </Button>

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
                    />
                    <Box>
                      <Button onClick={saveEdit} variant="contained" color="primary" size="small">
                        Save
                      </Button>
                      <Button onClick={() => setEditingId(null)} size="small" sx={{ ml: 1 }}>
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

CommentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentComment: PropTypes.string.isRequired,
  setCurrentComment: PropTypes.func.isRequired,
  handleSaveComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  handleEditComment: PropTypes.func.isRequired,
};

export default CommentModal;
