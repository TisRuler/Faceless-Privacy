export function numberToPercentage(number: number): string {
  // Multiply the number by 100 to convert it to a percentage
  const percentage = number * 100;
  // Format the percentage to have two decimal places
  const formattedPercentage = percentage.toFixed(0);
  // Add the percentage symbol at the end
  return `${formattedPercentage}%`;
}