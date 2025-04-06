import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768) {
  // Default to desktop during SSR
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < breakpoint);
    
    // Update on window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  
  return isMobile;
}