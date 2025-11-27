export function getMemoWithTimestamp(privateAddress: string): string {
  const now = new Date();
  const date = now.toLocaleString("en-GB", {
    hour12: false,
    timeZoneName: "short",
  });
  
  return `From ${privateAddress} at ${date}`;
};