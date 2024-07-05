import { showToast } from "./toast";
export const handleShare = async (link: string ) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        url: link,
      });
      console.log("Shared successfully");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    const copyToClipboard = (text: string) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    };

    copyToClipboard(link);
    showToast("Link copied to clipboard");
    console.error("Web Share API not supported");
  }
};
