/* eslint-disable no-prototype-builtins */
const processAsFormData = (data) => {
  const formData = new FormData();

  function appendObjectToFormData(formData, obj, parentKey = "") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const propName = parentKey ? `${parentKey}[${key}]` : key;

        if (value instanceof File || value instanceof Blob) {
          formData.append(propName, value);
        } else if (value instanceof Object && !(value instanceof Date)) {
          appendObjectToFormData(formData, value, propName);
        } else {
          formData.append(propName, value);
        }
      }
    }
  }

  appendObjectToFormData(formData, data);

  return formData;
};

export default processAsFormData;
