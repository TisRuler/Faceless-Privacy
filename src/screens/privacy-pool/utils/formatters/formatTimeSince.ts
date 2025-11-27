export const formatTimeSince = (timestamp: BigInt): string => {
  // Convert timestamp from BigInt to milliseconds and subtract from current time
  const timestampMs = Number(timestamp) * 1000; // Convert to milliseconds
  const timeElapsedMs = Date.now() - timestampMs; // Get time difference in milliseconds
  
  const daysElapsed = Math.floor(timeElapsedMs / (1000 * 60 * 60 * 24)); // Convert time elapsed to days
  const hoursElapsed = Math.floor((timeElapsedMs / (1000 * 60 * 60)) % 24); // Get remaining hours

  if (daysElapsed > 1) {
    return `${daysElapsed} Days ago`;
  } else if (daysElapsed === 1) {
    return "1 Day ago";
  } else {
    return `${hoursElapsed} Hours ago`;
  }
};
