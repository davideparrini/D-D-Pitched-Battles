// src/hooks/useImageUpload.ts
import { useState } from 'react';
import { Size } from '../types/map';

export const useImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<Size | null>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onLoadCallback?: () => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        setImage(src);

        const img = new Image();
        img.src = src;
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });

          if (onLoadCallback) {
            onLoadCallback(); // chiama la callback quando immagine e dimensioni sono pronte
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    image,
    imageSize,
    setImage,
    setImageSize,
    handleImageUpload,
  };
};
