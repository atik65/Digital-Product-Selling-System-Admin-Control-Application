import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Image({
  src,
  alt = "",
  fallback = "/placeholder.svg",
  className,
  width,
  height,
  objectFit = "cover",
  blur = true,
  ...props
}) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Lazy load
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = src; // load real image
          observer.unobserve(img);
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [src]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      <img
        ref={imgRef}
        src={fallback} // initial placeholder
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          imgRef.current.src = fallback;
        }}
        className={cn(
          "w-full h-full object-cover transition-all duration-300",
          blur && !loaded ? "blur-sm opacity-50" : "blur-0 opacity-100"
        )}
        style={{ objectFit }}
        {...props}
      />

      {!loaded && !error && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
    </div>
  );
}

/*
Usage Example:
    import Image from "@/components/common/Image";

    // Basic usage
    <Image 
    src="https://example.com/image.jpg" 
    alt="Product image" 
    />

    // With dimensions
    <Image 
    src="/product.jpg" 
    alt="Product" 
    width={400} 
    height={300} 
    />

    // Custom fallback and object-fit
    <Image 
    src="/avatar.jpg" 
    alt="User avatar" 
    fallback="/default-avatar.png"
    objectFit="contain"
    className="rounded-full"
    />

    // Eager loading (no lazy load)
    <Image 
    src="/hero.jpg" 
    alt="Hero" 
    loading="eager"
    blur={false}
    />

    // With callbacks
    <Image 
    src="/image.jpg" 
    alt="Image"
    onLoad={() => console.log("Image loaded")}
    onError={() => console.log("Image failed")}
    />  
*/
