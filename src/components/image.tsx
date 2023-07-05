"use client";
import { useState } from "react";
import Image from "next/image";
import sliceAddress from "@/utils/web3/sliceAddress";
import LikeButton, { updateLikes } from "./base/buttons/like";

type ImageDataProps = {
  user: string;
  timestamp: any;
  id: string;
  likes: number;
};
// A single image component
export const ImageComponent = ({ imageUrl }: { imageUrl: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
    </div>
  );
};

export const ImageData = ({
  user,
  timestamp,
  id,
  likes: initialLikes,
}: ImageDataProps) => {
  const [likes, setLikes] = useState(initialLikes);

  const date = timestamp && timestamp.toDate();
  const formattedDate =
    date &&
    `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
      date.getDate()
    ).padStart(2, "0")} at ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

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
      <LikeButton onLike={handleLikesUpdate} likes={likes} />
      <div className="w-full">
        <a href={`https://etherscan.io/address/${user}`}>
          {sliceAddress(user)}
        </a>
        <p className="text-sm">{formattedDate}</p>
      </div>
    </div>
  );
};
