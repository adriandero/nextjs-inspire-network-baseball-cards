import { useEffect, useRef, useState } from "react";

interface FontSizeConfig {
  baseFontSize: string;
  headingFontSize: string;
  breakUpGraph?: boolean;
}

export function useHeightResponsiveFont(
  isDataReady: boolean,
  maxHeight: number = 1123,
  checkDelay: number = 1000
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontConfig, setFontConfig] = useState<FontSizeConfig>({
    baseFontSize: "text-base",
    headingFontSize: "text-3xl",
    breakUpGraph: false,
  });

  useEffect(() => {
    if (!isDataReady) return;

    const checkHeight = () => {
      if (!containerRef.current) return;

      const height = containerRef.current.scrollHeight;

      if (height <= maxHeight) {
        setFontConfig({
          baseFontSize: "text-base",
          headingFontSize: "text-3xl",
          breakUpGraph: false,
        });
        return;
      }

      const overflow = height - maxHeight;

      if (overflow > 600) {
        setFontConfig({
          baseFontSize: "text-xs",
          headingFontSize: "text-lg",
          breakUpGraph: true,
        });
      } else if (overflow > 300) {
        setFontConfig({
          baseFontSize: "text-sm",
          headingFontSize: "text-xl",
          breakUpGraph: false,
        });
      } else if (overflow > 150) {
        setFontConfig({
          baseFontSize: "text-sm",
          headingFontSize: "text-2xl",
          breakUpGraph: false,
        });
      } else {
        setFontConfig({
          baseFontSize: "text-sm",
          headingFontSize: "text-xl",
          breakUpGraph: false,
        });
      }
    };

    const timeoutId = setTimeout(checkHeight, checkDelay);
    return () => clearTimeout(timeoutId);
  }, [isDataReady, maxHeight, checkDelay]);

  return {
    containerRef,
    ...fontConfig,
  };
}
