import React from "react";

const CommentList = ({ comments, deleteComment }) => {
  return (
    <div>
      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{ borderBottom: "1px solid gray", marginBottom: "10px" }}
          >
            <p><strong>{comment.author}</strong> commented on Section {comment.sectionId}</p>
            <p>{comment.text}</p>
            <small>{comment.timestamp}</small>
            <br />
            <button onClick={() => deleteComment(comment.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
