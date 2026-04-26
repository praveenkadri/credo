import { en } from "@/content/en";

export function useContent() {
  const locale = "en"; // future: dynamic
  const dict = { en };
  return dict[locale];
}
