import React, { useState } from "react";

const CommentSection = ({ comments, deleteComment, editComment }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditedText(text);
  };

  const saveEdit = (id) => {
    editComment(id, editedText);
    setEditingId(null);
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <strong>Comment on:</strong> <em>{comment.selection}</em>
            {editingId === comment.id ? (
              <>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => saveEdit(comment.id)}>Save</button>
              </>
            ) : (
              <p>{comment.comment}</p>
            )}
            <button onClick={() => startEditing(comment.id, comment.comment)}>
              Edit
            </button>
            <button onClick={() => deleteComment(comment.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
