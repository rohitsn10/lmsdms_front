import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, Drawer, List, ListItem, ListItemText } from "@mui/material";

const CommentDrawer = ({ open, onClose, comments, onAddCommentClick, onEditCommentClick }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, padding: 2, position: "relative", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          All Comments
        </Typography>
        <List>
          {comments.map(({ id, comment }) => (
            <ListItem key={id} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <ListItemText primary={comment} />
              <Button
                variant="outlined"
                size="small"
                onClick={() => onEditCommentClick(id, comment)}
                sx={{ mt: 1 }}
              >
                Edit
              </Button>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          onClick={onAddCommentClick}
          sx={{ mt: 2 }}
          style={{ backgroundColor: "#E53471", color: "white" }}
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
  onAddCommentClick: PropTypes.func.isRequired,
  onEditCommentClick: PropTypes.func.isRequired,
};

export default CommentDrawer;
