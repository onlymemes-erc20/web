import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

export type FirestoreImageDoc = {
  imageUrl: string;
  user: string;
  timestamp: any;
  likes: number;
};

export type ImageDoc = {
  id: string;
  imageUrl: string;
  user: string;
  timestamp: any;
  likes: number;
  documentSnapshot?: DocumentSnapshot;
};

export async function getLatestImages() {
  const imagesQuery = query(
    collection(db, "images"),
    orderBy("timestamp", "desc"),
    limit(12)
  );

  const imagesSnapshot = await getDocs(imagesQuery);
  const imageBatch: ImageDoc[] = imagesSnapshot.docs.map((doc) => ({
    id: doc.id,
    documentSnapshot: doc,
    ...(doc.data() as FirestoreImageDoc),
  }));

  return imageBatch;
}

export const getLatestImage = async () => {
  const imageRef = collection(db, "images");
  const latestImageQuery = query(
    imageRef,
    orderBy("timestamp", "desc"),
    limit(1)
  );
  const latestImageSnapshot = await getDocs(latestImageQuery);

  if (!latestImageSnapshot.empty) {
    const doc = latestImageSnapshot.docs[0]; // Get the first (and only) document from the query
    return { id: doc.id, ...(doc.data() as FirestoreImageDoc) }; // Spread the document data into a new object, and add the ID
  } else {
    return null;
  }
};

let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
let noImages = false;

export async function getImagesBatch() {
  if (noImages && lastDoc == null) {
    console.log("nomasimages");
    return [];
  }
  let imagesQuery;

  if (lastDoc) {
    imagesQuery = query(
      collection(db, "images"),
      orderBy("timestamp", "desc"),
      startAfter(lastDoc),
      limit(12)
    );
  } else {
    imagesQuery = query(
      collection(db, "images"),
      orderBy("timestamp", "desc"),
      limit(12)
    );
  }

  const imagesSnapshot = await getDocs(imagesQuery);
  const imageBatch: ImageDoc[] = imagesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as FirestoreImageDoc),
  }));
  if (imagesSnapshot.docs.length < 12) {
    noImages = true;
    lastDoc = null;
  } else {
    lastDoc = imagesSnapshot.docs[imagesSnapshot.docs.length - 1];
  }
  return imageBatch;
}

export async function getAllImages() {
  const imagesSnapshot = await getDocs(collection(db, "images"));
  const allImages = imagesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as FirestoreImageDoc),
  }));
  return allImages;
}
