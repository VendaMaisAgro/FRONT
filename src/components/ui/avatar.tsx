"use client";

import * as React from "react";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };
type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement> & { className?: string };
type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement> & { className?: string };

export function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ className, alt, ...props }: AvatarImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="avatar-image"
      alt={alt}
      className={`h-full w-full object-cover ${className ?? ""}`}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <span
      data-slot="avatar-fallback"
      className={`flex h-full w-full items-center justify-center ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}



