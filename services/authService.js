import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// Signup function
export async function signup({ email, password, username, fname, lname, address, contact, description, pfp }) {
  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Add user profile to Firestore
  await addDoc(collection(db, "users"), {
    user_id: user.uid,
    username,
    fname,
    lname,
    address,
    contact,        
    description, 
    pfp,          
  });
}

// Login function
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}