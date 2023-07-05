// firebaseUtils.js
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/utils/firebase/firebase";
import { ImageDoc } from "@/utils/firebase/images/getImages";
import { Dispatch, SetStateAction } from "react";

type ImageListenerProps = {
  setUpdatedImages: Dispatch<SetStateAction<ImageDoc[]>>;
  imageLimit: number;
};
export const subscribeToImages = ({
  setUpdatedImages,
  imageLimit,
}: ImageListenerProps) => {
  let queryRef = query(
    collection(db, "images"),
    orderBy("timestamp", "desc"),
    limit(imageLimit)
  );

  const unsubscribe = onSnapshot(
    queryRef,
    (snapshot) => {
      setUpdatedImages((prevImages) => {
        let newImages = [...prevImages];
        const existingIds = new Set(newImages.map((img) => img.id));

        snapshot.docChanges().forEach((change) => {
          const data = { id: change.doc.id, ...change.doc.data() } as ImageDoc;

          if (change.type === "added" && !existingIds.has(data.id)) {
            newImages.push(data);
          } else if (change.type === "modified") {
            newImages = newImages.map((img) =>
              img.id === data.id ? data : img
            );
          }
        });

        newImages.sort((a, b) => b.timestamp - a.timestamp);

        return newImages;
      });
    },
    (error) => {
      console.log("Error fetching snapshot: ", error);
    }
  );

  return unsubscribe;
};
