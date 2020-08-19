import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./fireBase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const App = () => {
  const [posts, setposts] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [openSignin, setopenSignIn] = useState(false);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((err) => {
      alert(err.message);
    });
    setopenSignIn(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //User has logged in..

        setUser(authUser);
      } else {
        // User has logged out
        setUser(null);
      }
    });

    return () => {
      //perform clean up operation
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setposts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);
  return (
    <div className='App'>
      <div className='App_header'>
        <img src={logo} alt='logo' className='App_header_image' />
        <div className='App-header_button'>
          <Button onClick={() => setopenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img src={logo} alt='logo' className='App_header_image' />
          </center>
          <form className='App_signup' type='submit'>
            <Input
              placeholder='UserName'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder='E-mail'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      {/* //Modal to SignIn */}
      <Modal
        open={openSignin}
        onClose={() => setopenSignIn(false)}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img src={logo} alt='logo' className='App_header_image' />
          </center>
          <form className='App_signup' type='submit'>
            <Input
              placeholder='E-mail'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      {/* //Feeds  */}
      <div className='App_posts'>
        <div className='App_postLeft'>
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              user={user}
              postId={id}
              caption={post.caption}
              imageUrl={post.imageUrl}
              userid={post.userid}
            />
          ))}
        </div>
        <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
        />
      </div>

      {user ? (
        <ImageUpload userid={user.displayName} />
      ) : (
        <h3>You need to log in to upload</h3>
      )}

      {user ? (
        <Button onClick={() => auth.signOut()}>Log Out</Button>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default App;
