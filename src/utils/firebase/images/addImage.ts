import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

import app, { db } from "../firebase";

type ProgressCallback = (progress: number) => void;
type AddImageProps = { walletAddress: string | undefined; imageFile: File };

export async function addImage({
  walletAddress,
  imageFile,
  progressCallback,
}: AddImageProps & { progressCallback: ProgressCallback }) {
  const storage = getStorage(app);
  const date = Date.now();
  const storageRef = ref(storage, `images/${date + imageFile.name}`);

  const uploadTask = uploadBytesResumable(storageRef, imageFile);
  const uploadComplete = new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressCallback(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const ref = uploadTask.snapshot.ref;
        const imageUrl = await getDownloadURL(ref);
        const imageDoc = {
          timestamp: serverTimestamp(),
          imageUrl: imageUrl,
          user: walletAddress,
          likes: 0,
        };
        if (walletAddress) {
          const imagesCollection = collection(db, "images");
          const imageDocRef = doc(imagesCollection);
          await setDoc(imageDocRef, imageDoc);
        }
        resolve(uploadTask.snapshot.ref);
      }
    );
  });
  try {
    await uploadComplete;
  } catch (error) {
    console.error("Upload failed", error);
  }
}
