function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Operation timed out after ${ms} ms`)), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
  
export async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxAttempts = 3,
  baseDelayMs = 200
): Promise<T> {
  const TIMEOUT_MS = 5000; // fixed timeout per attempt
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await withTimeout(fn(), TIMEOUT_MS);
    } catch (error) {
      if (attempt === maxAttempts) {
        const message =
            typeof error === "object" && error !== null && "message" in error
              ? (error as Error).message
              : String(error);
        throw new Error(`${label} failed after ${maxAttempts} attempts: ${message}`);
      }
        
      const delay = baseDelayMs * 2 ** (attempt - 1);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  
  // TS requires this, but practically unreachable:
  throw new Error(`${label} failed: Unknown error`);
}
  