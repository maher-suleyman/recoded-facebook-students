import React from "react";
import db from "./firebase";
import firebase from "firebase/app";
import "firebase/auth";
import logo from "./google-signin.png";
import { Button, Form } from "react-bootstrap";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
} from "@react-firebase/auth";

const SignUpPage = () => {
  // Setting states
  const [city, setCity] = React.useState("");
  const [name, setName] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [profile, setProfile] = React.useState("");

  // This state will be used for the 1st way
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  // a feature that I wanted to add in case if we want to block an annoying account
  const [blockedList, setBlockedList] = React.useState([]);

  // Function to save data in firebase DB
  const handleSubmit = (e) => {
    // alert(`The data is: ${city} / ${name} / ${userId} / ${imageUrl} / ${profile}`);
    db.collection("profiles").doc(userId).set({
      city: city,
      name: name,
      userId: userId,
      imageUrl: imageUrl,
      profile: profile,
    });
    e.preventDefault();
  };

  // Checking if there is an authenticated account previously
  const authChecker = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setName(user.displayName);
        setImageUrl(user.photoURL);
        setUserId(user.uid);
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  };
  authChecker();

  return (
    <div>
      {/* 1st way WithOut using "@react-firebase/auth" */}
      {/* Checking if the user signed in or not to create appropriate button */}
      <div>
        {(() => {
          if (isSignedIn) {
            return (
              <button
                style={{ width: "191px", marginTop: "20px" }}
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  firebase.auth().signOut();
                  authChecker();
                }}
              >
                Sign Out
              </button>
            );
          } else {
            return (
              <img
                style={{
                  cursor: "pointer",
                  marginRight: "20px",
                  marginTop: "20px",
                  border: "1px solid #EFEFEF",
                }}
                src={logo}
                onClick={() => {
                  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                  googleAuthProvider.addScope("profile");
                  googleAuthProvider.addScope("email");
                  firebase
                    .auth()
                    .signInWithPopup(googleAuthProvider)
                    .then(function (result) {
                      // This gives you a Google Access Token.
                      // let token = result.credential.accessToken;
                      // The signed-in user info.
                      let user = result.user;
                      console.log("user:");
                      console.log(user);

                      setName(user.displayName);
                      setImageUrl(user.photoURL);
                      setUserId(user.uid);
                      authChecker();
                    });
                }}
              />
            );
          }
        })()}
      </div>

      {/* Taking "city" and "profile" values from the user to send them to firebase DB */}
      <Form>
        <Form.Group controlId="aboutYou">
          <br />
          <Form.Label>About you:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Write some thing about your self!"
            onInput={(e) => {
              setProfile(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>City:</Form.Label>
          <Form.Control
            type="text"
            placeholder="You live in..!"
            onInput={(e) => {
              setCity(e.target.value);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>

      {/* Result of successfull authentication */}
      <div>
        {(() => {
          if (isSignedIn) {
            return (
              <>
                <hr style={{ marginTop: "30px", marginBottom: "30px" }} />
                <div>You signed in successfully :)</div>
              </>
            );
          }
        })()}
      </div>

      {/* 2nd way by using "@react-firebase/auth" */}
      {/* <FirebaseAuthProvider firebase={firebase} {...db}>
        <FirebaseAuthConsumer>
          {({ isSignedIn, user, providerId }) => {
            if(isSignedIn){
              setName(user.displayName);
              setImageUrl(user.photoURL);
              setUserId(user.uid);
              return (
                <button style={{width: "191px", marginTop: "20px"}} type="button" class="btn btn-danger" onClick={() => {
                    firebase.auth().signOut();
                  }}
                >Sign Out</button>
              )
            } else {
              return (
                <img alt="" style={{cursor: "pointer", marginRight: "20px", marginTop: "20px", border: "1px solid #EFEFEF"}} src={logo} onClick={() => {
                    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                    firebase.auth().signInWithPopup(googleAuthProvider);
                  }}
                />
              );
            }
          }}
        </FirebaseAuthConsumer>
        
        <Form>
          <Form.Group controlId="aboutYou"><br/>
            <Form.Label>About you:</Form.Label>
            <Form.Control type="text" placeholder="Write some thing about your self!" 
              onInput={(e) => {
                setProfile(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="city">
            <Form.Label>City:</Form.Label>
            <Form.Control type="text" placeholder="You live in..!" 
              onInput={(e) => {
                setCity(e.target.value);
              }}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
        
        <IfFirebaseAuthed>
          {() => {
            return (
              <div>
                <hr style={{marginTop: "30px", marginBottom: "30px"}}/>
                <div>You signed in successfully :)</div>
              </div>
            );
          }}
        </IfFirebaseAuthed>
      </FirebaseAuthProvider> */}
    </div>
  );
};

export default SignUpPage;
