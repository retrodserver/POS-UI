import React, { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, Star, Trash2, RefreshCw, Check, Plus } from "lucide-react";
import type { MenuItem, MenuItemImage } from "@/types/posMenu";
import {
  useAddItemImages,
  useRemoveItemImage,
  useSetPrimaryImage,
} from "@/hooks/queries/usePosMenu";
import { toast } from "sonner";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_EXTENSIONS = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function ItemImageManagerModal({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
}) {
  const addImagesMutation = useAddItemImages();
  const removeImageMutation = useRemoveItemImage();
  const setPrimaryMutation = useSetPrimaryImage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen || !item) return null;

  const handleFiles = (files: FileList | File[]) => {
    const validFiles: File[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!ALLOWED_EXTENSIONS.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
        toast.error(`"${file.name}" is not a supported image format.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB size limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    setTimeout(() => {
      const newImages: MenuItemImage[] = validFiles.map((file, idx) => {
        const objectUrl = URL.createObjectURL(file);
        const sizeKb = (file.size / 1024).toFixed(0);
        const formattedSize =
          file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${sizeKb} KB`;

        return {
          id: `img-${Date.now()}-${idx}`,
          url: objectUrl,
          name: file.name,
          isPrimary: item.images.length === 0 && idx === 0,
          size: formattedSize,
          type: file.type || "image/jpeg",
          uploadedAt: "Just now",
        };
      });

      addImagesMutation.mutate(
        { itemId: item.id, images: newImages },
        {
          onSuccess: () => {
            toast.success(`Uploaded ${newImages.length} image(s) for ${item.name}`);
            setIsUploading(false);
          },
          onError: () => {
            toast.error("Failed to upload images");
            setIsUploading(false);
          },
        },
      );
    }, 500);
  };

  const handleSetPrimary = (imageId: string) => {
    setPrimaryMutation.mutate(
      { itemId: item.id, imageId },
      {
        onSuccess: () => {
          toast.success("Primary cover image updated");
        },
      },
    );
  };

  const handleRemove = (imageId: string) => {
    removeImageMutation.mutate(
      { itemId: item.id, imageId },
      {
        onSuccess: () => {
          toast.info("Image removed");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="h-4.5 w-4.5 text-teal-600" />
              Manage Images: {item.name}
            </h2>
            <p className="text-[12px] text-slate-500">
              Code: <span className="font-mono">{item.code}</span> • Category: {item.category}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-800">
              Uploaded Images ({item.images.length})
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-[12px] font-bold text-white shadow-2xs hover:bg-teal-700 transition cursor-pointer disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload New Images
            </button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
                e.target.value = "";
              }}
              className="hidden"
            />
          </div>

          {isUploading && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 flex items-center gap-2.5 text-[12.5px] font-semibold text-teal-800">
              <RefreshCw className="h-4 w-4 animate-spin text-teal-600" />
              Uploading and optimizing images...
            </div>
          )}

          {item.images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-xl p-10 text-center cursor-pointer transition bg-slate-50 hover:bg-teal-50/20"
            >
              <ImageIcon className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <div className="text-[13.5px] font-bold text-slate-700">No images yet</div>
              <div className="text-[12px] text-slate-400 mt-1">
                Upload JPG, PNG or WEBP photos for this dish.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {item.images.map((img) => (
                <div
                  key={img.id}
                  className={`rounded-xl border p-3 flex items-start gap-3 transition ${
                    img.isPrimary
                      ? "border-teal-500 bg-teal-50/30 ring-2 ring-teal-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                    {img.isPrimary && (
                      <span className="absolute bottom-1 left-1 rounded bg-teal-600 px-1 py-0.2 text-[9px] font-bold text-white">
                        Cover
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-between h-20">
                    <div>
                      <div
                        className="truncate text-[12.5px] font-bold text-slate-800"
                        title={img.name}
                      >
                        {img.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {img.size || "800 KB"} • {img.uploadedAt || "Uploaded"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      {!img.isPrimary ? (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                        >
                          <Star className="h-3 w-3" /> Set Cover
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-teal-700 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Primary Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(img.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-800 hover:bg-slate-900 px-5 py-2 text-[12.5px] font-bold text-white transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
