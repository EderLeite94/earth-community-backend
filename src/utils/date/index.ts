export const DateNow = () => {
    // Get current date/time in Brazil timezone
    const now = new Date(new Date().getTime() - (3 * 60 * 60 * 1000));
    return now;
  };
  
  export const now = DateNow(); // Exporting the current date/time as well
  