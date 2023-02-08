import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = () => {
  const [image, setImage] = useState("");
  // const [cropData, setCropData] = useState("#");
  // const [cropper, setCropper] = useState<any>();
  const cropImage = useRef<string>("");
  const cropperInstance = useRef<Cropper>();
  const [finalImage, setFinalImage] = useState("");

  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    // if (typeof cropper !== "undefined") {
    //   setCropData(cropper.getCroppedCanvas().toDataURL());
    // }
    if (cropperInstance.current) {
      cropImage.current = cropperInstance.current
        .getCroppedCanvas()
        .toDataURL();
      setFinalImage(cropImage.current);
    }
    console.log("This is the Croped Image", cropImage.current);
  };

  return (
    <>
      <div className="w-[100%] text-center text-[25px]">Image Cropper</div>
      <div className="flex gap-5 space-between w-[full] mb-[5px]">
        <input
          type="file"
          onChange={onChange}
          className="bg-red-200 rounded p-[8px] w-[50%]"
        />
        <button onClick={getCropData} className="bg-red-200 rounded p-[8px]">
          Crop Image
        </button>
      </div>
      <div className="flex gap-5 space-between">
        <Cropper
          className="h-[500px] w-[50%]"
          initialAspectRatio={1}
          src={image}
          background={false}
          responsive={true}
          onInitialized={(instance: any) => {
            // setCropper(instance);
            cropperInstance.current = instance;
          }}
          zoomable={false}
        />
        {finalImage && (
          <img
            src={finalImage}
            alt="croped Image"
            className="h-[400px] w-[30%]"
          />
        )}
      </div>
    </>
  );
};

export default ImageCropper;
