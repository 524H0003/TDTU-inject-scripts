export {};

declare global {
  interface Window {
    executeInjectScript: (cssContent?: string) => Promise<void> | void;
    __scriptInjected?: boolean;
    __lastInjectedUrl?: string;
  }
}
