import { useTheme } from "vuetify";
import { computed } from "vue";

export function useCurrentColors() {
  const theme = useTheme();
  const background = computed(() => {
    return theme.global.current.value.colors.background;
  });
  const isDark = computed(() => {
    return theme.global.current.value.dark;
  });

  return {
    background,
    isDark,
    theme,
  };
}
