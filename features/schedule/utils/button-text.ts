import type { Mode } from "../components/form/game-form";

export function getButtonText(
  isSubmitting: boolean,
  mode: Mode,
  activity: string,
): string {
  if (mode === "edit") {
    return isSubmitting ? "Editing..." : `Edit ${activity}`;
  }
  return isSubmitting ? "Creating..." : `Create ${activity}`;
}
