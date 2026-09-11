import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Upload, X, File, Clock } from "lucide-react";
import Image from "next/image";

export const FieldFileInputBase64 = ({
  name,
  form,
  label,
  description,
  disabled = false,
  required = false,
  className,
  multiple = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  onChange,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files, field) => {
    const fileArray = Array.from(files);

    // Filter files by size
    const validFiles = fileArray.filter((file) => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} exceeds maximum size`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Convert files to base64 and generate previews
    const newPreviews = await Promise.all(
      validFiles.map(async (file) => {
        const isImage = file.type.startsWith("image/");
        const base64 = await fileToBase64(file);
        // const base64 = await file;

        return {
          name: file.name,
          size: file.size,
          type: file.type,
          isImage,
          base64,
          url: isImage ? base64 : null,
        };
      })
    );

    if (multiple) {
      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);
      field.onChange(updatedPreviews.map((p) => p.base64));
    } else {
      setPreviews(newPreviews);
      field.onChange(newPreviews[0]?.base64 || null);
    }

    if (onChange) {
      onChange(
        multiple ? newPreviews.map((p) => p.base64) : newPreviews[0]?.base64
      );
    }
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files, field);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index, field) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);

    if (multiple) {
      field.onChange(updatedPreviews.map((p) => p.file));
    } else {
      field.onChange("");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={"border p-3 rounded-[10px]"}>
          {/* Header with Label and Status */}
          <div className="flex items-center justify-between mb-0 ">
            {label && (
              <FormLabel className="text-sm ps-1 font-semibold text-gray-900 flex items-center gap-1 capitalize">
                {label}
                {required && (
                  <span className="text-rose-500 text-base font-bold">*</span>
                )}
              </FormLabel>
            )}

            {previews.length === 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Not Uploaded</span>
              </div>
            )}
          </div>

          <FormControl>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onDrop={(e) => handleDrop(e, field)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "relative",
                disabled && "cursor-not-allowed opacity-50",
                className
              )}
            >
              <div
                className={cn(
                  "relative min-h-12.5 flex flex-col bg-white border-2 border-gray-200 rounded-[10px] transition-all duration-300 overflow-hidden",
                  "hover:border-gray-300",
                  isDragging && "border-blue-400 bg-blue-50/30"
                )}
              >
                {/* Upload Area */}
                <label
                  className={cn(
                    "flex items-center gap-4 p-3 transition-all duration-300 cursor-pointer",
                    previews.length > 0 ? "border-b border-gray-200" : "",
                    isDragging && "bg-blue-50/50",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <input
                    type="file"
                    className="hidden"
                    disabled={disabled}
                    multiple={multiple}
                    accept={accept}
                    onChange={(e) => {
                      console.log("e.target.files =", e.target.files);
                      if (e.target.files) {
                        handleFiles(e.target.files, field);
                      }
                    }}
                    {...props}
                  />

                  <div className="flex items-center justify-center w-8 h-8 cursor-pointer shrink-0">
                    <Upload className="w-5 h-5 text-gray-500" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {description ||
                        `PNG, JPG or PDF (max. ${formatFileSize(maxSize)})`}
                    </p>
                  </div>
                </label>

                {/* File Previews */}
                <AnimatePresence>
                  {previews.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 py-2 space-y-2 bg-[#F0FDF4]"
                    >
                      {previews.map((preview, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3 group"
                        >
                          {/* Preview Thumbnail */}
                          {preview.isImage ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                              <Image
                                src={preview.url}
                                alt={preview.name}
                                className="w-full h-full object-cover"
                                height={200}
                                width={200}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-200">
                              <File className="w-6 h-6 text-blue-600" />
                            </div>
                          )}

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {preview.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(preview.size)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeFile(index, field)}
                            disabled={disabled}
                            className="w-6 h-6 cursor-pointer rounded-full bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors duration-200 shrink-0 opacity-100 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </FormControl>

          <FormMessage className="text-xs font-bold text-rose-500 mt-0" />
        </FormItem>
      )}
    />
  );
};

export const FieldFileInput = ({
  name,
  form,
  label,
  description,
  disabled = false,
  required = false,
  className,
  multiple = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  onChange,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);

  // Create preview URL for images
  const createPreviewUrl = (file) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const handleFiles = async (files, field) => {
    const fileArray = Array.from(files);

    // Filter files by size
    const validFiles = fileArray.filter((file) => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} exceeds maximum size`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview objects with raw File objects
    const newPreviews = validFiles.map((file) => {
      const isImage = file.type.startsWith("image/");

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        isImage,
        file, // Store the raw File object
        url: isImage ? createPreviewUrl(file) : null,
      };
    });

    if (multiple) {
      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);
      field.onChange(updatedPreviews.map((p) => p.file));
    } else {
      setPreviews(newPreviews);
      field.onChange(newPreviews[0]?.file || null);
    }

    if (onChange) {
      onChange(
        multiple ? newPreviews.map((p) => p.file) : newPreviews[0]?.file
      );
    }
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files, field);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index, field) => {
    // Revoke the object URL to free memory
    if (previews[index].url) {
      URL.revokeObjectURL(previews[index].url);
    }

    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);

    if (multiple) {
      field.onChange(updatedPreviews.map((p) => p.file));
    } else {
      field.onChange("");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previews]);

  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => (
        <FormItem className={"border p-3 rounded-[10px]"}>
          {/* Header with Label and Status */}
          <div className="flex items-center justify-between mb-0 ">
            {label && (
              <FormLabel className="text-sm ps-1 font-semibold text-gray-900 flex items-center gap-1 capitalize">
                {label}
                {required && (
                  <span className="text-rose-500 text-base font-bold">*</span>
                )}
              </FormLabel>
            )}

            {previews.length === 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Not Uploaded</span>
              </div>
            )}
          </div>

          <FormControl>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onDrop={(e) => handleDrop(e, field)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "relative",
                disabled && "cursor-not-allowed opacity-50",
                className
              )}
            >
              <div
                className={cn(
                  "relative min-h-12.5 flex flex-col bg-white border-2 border-gray-200 rounded-[10px] transition-all duration-300 overflow-hidden",
                  "hover:border-gray-300",
                  isDragging && "border-blue-400 bg-blue-50/30"
                )}
              >
                {/* Upload Area */}
                <label
                  className={cn(
                    "flex items-center gap-4 p-3 transition-all duration-300 cursor-pointer",
                    previews.length > 0 ? "border-b border-gray-200" : "",
                    isDragging && "bg-blue-50/50",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <input
                    type="file"
                    className="hidden"
                    disabled={disabled}
                    multiple={multiple}
                    accept={accept}
                    onChange={(e) => {
                      console.log("e.target.files =", e.target.files);
                      if (e.target.files) {
                        handleFiles(e.target.files, field);
                      }
                    }}
                    {...props}
                  />

                  <div className="flex items-center justify-center w-8 h-8 cursor-pointer shrink-0">
                    <Upload className="w-5 h-5 text-gray-500" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {description ||
                        `PNG, JPG or PDF (max. ${formatFileSize(maxSize)})`}
                    </p>
                  </div>
                </label>

                {/* File Previews */}
                <AnimatePresence>
                  {previews.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 py-2 space-y-2 bg-[#F0FDF4]"
                    >
                      {previews.map((preview, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3 group"
                        >
                          {/* Preview Thumbnail */}
                          {preview.isImage ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                              <Image
                                src={preview.url}
                                alt={preview.name}
                                className="w-full h-full object-cover"
                                height={200}
                                width={200}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-200">
                              <File className="w-6 h-6 text-blue-600" />
                            </div>
                          )}

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {preview.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(preview.size)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeFile(index, field)}
                            disabled={disabled}
                            className="w-6 h-6 cursor-pointer rounded-full bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors duration-200 shrink-0 opacity-100 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </FormControl>

          <FormMessage className="text-xs font-bold text-rose-500 mt-0" />
        </FormItem>
      )}
    />
  );
};

export default FieldFileInput;
