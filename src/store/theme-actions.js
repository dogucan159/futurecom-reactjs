import { themeActions } from "./theme-slice";

export const loadStylesImports = () => {
  return async (dispatch) => {
    const loadStyles = async () => {
      const prefixes = ["./styles/theme-dx-", "./styles/variables-"];
      await Promise.all([
        ...prefixes.flatMap((prefix) => [
          import(`${prefix}dark.scss`),
          import(`${prefix}light.scss`),
        ]),
      ]);
    };

    await loadStyles()
      .then(() => {
        dispatch(themeActions.setLoaded());
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
