// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsKLafyXG8IdpUDbLaWNwZnuZIqvw8eA4",
  authDomain: "memeutil-862ac.firebaseapp.com",
  projectId: "memeutil-862ac",
  storageBucket: "memeutil-862ac.appspot.com",
  messagingSenderId: "631793455976",
  appId: "1:631793455976:web:20b51725bb7595c66f3cdd",
  measurementId: "G-71BW1GZ8D3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

async function addImage(walletAddress, imageFile) {
  // 1. Upload the image to Firebase Storage
  const storageRef = storage.ref();
  const imageRef = storageRef.child(
    `images/${walletAddress}/${imageFile.name}`
  );
  await imageRef.put(imageFile);

  // 2. Get the URL of the uploaded image
  const imageUrl = await imageRef.getDownloadURL();

  // 3. Create a new document in the user's "images" sub-collection
  const imageDoc = {
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    imageUrl,
  };
  const userRef = db.collection("users").doc(walletAddress);
  await userRef.collection("images").add(imageDoc);
}

export default app;
