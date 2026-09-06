"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GripVertical, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/cms-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadProductImage, deleteStorageObjectByUrl } from "@/lib/storage/upload";
import { serializeProductImages } from "@/lib/products/images";
import type { ProductImage } from "@/types/product";

type Props = {
  productId: string;
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
};

export function ProductGalleryManager({ productId, images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const updateImages = (next: ProductImage[]) => {
    onChange(serializeProductImages(next));
  };

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    const result = await uploadProductImage(productId, file);
    setUploading(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    updateImages([
      ...images,
      { url: result.url, alt: "", sort: images.length },
    ]);
    toast.success("Image uploaded");
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    updateImages([...images, { url, alt: "", sort: images.length }]);
    setUrlInput("");
    toast.success("Image added");
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    if (image.url.includes("/storage/v1/object/public/magali-assets/")) {
      await deleteStorageObjectByUrl(image.url);
    }
    updateImages(images.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  const moveImage = (from: number, to: number) => {
    if (from === to) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateImages(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[240px] flex-1 space-y-2">
          <Label htmlFor="image-url">Paste image URL</Label>
          <Input
            id="image-url"
            type="url"
            placeholder="https://… or /images/products/…"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
          />
        </div>
        <Button type="button" variant="outline" onClick={addUrl}>
          Add URL
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="size-4" />
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No images yet. Upload or paste a URL. The first image is the hero.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              draggable
              onDragStart={() => {
                dragIndex.current = index;
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex.current === null) return;
                moveImage(dragIndex.current, index);
                dragIndex.current = null;
              }}
              className="flex gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex shrink-0 flex-col items-center gap-1 pt-1 text-muted-foreground">
                <GripVertical className="size-4 cursor-grab" />
                <span className="text-[10px] tabular-nums">{index + 1}</span>
              </div>
              <div className="relative size-16 shrink-0 overflow-hidden rounded border bg-muted">
                <Image
                  src={image.url}
                  alt={image.alt || "Product image"}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <Input
                  placeholder="Alt text"
                  value={image.alt ?? ""}
                  onChange={(event) => {
                    const next = images.map((item, i) =>
                      i === index ? { ...item, alt: event.target.value } : item,
                    );
                    onChange(next);
                  }}
                />
                <p className="truncate text-xs text-muted-foreground">{image.url}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => void removeImage(index)}
                aria-label="Remove image"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
