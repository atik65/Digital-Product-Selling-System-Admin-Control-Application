const removeHtml = (html = "", trimSize = 0) => {
  if (!html) return;

  const htmlTagsRegex = /<\/?[^>]+>/g;
  const entitiesRegex = /&nbsp;|&lt;|&gt;|&amp;|&quot;|&apos;/g;
  const multipleSpacesRegex = /\s+/g;

  let plainText = html.replace(htmlTagsRegex, " ");

  plainText = plainText.replace(entitiesRegex, (entity) => {
    switch (entity) {
      case "&nbsp;":
        return " ";
      case "&lt;":
        return "<";
      case "&gt;":
        return ">";
      case "&amp;":
        return "&";
      case "&quot;":
        return '"';
      case "&apos;":
        return "'";
      default:
        return entity;
    }
  });

  plainText = plainText.replace(multipleSpacesRegex, " ").trim();

  if (trimSize) {
    return plainText.length > trimSize
      ? plainText.slice(0, trimSize) + "..."
      : plainText;
  } else {
    return plainText;
  }
};

export default removeHtml;
