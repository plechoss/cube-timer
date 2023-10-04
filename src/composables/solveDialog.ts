import { DialogDisplayType } from "../types/enums";
import { ref } from "vue";

export function useSolveDialog() {
  const isSolveDialogOpen = ref(false);
  const dialogDisplayType = ref<DialogDisplayType>("single");
  const endingIndex = ref<number>(-1);

  function openSolveDialog(dialogType: DialogDisplayType, index: number) {
    dialogDisplayType.value = dialogType;
    endingIndex.value = index;
    isSolveDialogOpen.value = true;
  }

  return {
    isSolveDialogOpen,
    dialogDisplayType,
    endingIndex,
    openSolveDialog,
  };
}
