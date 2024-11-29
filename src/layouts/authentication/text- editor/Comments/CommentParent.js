import React, { useState } from "react";
import CommentModal from "./CommentDialog";
import CommentDrawer from "./CommentsDrawer";

const ParentComponent = () => {
  const [comments, setComments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [selectedWord, setSelectedWord] = useState(""); 
  const currentUser = "currentUserName"; 

  const addComment = (comment, word, username) => {
    const newComment = {
      id: Date.now(),  // Unique ID for each comment
      username,
      word,
      comment,
    };
    setComments((prevComments) => [...prevComments, newComment]);
    setOpenModal(false);
    setCurrentComment("");  
  };

  const handleSaveComment = (comment, word, username) => {
    addComment(comment, word, username);
  };

  return (
    <div>
     
      <button onClick={() => { setOpenModal(true); setSelectedWord("exampleWord"); }}>
        Add Comment
      </button>

      <CommentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        currentComment={currentComment}
        setCurrentComment={setCurrentComment}
        handleSaveComment={handleSaveComment}
        selectedWord={selectedWord}
        currentUser={currentUser}
      />

      <CommentDrawer
        comments={comments}
        onEditCommentClick={() => {}}
        handleSaveEdit={(id, newCommentText) => {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === id ? { ...comment, comment: newCommentText } : comment
            )
          );
        }}
      />
    </div>
  );
};

export default ParentComponent;
