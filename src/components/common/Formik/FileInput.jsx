/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import formOpt from "@/lib/formOpt";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";
import { Ellipsis } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CircleStencil,
  Cropper,
  RectangleStencil,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { toast } from "sonner";

const imageOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

const videoOptions = {
  maxSizeMB: 50, // Adjust based on your needs
  maxDurationSeconds: 300, // 5 minutes
};

export const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/avif",
];
export const videoTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/avi",
  "video/mov",
  "video/mkv",
  "video/flv",
  "video/3gp",
];

const getFileExtension = (url) =>
  url && url?.split?.(".").pop().split("?")[0].toLowerCase();

export const mediaType = ({ url, imageCheck, videoCheck }) => {
  const ext = getFileExtension(url);
  if (imageCheck && imageTypes.includes(`image/${ext}`)) return true;
  if (videoCheck && videoTypes.includes(`video/${ext}`)) return true;
  return false;
};

const FileInput = ({
  name = "file",
  form,
  label,
  trackID,
  cropType = "square", // square, circle
  cropperProps = {},
  data,
  acceptedTypes = "image", // 'image', 'video', 'both'
}) => {
  const [loading, setLoading] = useState(false);
  const [blob, setBlob] = useState(null);
  const isDragging = useRef(null);
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  const isValidFileType = (file) => {
    if (acceptedTypes === "image") return imageTypes.includes(file.type);
    if (acceptedTypes === "video") return videoTypes.includes(file.type);
    if (acceptedTypes === "both")
      return [...imageTypes, ...videoTypes].includes(file.type);

    return false;
  };

  const handleVideoValidation = async (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > videoOptions.maxDurationSeconds) {
          reject(
            new Error(
              `Video must be shorter than ${
                videoOptions.maxDurationSeconds / 60
              } minutes`
            )
          );
        }
        if (file.size > videoOptions.maxSizeMB * 1024 * 1024) {
          reject(
            new Error(`Video must be smaller than ${videoOptions.maxSizeMB}MB`)
          );
        }
        resolve(file);
      };

      video.onerror = () => reject(new Error("Invalid video file"));
      video.src = URL.createObjectURL(file);
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDragging.current) {
      isDragging.current.style.background = "#151515";
    }
  };

  const handleChange = async ({ file = null, onChange, isDrag = false }) => {
    if (!file || !isValidFileType(file)) {
      toast.error("Invalid file type");
      return;
    }

    setLoading(true);
    try {
      let processedFile;
      const isImage = file.type.startsWith("image/");
      const originalName = file.name;
      const fileExtension = originalName.split(".").pop();

      if (isImage) {
        const compressed = await imageCompression(file, imageOptions);
        // Convert blob to File with original name
        processedFile = new File([compressed], originalName, {
          type: compressed.type,
        });
      } else {
        processedFile = await handleVideoValidation(file);
      }

      const blobUrl = URL.createObjectURL(processedFile);
      setBlob(blobUrl);

      isDrag ? onChange(name, processedFile, formOpt) : onChange(processedFile);
    } catch (error) {
      isDrag ? onChange(name, null, formOpt) : onChange(null);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current.style.background = "transparent";
    handleChange({
      file: e.dataTransfer.files[0],
      onChange: form.setValue,
      isDrag: true,
    });
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDragging.current) {
      isDragging.current.style.background = "transparent";
    }
  };

  useEffect(() => {
    const handleWindowDragOver = (event) => {
      event.preventDefault();
    };
    const handleWindowDrop = (event) => {
      event.preventDefault();
    };
    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);
    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (blob) {
        URL.revokeObjectURL(blob);
      }
    };
  }, [blob]);

  const fileValue = form.getValues()?.[name];

  const getAcceptString = () => {
    if (acceptedTypes === "image") return imageTypes;
    if (acceptedTypes === "video") return videoTypes;
    return `${imageTypes}, ${videoTypes}`;
  };

  const fileType =
    fileValue instanceof Blob || fileValue instanceof File
      ? fileValue.type.startsWith("image/")
        ? "image"
        : "video"
      : null;

  const src =
    fileValue instanceof File || fileValue instanceof Blob ? blob : fileValue;

  const isImage =
    fileType === "image" || mediaType({ url: fileValue, imageCheck: true });

  const isVideo =
    fileType === "video" || mediaType({ url: fileValue, videoCheck: true });
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            {label}
          </FormLabel>

          <FormControl>
            <>
              <div
                ref={isDragging}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="relative"
              >
                <DropdownForSelect
                  loading={loading}
                  fileValue={fileValue}
                  form={form}
                  name={name}
                  cropType={cropType}
                  blob={blob}
                  setBlob={setBlob}
                  cropperProps={cropperProps}
                  data={data}
                  isImage={isImage}
                />
                <label
                  disabled={loading}
                  ref={field?.ref}
                  htmlFor={trackID || "file"}
                  className={cn(
                    "flex items-center w-full h-full rounded-md border border-input bg-transparent px-3 gap-2 hover:outline-none hover:ring-1 hover:ring-ring/15 relative justify-center text-center cursor-pointer font-normal text-muted-foreground text-sm overflow-hidden min-h-30 md:min-h-55 min-w-30 md:min-w-55"
                  )}
                >
                  <span className="relative z-1 rounded-2xl px-4 py-2 bg-background/50">
                    {loading
                      ? "loading..."
                      : `Click or drag to select ${
                          acceptedTypes === "both" ? "file" : acceptedTypes
                        }`}
                  </span>

                  <Input
                    disabled={loading}
                    accept={getAcceptString()}
                    id={trackID || "file"}
                    className="sr-only!"
                    type="file"
                    onChange={(e) => {
                      handleChange({
                        file: e.target.files[0],
                        onChange: field.onChange,
                      });
                    }}
                    onClick={(e) => (e.target.value = null)}
                  />
                  <div className="w-full h-full overflow-hidden absolute opacity-80">
                    {isImage && (
                      <img
                        ref={imgRef}
                        draggable={false}
                        src={src}
                        onError={() => setBlob(null)}
                        alt="file image"
                        className="object-contain w-full h-full pointer-events-none"
                      />
                    )}

                    {isVideo && (
                      <video
                        ref={videoRef}
                        controls
                        className="object-contain w-full h-full"
                        src={src}
                        onError={() => setBlob(null)}
                        controlsList="nodownload nofullscreen noplaybackrate nopictureinpicture"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </label>
              </div>
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileInput;

const DropdownForSelect = ({
  fileValue,
  form,
  name,
  cropType,
  blob,
  setBlob,
  cropperProps,
  data,
  isImage,
  loading,
}) => {
  const [open, setOpen] = useState(false);

  const showCropOption = isImage;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Crop your image by dragging the corners of the outline. The part
              of the image that is inside the outline will be saved as your new
              image.
            </DialogDescription>
          </DialogHeader>
          <ImageCropper
            cropperProps={cropperProps}
            cropType={cropType}
            handleDone={(dataToFile) => {
              if (blob) {
                URL.revokeObjectURL(blob);
              }
              setBlob(URL.createObjectURL(dataToFile));
              form.setValue(name, dataToFile, formOpt);
            }}
            image={fileValue instanceof Blob ? blob : fileValue}
          />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={loading}
            variant="outline"
            className="h-8 w-8 rounded-full absolute top-2 right-2 z-1"
          >
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32" align="end" forceMount>
          {/* <DropdownMenuItem
            onClick={() => {
              setBlob(null);
              form.setValue(name, data || null, formOpt);
            }}
          >
            Reset
          </DropdownMenuItem> */}
          {fileValue && (
            <>
              {showCropOption && (
                <DropdownMenuItem onClick={setOpen}>Crop</DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  blob && URL.revokeObjectURL(blob);
                  form.setValue(name, null, formOpt);
                }}
              >
                Remove
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

function ImageCropper({ image, handleDone, cropType, cropperProps }) {
  const cropperRef = useRef(null);
  const onCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current?.getCanvas();
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            // Create File object with proper name and extension
            const timestamp = Date.now();
            const file = new File([blob], `cropped_image_${timestamp}.png`, {
              type: "image/png",
            });
            handleDone(file);
          } else {
            console.error("Failed to create a blob from the canvas.");
          }
        }, "image/png");
      }
    }
  };
  const src = useMemo(() => image, []);

  return (
    <>
      <div className="relative aspect-video grid grid-cols-1">
        <Cropper
          src={src}
          ref={cropperRef}
          stencilComponent={
            cropType === "circle" ? CircleStencil : RectangleStencil
          }
          stencilProps={{
            ...cropperProps?.stencilProps,
            overlayClassName: "cropper-overlay",
          }}
        />
      </div>
      <DialogFooter className="gap-y-4">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Close
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={onCrop}>
            Save changes
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
