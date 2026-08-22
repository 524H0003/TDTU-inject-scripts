export {};

declare global {
  interface Window {
    executeInjectScript: () => Promise<void> | void;
    __scriptInjected?: boolean;
    __lastInjectedUrl?: string;
  }
}
