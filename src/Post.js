import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./fireBase";
import firebase from "firebase";

function Post({ user, postId, caption, imageUrl, userid }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          // console.log(snapshot.docs[0].data());
          setComments(
            snapshot.docs.map((doc) => ({ id: doc.id, Comment: doc.data() }))
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      userid: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className='post'>
      <div className='post_header'>
        <Avatar
          className='post_avatar'
          alt=''
          src='http://www.nretnil.com/avatar/LawrenceEzekielAmos.png'
        />
        <h4>{userid}</h4>
      </div>
      <img className='post_image' src={imageUrl} alt='' />

      <h4 className='post_text'>
        <strong>{userid}</strong> {caption}
      </h4>
      <div className='post_comments'>
        {comments.map(({ id, Comment }) => (
          <p key={id}>
            <strong>{Comment.userid}</strong> {Comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className='comment_box'>
          <input
            className='post_input'
            type='text'
            placeholder='Add a comment..'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className='post_button'
            disabled={!comment}
            type='submit'
            onClick={postComment}>
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
