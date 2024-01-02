import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { ApplicationForm } from "./main_form";

export default function ProfileUpload() {
  const form = useFormContext<ApplicationForm>();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const image = form.watch('ao.profileImage');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (image) URL.revokeObjectURL(image.url);
      const { name, size, type } = file;
      console.log('new file', { name, size, type });
      form.setValue('ao.profileImage', {
        name, size, type,
        url: URL.createObjectURL(file),
      });
    }
  };

  return (
    <FormField
      name="ao.profileImage"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <div className="space-y-2">
            <FormLabel className="block text-center">Ảnh chân dung</FormLabel>
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
          </div>
          <FormMessage className="text-center" />
        </FormItem>
      )}
    />
  );
};
