import { createApp } from "vue";
import { createVuetify, ThemeDefinition } from "vuetify";

import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

type TimerThemeDefinition = {
  colors: {
    timer: string;
    "timer-inspection-end": string;
    "penalty-button-background": string;
  };
};

type CustomThemeDefinition = TimerThemeDefinition & ThemeDefinition;

const myCustomLightTheme: CustomThemeDefinition = {
  dark: false,
  colors: {
    "app-bar": "#FFFFFF",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    primary: "#6200EE",
    "primary-darken-1": "#3700B3",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
    timer: "#FFFFFF",
    "timer-inspection-end": "#FFFFFF",
    "penalty-button-background": "#FFFFFF",
  },
};
const myCustomDarkTheme: CustomThemeDefinition = {
  dark: true,
  colors: {
    "app-bar": "#424242",
    background: "#212121",
    surface: "#FFFFFF",
    primary: "#6200EE",
    "primary-darken-1": "#3700B3",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
    timer: "#FFFFFF",
    "timer-inspection-end": "#FFFFFF",
    "penalty-button-background": "#FFFFFF",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
      myCustomDarkTheme,
    },
  },
});
