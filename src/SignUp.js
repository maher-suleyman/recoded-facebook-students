import React from "react";
import db from "./firebase";
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed
} from "@react-firebase/auth";
import logo from './google-signin.png';
import { Button, Form } from 'react-bootstrap';



const SignUpPage = () => {

  // Setting states
  const [city, setCity] = React.useState('');
  const [name, setName] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [profile, setProfile] = React.useState('');

  // Function to save data in firebase DB
  const handleSubmit = (e) => {
    alert(`The data is: ${city} / ${name} / ${userId} / ${imageUrl} / ${profile}`);
    db.ref('profiles/' + userId).set({
      city: city,
      name: name,
      userId: userId,
      imageUrl: imageUrl,
      profile: profile
    });
    e.preventdefault();
  }

  return (
    <FirebaseAuthProvider firebase={firebase} {...db}>
      {/* Checking if the user signed in or not */}
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
              <img style={{cursor: "pointer", marginRight: "20px", marginTop: "20px", border: "1px solid #EFEFEF"}} src={logo} onClick={() => {
                  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                  firebase.auth().signInWithPopup(googleAuthProvider);
                }}
              />
            );
          }
        }}
      </FirebaseAuthConsumer>
      
      {/* To take city and profile as unput from the user to send them to firebase */}
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
      
      
      {/* Result of successfull authentication */}
      <IfFirebaseAuthed>
        {() => {
          return (
            <div>
              <hr style={{marginTop: "30px", marginBottom: "30px"}}/>
              <div>You are authenticated successfully :)</div>
            </div>
          );
        }}
      </IfFirebaseAuthed>
    </FirebaseAuthProvider>
  );
};

export default SignUpPage;
