import React from "react";
import { Button } from "@douyinfe/semi-ui";
interface downloadProps {
  className?: string;
  data: string;
  fileName: string;
}
function DownloadButton({ className, data, fileName }: downloadProps) {
  const handleClick = () => {
    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      type="primary"
      className={`animate-bounce  ${className}`}
      onClick={handleClick}
    >
      下载 {fileName}
    </Button>
  );
}

export default DownloadButton;
