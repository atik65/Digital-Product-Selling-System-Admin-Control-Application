const debounce = (func, delay = 300) => {
    let timeoutId = null;
    let lastCallTime = 0;
  
    const debouncedFn = (...args) => {
      return new Promise((resolve, reject) => {
        const now = Date.now();
  
        // Clear previous timeout if exists
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
  
        // Check if enough time has passed since last call
        if (now - lastCallTime >= delay) {
          // Execute immediately
          lastCallTime = now;
          try {
            const result = func(...args);
  
            // Handle both promise and non-promise functions
            if (result instanceof Promise) {
              result.then(resolve).catch(reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          // Schedule execution
          timeoutId = setTimeout(() => {
            lastCallTime = Date.now();
            try {
              const result = func(...args);
  
              // Handle both promise and non-promise functions
              if (result instanceof Promise) {
                result.then(resolve).catch(reject);
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
            }
          }, delay);
        }
      });
    };
  
    // Add method to cancel pending execution
    debouncedFn.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  
    return debouncedFn;
  };

  export default debounce