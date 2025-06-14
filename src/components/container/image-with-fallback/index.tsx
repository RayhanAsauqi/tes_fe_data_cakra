import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackElement?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
  validateUrl?: boolean;
}

const isValidImageUrl = (url?: string | null): boolean => {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const hasImageExtension = imageExtensions.some((ext) =>
      parsed.pathname.toLowerCase().endsWith(ext)
    );
    const hasImagePath = /(\/images\/|\/media\/|\/img\/)/i.test(
      parsed.pathname
    );

    return hasImageExtension || hasImagePath;
  } catch {
    return false;
  }
};

const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackElement,
  loadingIndicator,
  validateUrl = true,
  onLoad,
  onError,
  ...props
}: ImageWithFallbackProps) => {
  const [status, setStatus] = useState<
    "loading" | "loaded" | "error" | "empty"
  >(src && (!validateUrl || isValidImageUrl(src)) ? "loading" : "empty");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("loaded");
      onLoad?.(e);
    },
    [onLoad]
  );

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("error");
      onError?.(e);
    },
    [onError]
  );

  useEffect(() => {
    if (!src) {
      setStatus("empty");
      return;
    }

    if (validateUrl && !isValidImageUrl(src)) {
      setStatus("empty");
      return;
    }
    const img = new Image();
    img.src = src;

    if (img.complete && img.naturalWidth > 0) {
      setStatus("loaded");
    } else {
      setStatus("loading");
      img.onload = () => setStatus("loaded");
      img.onerror = () => setStatus("error");
    }
  }, [src, validateUrl]);

  const renderContent = useMemo(() => {
    switch (status) {
      case "loaded":
        return (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={className}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
            {...props}
          />
        );

      case "loading":
        return loadingIndicator ? (
          loadingIndicator
        ) : (
          <div
            className={cn(
              "flex items-center justify-center bg-slate-100",
              className
            )}
          >
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        );

      case "error":
      case "empty":
        return fallbackElement ? (
          fallbackElement
        ) : (
          <div
            className={cn(
              "flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300",
              className
            )}
          >
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-2 bg-slate-400 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {alt?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <p className="text-slate-600 text-sm font-medium">
                {status === "error" ? "Failed to load" : "No image"}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [
    status,
    src,
    alt,
    className,
    handleLoad,
    handleError,
    loadingIndicator,
    fallbackElement,
    props,
  ]);

  return renderContent;
};

export default ImageWithFallback;
