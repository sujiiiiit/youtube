import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

interface ToastProps {
  message: string;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className={`  relative z-[999] p-4 py-2 rounded-lg overflow-hidden`}>
      <div className="absolute z-10 bg-black dark:bg-white  right-0 left-0 top-0 bottom-0 rounded-lg "></div>
      <div className=" relative flex z-20 items-center justify-between text-white dark:text-black">
        <span className="w-full" dangerouslySetInnerHTML={{ __html: message }}></span>
      </div>
    </div>
  );
};

export const showToast = (message: string, duration?: number) => {
  const toastContainer = document.createElement("span");
  toastContainer.classList.add(
    "toast-container",
    "absolute",
    "z-[1000]",
    "bottom-0",
    "rounded-lg",
    "p-3"
    
  );
  document.body.appendChild(toastContainer);

  const root = createRoot(toastContainer);

  const removeToast = () => {
    document.body.removeChild(toastContainer);
  };

  root.render(<Toast message={message} duration={duration} />);

    setTimeout(removeToast, duration || 3000);
};
