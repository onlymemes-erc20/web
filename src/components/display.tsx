"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  ImageDoc,
  getImagesBatch,
  getLatestImages,
} from "@/utils/firebase/images/getImages";
import Image from "next/image";
import sliceAddress from "@/utils/web3/sliceAddress";
import { motion } from "framer-motion";
import LikeButton, { updateLikes } from "./base/buttons/like";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { subscribeToImages } from "@/utils/firebase/images/listener";

type DisplayProps = {
  isLoggedIn: boolean;
  walletAddress: string | undefined;
};
// A single image component
const ImageComponent = ({
  imageUrl,
  user,
  timestamp,
  id,
  likes: initialLikes,
}: ImageDoc) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [likes, setLikes] = useState(initialLikes);

  const handleLikesUpdate = async () => {
    const result = await updateLikes(id);
    if (result.success) {
      setLikes((prevLikes) => prevLikes + 1);
    } else {
      // handle the error (e.g., show an error message to the user)
      console.error("Failed to update likes: ", result.error);
    }
  };

  return (
    <div>
      {hasError && <div>Error occurred</div>}
      <Image
        className="..."
        src={imageUrl}
        alt="User Uploaded"
        width={400}
        height={300}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
      <LikeButton onLike={handleLikesUpdate} likes={likes} />
      <div className="flex w-full">
        <a href={`https://etherscan.io/address/${user}`}>
          {sliceAddress(user)}
        </a>
        <p className="text-sm">{timestamp.toDate().getDate()}</p>
      </div>
    </div>
  );
};

export default function Display({ isLoggedIn }: DisplayProps) {
  const [initialImages, setInitialImages] = useState<ImageDoc[]>([]);
  const [updatedImages, setUpdatedImages] = useState<ImageDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot<DocumentData> | null>(
    null
  );

  const loader = useRef(null);
  // we can listen to all loaded images with snapshot. snapshot returns an array of documents that changed.
  // this means that we can pass a list of all the refs that we want to monitor (which is all images that we loaded)
  // so we will still initially load the batch of images.
  const getImages = useCallback(async () => {
    try {
      const newImages = await getLatestImages();
      setInitialImages((prevImages) => [...prevImages, ...newImages]);
    } catch (error) {
      console.log(error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setIsLoading(true);
    getImages();
    setIsLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    const unsubscribe = subscribeToImages({
      lastDoc,
      setUpdatedImages,
      updatedImages,
    });
    console.log("image fetch triggered");
    return () => unsubscribe();
  }, [isLoggedIn, lastDoc, updatedImages]);

  const handleObserver = useCallback(
    (entities: any[]) => {
      const target = entities[0];
      if (target.isIntersecting) {
        const lastImage = updatedImages[updatedImages.length - 1];
        setLastDoc(lastImage.documentSnapshot || null); // assuming documentRef is the QueryDocumentSnapshot<DocumentData> reference
      }
    },
    [updatedImages]
  );

  useEffect(() => {
    const options = {};
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, [handleObserver]);

  const allImages = [...initialImages, ...updatedImages];

  return (
    <div>
      <motion.div
        className="grid grid-cols-4 gap-2 w-100 "
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}>
        {allImages.map((image, index) => (
          <ImageComponent
            key={image.id + index}
            id={image.id}
            likes={image.likes}
            imageUrl={image.imageUrl}
            user={image.user}
            timestamp={image.timestamp}
          />
        ))}
      </motion.div>
      <div className="" ref={loader}></div>
    </div>
  );
}
