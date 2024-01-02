/**
 * 
 * @param fsize File size in bytes
 * @returns File size in human readable format
 */
export function DisplayFileSize(fsize: number): string {
  return fsize > 1024
    ? fsize > 1048576
      ? Math.round(fsize / 1048576) + "mb"
      : Math.round(fsize / 1024) + "kb"
    : fsize + "b";
}

/**
 * Resize a 2d image
 * 
 * @param imageFile File object
 * @param newWidth new width of the image
 * @param newHeight new height of the image
 * 
 * @returns URL of the resized image
 */
export function ImageResize(
  imageFile: File,
  newWidth: number,
  newHeight: number,
  cb: (url: string) => void,
) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var img = new Image();
    img.onload = function () {
      // Create a canvas element for dynamic resizing
      var canvas = document.createElement("canvas");

      // Actual resizing
      var ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      // var dataurl = canvas.toDataURL(imageFile.type);
      // return canvas.toDataURL();

      // Create new Blob from canvas
      canvas.toBlob((blob) => {
        const file = new File([blob!], imageFile.name, {
          type: imageFile.type,
          lastModified: Date.now(),
        });
        cb(URL.createObjectURL(file));
      });
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(imageFile);
}
