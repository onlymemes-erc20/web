"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import Tooltip from "../base/tooltip";
import { AuthContext } from "@/app/context/authContext";
import Toast from "../base/toast";

const Login = () => {
  const {
    walletAddress,
    isLoggedIn,
    shortAddress,
    triggerCheckWallet,
    triggerLogout,
  } = useContext(AuthContext);

  return (
    <div className="flex items-center mx-4 flex-row items-center gap-0">
      {/* {loadingMessage && (
        <p className="text-blue-600 text-sm">{loadingMessage}</p>
      )} */}
      <Tooltip tooltip={walletAddress ? "Disconnect" : "Metamask"}>
        <button
          className="rounded bg-blue-400 px-4 py-2 text-sm text-white shadow-sm"
          onClick={() =>
            walletAddress ? triggerLogout(true) : triggerCheckWallet(true)
          }>
          {isLoggedIn ? "Logout" : walletAddress ? shortAddress : "Connect"}
        </button>
      </Tooltip>
    </div>
  );
};

export default Login;
