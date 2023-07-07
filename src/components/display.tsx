"use client";
import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { motion } from "framer-motion";

import { ImageDoc, getLatestImages } from "@/utils/firebase/images/getImages";
import { subscribeToImages } from "@/utils/firebase/images/listener";
import { ImageComponent, ImageData } from "./image";
import { filter } from "lodash";
import { AuthContext } from "@/app/context/authContext";

import { ToastContext } from "@/app/context/toastContext";

type DisplayProps = {
  isLoggedIn: boolean;
  walletAddress: string | undefined;
};

export default function Display({ isLoggedIn }: DisplayProps) {
  const [realData, setRealData] = useState<ImageDoc[]>([]);
  const [displayData, setDisplayData] = useState<ImageDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLimit, setImageLimit] = useState(12);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const loader = useRef(null);

  const { walletAddress } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    getLatestImages()
      .then((images) => {
        setRealData(images);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    const unsubscribe = subscribeToImages({
      setUpdatedImages: setRealData,
      imageLimit,
    });
    return () => unsubscribe();
  }, [isLoggedIn, imageLimit]);

  useEffect(() => {
    const updateDisplayData = async () => {
      // setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDisplayData(realData);
      // setIsLoading(false);
    };

    updateDisplayData();
  }, [realData]);

  const handleObserver = useCallback(
    (entities: any[]) => {
      const target = entities[0];
      if (target.isIntersecting) {
        if (realData.length >= imageLimit) {
          setImageLimit((prevImageLimit) => prevImageLimit + 12);
        }
      }
    },
    [displayData]
  );

  useEffect(() => {
    const options = {};
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, [handleObserver]);

  const filterImagesByAddress = () => {
    setDisplayData((prevData) => {
      if (isFilterActive) {
        // If the filter is active, show only images owned by the current wallet address
        return prevData.filter((image) => image.user != walletAddress);
      } else {
        // If the filter is not active, show all images
        return realData;
      }
    });
  };

  useEffect(() => {
    filterImagesByAddress();
  }, [isFilterActive]);

  return (
    <div>
      <div>
        <button onClick={() => setIsFilterActive((prevState) => !prevState)}>
          Toggle Filter
        </button>
      </div>
      <motion.div
        className="grid grid-cols-4 gap-2 w-100 "
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.4 }}>
        {displayData.map((image, index) => (
          <div className="flex" key={image.id}>
            <ImageComponent imageUrl={image.imageUrl} />
            <ImageData
              id={image.id}
              user={image.user}
              timestamp={image.timestamp}
              likes={image.likes}
            />
          </div>
        ))}
      </motion.div>
      <div className="" ref={loader}></div>
    </div>
  );
}

//@todo profile page, features your uploads
//@todo tag images -> (suggest a tag?)
//@todo sort by tags
//@todo brainstorm some community participation incentives with lyle
