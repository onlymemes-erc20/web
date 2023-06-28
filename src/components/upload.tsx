import { useRef } from "react";
import { addImage } from "@/utils/addImage";
type UploadProps = {
  walletAddress: string | undefined;
};
export default function Upload({ walletAddress }: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async () => {
    if (fileInputRef.current && fileInputRef.current?.files?.length) {
      const imageFile: File = fileInputRef.current?.files[0];
      await addImage({ walletAddress, imageFile });
    }
  };

  return (
    <div>
      {/* ... other elements ... */}
      <input type="file" ref={fileInputRef} accept="image/*" />
      <button onClick={handleImageUpload}>Upload Image</button>
    </div>
  );
}
