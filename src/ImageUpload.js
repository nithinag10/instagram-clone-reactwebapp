import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "./fireBase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ userid }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error Function
        console.log(error);
        alert(error.message);
      },
      () => {
        //complele function ....
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post inside of the database
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              userid: userid,
            });
          });

        setProgress(0);
        setCaption("");
        setImage(null);
      }
    );
  };

  return (
    <div className='image_upload'>
      <progress className='image_progress' value={progress} max='100' />
      <input
        type='text'
        placeholder='Enter a caption'
        value={caption}
        onChange={(event) => {
          setCaption(event.target.value);
        }}
      />
      <input type='file' onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
