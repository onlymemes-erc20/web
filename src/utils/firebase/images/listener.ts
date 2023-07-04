// firebaseUtils.js
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  startAfter,
  limit,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/utils/firebase/firebase";
import { FirestoreImageDoc, ImageDoc } from "@/utils/firebase/images/getImages";
import { Dispatch, SetStateAction } from "react";

type ImageListenerProps = {
  lastDoc: DocumentSnapshot<DocumentData> | null;
  setUpdatedImages: Dispatch<SetStateAction<ImageDoc[]>>;
  updatedImages: ImageDoc[];
};

export const subscribeToImages = ({
  lastDoc,
  setUpdatedImages,
  updatedImages,
}: ImageListenerProps) => {
  let latestImages = [...updatedImages];
  let queryRef;

  if (lastDoc) {
    queryRef = query(
      collection(db, "images"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(12)
    );
  } else {
    queryRef = query(
      collection(db, "images"),
      orderBy("createdAt", "desc"),
      limit(12)
    );
  }

  const unsubscribe = onSnapshot(
    queryRef,
    (snapshot) => {
      let changes = false;
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newImage = {
            id: change.doc.id,
            documentSnapshot: change.doc,
            ...(change.doc.data() as FirestoreImageDoc),
          };
          latestImages = [newImage, ...latestImages];
          changes = true;
        } else if (change.type === "modified") {
          const modifiedImage = {
            id: change.doc.id,
            documentSnapshot: change.doc,
            ...(change.doc.data() as FirestoreImageDoc),
          };
          latestImages = latestImages.map((img) =>
            img.id === modifiedImage.id ? modifiedImage : img
          );
          changes = true;
        }
      });
      if (changes) {
        console.log("set new array", latestImages.length);
        setUpdatedImages(latestImages);
      }
    },
    (error) => {
      console.log("Error fetching snapshot: ", error);
    }
  );

  return unsubscribe;
};
