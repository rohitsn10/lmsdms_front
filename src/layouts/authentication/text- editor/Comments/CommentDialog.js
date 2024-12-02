import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import MDButton from "components/MDButton";
import { useCreateCommentMutation } from "api/auth/commentsApi";

const CommentModal = ({
  open,
  onClose,
  currentComment,
  setCurrentComment,
  documentId,
}) => {
  const [createComment, { isLoading, isSuccess, isError }] = useCreateCommentMutation();

  const handleSaveComment = async () => {
    try {
      const response = await createComment({
        document: documentId,
        comment_description: currentComment,
      }).unwrap();
      console.log("id:",documentId);
      if (response.status === "success") {
        console.log("Comment saved successfully!");
        onClose();
      } else {
        console.error("Failed to save comment:", response.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
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
          <MDButton
            variant="gradient"
            color="submit"
            onClick={handleSaveComment}
            sx={{
              marginBottom: 2,
              backgroundColor: isLoading ? "gray" : "black",
              color: "white",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Comment"}
          </MDButton>
          {isError && (
            <Typography color="error" variant="body2">
              Failed to save comment. Please try again.
            </Typography>
          )}
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
  documentId: PropTypes.string.isRequired,
};

export default CommentModal;
