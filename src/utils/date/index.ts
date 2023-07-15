export const now = () => {
  // Get current date/time in Brazil timezone
  const now = new Date(new Date().getTime() - (3 * 60 * 60 * 1000));

  return now;
};
