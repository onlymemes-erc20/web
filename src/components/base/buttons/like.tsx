import { useState } from "react";
import { Loader } from "../loader";
import { Like } from "../../icons/like";

let size = 20;

import { doc, increment, updateDoc } from "firebase/firestore";

import { db } from "@/utils/firebase/firebase";

export const updateLikes = async (imageId: string) => {
  try {
    const imageRef = doc(db, "images", imageId);
    await updateDoc(imageRef, {
      likes: increment(1),
    });
    return { success: true, error: null };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export default function LikeButton({
  onLike,
  likes,
}: {
  onLike: () => void;
  likes: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onLike();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div onClick={handleClick} className="flex justify-start">
      {isLoading ? (
        <Loader width={size} height={size} />
      ) : (
        <Like width={size} height={size} />
      )}
      {likes > 0 && <span>{likes}</span>}
    </div>
  );
}
