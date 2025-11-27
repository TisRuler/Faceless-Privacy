// Tracks ongoing async calls to prevent duplicate executions per key
const inflight = new Map<string, Promise<any>>();

/**
 * Prevents multiple concurrent calls to the same async function ().
 *
 * @param key - Unique identifier for the call (e.g., "token:1:0xabc...").
 * @param fn - The async function to run (only once per key at a time).
 * @returns - The result of the async function, shared among all callers.
 */
export async function dedupeAsyncCall<T>(key: string, fn: () => Promise<T>): Promise<T> {
  // If the key is already being processed, return the same promise (don't call fn again)
  if (inflight.has(key)) {
    return inflight.get(key)!; // there's already a call happening, return the same promise
  }

  // Create the new promise and clean up the map when it's resolved or rejected
  const promise = fn() 
    .then(result => {
      inflight.delete(key); // remove from cache after success
      return result; // return result to all awaiting calls
    })
    .catch(err => {
      inflight.delete(key); // ensure cleanup even on failure
      throw err; // rethrow error to all awaiting calls
    });

  // Return the in-progress promise so all callers share it
  inflight.set(key, promise);
  return promise;
}
