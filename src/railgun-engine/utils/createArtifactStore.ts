import localforage from "localforage";
import { ArtifactStore } from "@railgun-community/wallet";

export const createArtifactStore = new ArtifactStore(
  async (path: string) => {
    return localforage.getItem(path);
  },
  async (dir: string, path: string, item: string | Uint8Array) => {
    await localforage.setItem(path, item);
  },
  async (path: string) => (await localforage.getItem(path)) != null
);