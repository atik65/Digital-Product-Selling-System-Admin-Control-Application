import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import config from "@/config/base";

const formatTitle = (str) =>
  str.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const usePageTitle = (title, suffix = config.appTitle || "") => {
  const location = useLocation();

  useEffect(() => {
    let pageTitle = title;

    if (!title) {
      const pathName = location.pathname.split("/").filter(Boolean).pop();

      pageTitle = pathName ? formatTitle(pathName) : "Home";
    }

    document.title = suffix ? `${pageTitle} | ${suffix}` : pageTitle;
  }, [title, suffix, location.pathname]);
};

export default usePageTitle;
