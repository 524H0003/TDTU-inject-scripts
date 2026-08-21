export {};

declare global {
  interface Window {
    executeInjectScript: () => Promise<void> | void;
  }
}
