import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ToastProps = {
  message: string;
};

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 200,
};

const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <motion.div
      className="relative m-4 p-4 rounded-lg bg-blue-400 text-white shadow-lg w-48"
      initial={{ opacity: 1, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={spring}>
      {message}
    </motion.div>
  );
};

export default Toast;
