import {
  getFirestore,
  collection,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./firebase";

const db = getFirestore(app);

type AddImageProps = { walletAddress: string | undefined; imageFile: File };
export async function addImage({ walletAddress, imageFile }: AddImageProps) {
  const storage = getStorage(app);
  const storageRef = ref(storage, `images/${walletAddress}/${imageFile.name}`);

  uploadBytes(storageRef, imageFile).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });
  const imageUrl = await getDownloadURL(storageRef);
  const imageDoc = {
    timestamp: serverTimestamp(),
    imageUrl,
  };

  if (walletAddress) {
    const userImagesCollection = collection(
      db,
      "users",
      walletAddress,
      "images"
    );
    await addDoc(userImagesCollection, imageDoc);
  }
}
