import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Fallback CSS-based animated background
const CSSAnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Floating hearts animation */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              fontSize: `${0.5 + Math.random() * 1}rem`,
              opacity: 0.1 + Math.random() * 0.3,
            }}
          >
            💖
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-purple-100/20 to-indigo-100/20 animate-pulse"
           style={{ animationDuration: '8s' }} />

      {/* Geometric shapes */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-pink-200/10 to-purple-200/10 animate-bounce"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              width: `${20 + Math.random() * 80}px`,
              height: `${20 + Math.random() * 80}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const Component = () => {
  const { width, height } = useWindowSize();
  const [useUnicorn, setUseUnicorn] = useState(true);
  const [unicornLoaded, setUnicornLoaded] = useState(false);

  useEffect(() => {
    // Try to load UnicornStudio, fallback to CSS animation if it fails
    const timer = setTimeout(() => {
      if (!unicornLoaded) {
        setUseUnicorn(false);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timer);
  }, [unicornLoaded]);

  if (!useUnicorn) {
    return (
      <div className={cn("w-full h-full relative")}>
        <CSSAnimatedBackground />
      </div>
    );
  }

  try {
    // Dynamic import to handle potential loading issues
    const UnicornScene = require("unicornstudio-react").default;

    return (
      <div className={cn("w-full h-full relative")}>
        <UnicornScene
          production={true}
          projectId="cbmTT38A0CcuYxeiyj5H"
          width={width}
          height={height}
          onLoad={() => setUnicornLoaded(true)}
          onError={() => setUseUnicorn(false)}
        />
        {/* Fallback while loading */}
        {!unicornLoaded && <CSSAnimatedBackground />}
      </div>
    );
  } catch (error) {
    console.warn('UnicornStudio failed to load, using fallback animation:', error);
    return (
      <div className={cn("w-full h-full relative")}>
        <CSSAnimatedBackground />
      </div>
    );
  }
};