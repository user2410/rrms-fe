import { Fragment, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";

type FileUpload = {
  name: string;
  size: number;
  type: string;
  url: string;
};

export default function ProfileUpload() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<FileUpload | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (image) URL.revokeObjectURL(image.url);
      const { name, size, type } = file;
      console.log('new file', { name, size, type });
      setImage({
        name, size, type,
        url: URL.createObjectURL(file),
      });
    }
  };

  return (
    <Fragment>
      <input ref={inputFileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
      <button
        type="button"
        className={
          image
            ? "w-56 aspect-[3/4] relative"
            : "rounded-full bg-slate-100 w-56 h-56 flex flex-row justify-center items-center"
        }
        onClick={() => { inputFileRef.current?.click(); }}
      >
        {image ? (
          <img
            className="absolute inset-0 object-cover w-full h-full hover:opacity-25"
            src={image.url}
            alt="profile"
          />
        ) : (
          <FaCamera size={48} color="black" />
        )}
      </button>
    </Fragment>
  );
};
