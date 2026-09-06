import { useEffect, useRef, useState } from 'react';

export const useCanvasCourtImage = (src: string) => {
  const courtImgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      courtImgRef.current = img;
      setLoaded(true);
    };
  }, [src]);

  return { courtImgRef, courtImgLoaded: loaded };
};
