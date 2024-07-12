import { createSlice } from "@reduxjs/toolkit";
import { current as getCurrentDXTheme } from "devextreme/ui/themes";
import {
  currentTheme as currentVizTheme,
  refreshTheme,
} from "devextreme/viz/themes";

const themePrefix = "app-theme-";
const storageKey = "app-theme";
const themes = ["light", "dark"];

function getNextTheme(theme) {
  return themes[themes.indexOf(theme) + 1] || themes[0];
}

function getCurrentTheme() {
  return window.localStorage[storageKey] || getNextTheme();
}

function toggleTheme(currentTheme) {
  const newTheme = getNextTheme(currentTheme);
  window.localStorage[storageKey] = newTheme;
  return newTheme;
}

function isThemeStyleSheet(styleSheet, theme) {
  const themeMarker = `${themePrefix}${theme}`;
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === "production") {
    return styleSheet?.href?.includes(`${themeMarker}`);
  } else {
    const rules = Array.from(styleSheet.cssRules);
    return !!rules.find((rule) =>
      rule?.selectorText?.includes(`.${themeMarker}`)
    );
  }
}

function switchThemeStyleSheets(enabledTheme) {
  const disabledTheme = getNextTheme(enabledTheme);

  Array.from(document.styleSheets).forEach((styleSheet) => {
    styleSheet.disabled = isThemeStyleSheet(styleSheet, disabledTheme);
  });
}

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isLoaded: false,
    theme: "light",
  },
  reducers: {
    setLoaded(state) {
      state.isLoaded = true;
    },
    switchTheme(state) {
      const newTheme = toggleTheme(state.theme);
      console.log("newTheme: " + newTheme);
      state.theme = newTheme;
    },
    setAppTheme(state, action) {
      const themeName = action.payload.newTheme || getCurrentTheme();

      switchThemeStyleSheets(themeName);

      const isFluent = getCurrentDXTheme().includes("fluent");
      const regTheme = isFluent ? /\.[a-z]+$/ : /\.[a-z]+\.compact$/;
      const replaceTheme = isFluent ? `.${themeName}` : `.${themeName}.compact`;
      currentVizTheme(currentVizTheme().replace(regTheme, replaceTheme));
      refreshTheme();
    },
  },
});

export const themeActions = themeSlice.actions;

export default themeSlice;
