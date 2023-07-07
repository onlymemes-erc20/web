"use client";
import { useRef, useContext, useEffect, useState } from "react";
import { addImage } from "@/utils/firebase/images/addImage";
import Tooltip from "./base/tooltip";
import classNames from "classnames";
import { ToastContext } from "@/app/context/toastContext";
import { AnimatePresence, motion } from "framer-motion";

type ProgressCallback = (progress: number) => void;
type UploadProps = {
  walletAddress: string | undefined;
  isLoggedIn: boolean;
  progressCallback: ProgressCallback;
  progress: number;
};

const spring = {
  type: "spring",
  damping: 5,
  stiffness: 50,
};

export default function Upload({
  walletAddress,
  isLoggedIn,
  progressCallback,
  progress,
}: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { showToast } = useContext(ToastContext);
  const handleImageUpload = async () => {
    if (selectedFile) {
      await addImage({
        walletAddress,
        imageFile: selectedFile,
        progressCallback,
      });
      setSelectedFile(null); // Reset the file input after upload
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
      showToast && showToast("File selected");
    }
  };

  const [toastTriggered, setToastTriggered] = useState(false);

  useEffect(() => {
    if (progress === 100 && showToast && !toastTriggered) {
      showToast("Upload Complete");
      setToastTriggered(true);
    }
  }, [progress, showToast, toastTriggered]);

  return (
    <div className="flex w-full justify-center h-40 items-center">
      <div className="m-12 w-50">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={spring}
            key="fileInput">
            {!selectedFile && (
              <>
                <input
                  className={classNames({
                    "file:bg-blue-400 file:text-white hover:file:bg-blue-300":
                      isLoggedIn,
                    "file:bg-gray-300 file:text-black hover:file:bg-gray-300 cursor-not-allowed":
                      !isLoggedIn,
                    "file:rounded-lg file:rounded-tr-none file:rounded-br-none":
                      true,
                    "file:px-4 file:py-2 file:mr-4 file:border-none": true,
                    "hover:border rounded-lg text-gray-400": isLoggedIn,
                    "cursor-pointer": isLoggedIn,
                    "cursor-not-allowed": !isLoggedIn,
                  })}
                  aria-describedby="file_input_help"
                  ref={fileInputRef}
                  id="file_input"
                  accept="image/*"
                  type="file"
                  disabled={!isLoggedIn}
                  onChange={handleFileSelection}
                />
                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help">
                  SVG, PNG, JPG or GIF
                </p>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={spring}
            key="uploadButton">
            {selectedFile && (
              <Tooltip tooltip={isLoggedIn ? "Upload" : "Login"}>
                <button
                  className={`rounded ${
                    isLoggedIn
                      ? "bg-blue-400 text-white"
                      : "bg-gray-300 text-black cursor-not-allowed"
                  } px-4 py-2 text-sm shadow-sm h-10`}
                  onClick={isLoggedIn ? handleImageUpload : undefined}>
                  Share meme
                </button>
              </Tooltip>
            )}
          </motion.div>
        </AnimatePresence>

        {progress > 0 ? (
          progress < 100 ? (
            <p>Upload is {progress.toFixed(2)}% done</p>
          ) : null
        ) : null}
      </div>
    </div>
  );
}

// ///@todo implement dropzone
// /* <div className="flex items-center justify-center w-full">
//           <label
//             htmlFor="dropzone-file"
//             className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
//             <div className="flex flex-col items-center justify-center pt-5 pb-6">
//               <svg
//                 aria-hidden="true"
//                 className="w-10 h-10 mb-3 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
//               </svg>
//               <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                 <span className="font-semibold">Click to upload</span> or drag and
//                 drop
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 SVG, PNG, JPG or GIF (MAX. 800x400px)
//               </p>
//             </div> */
