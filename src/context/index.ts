export function getHiddenInput(query: string) {
  const extendInput = document.querySelector<HTMLInputElement>(query);

  if (extendInput) {
    return extendInput.value;
  } else {
    console.error("Không tìm thấy " + query);
  }

  return "";
}

export interface IExecute {
  func: () => void | Promise<void>;
}

export async function execute({ func }: IExecute) {
  if (typeof window === "undefined") return;

  window.executeInjectScript = func;
}
