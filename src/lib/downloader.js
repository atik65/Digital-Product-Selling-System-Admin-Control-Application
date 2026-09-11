const downloader = ({ fileUrl, fileName }) => {
  const name = getFileName(fileName, fileUrl);
  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Download failed:", error);
    });
};
export default downloader;
function getFileName(fileName, fileUrl) {
  const urlParts = fileUrl.split("/");
  const fileNameFromUrl = urlParts[urlParts.length - 1];
  const extName = fileNameFromUrl.slice(
    ((fileNameFromUrl.lastIndexOf(".") - 1) >>> 0) + 2
  );
  return fileName ? `${fileName}.${extName}` : fileNameFromUrl;
}
