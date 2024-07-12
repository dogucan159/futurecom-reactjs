import notify from "devextreme/ui/notify";
import { refreshTokenData, signIn as sendSignInRequest } from "../../api/auth";
import { authActions } from "./auth-slice";
import { partially_update as partially_update_userlog } from "../../api/userLog";
import { getToken, getUser } from "../../utils/auth";

export const signIn = (identificationNumber, password) => {
  return async (dispatch) => {
    dispatch(authActions.setLoading({ isLoading: true }));
    const result = await sendSignInRequest(identificationNumber, password);
    if (!result.isOk) {
      dispatch({ isLoading: false });
      notify(result.message, "error", 2000);
    } else {
      dispatch(authActions.replaceUser(result));
    }
  };
};

export const signOut = () => {
  return async (dispatch) => {
    const data = [
      {
        op: "replace",
        path: "userLogIsSecureLogout",
        value: "true",
      },
      {
        op: "replace",
        path: "UserLogCheckOutTime",
        value: new Date(),
      },
    ];
    const token = getToken();
    const usr = getUser();

    const result = await partially_update_userlog(
      usr.sessionId,
      JSON.stringify(data),
      token.access_token
    );

    if (!result.isOk) {
      notify(result.message, "error", 2000);
    } else {
      localStorage.removeItem("session-user");
      localStorage.removeItem("session-token");
      dispatch(authActions.clearUser());
    }
  };
};

export const refreshToken = () => {
  return async (dispatch) => {
    const result = await refreshTokenData();
    if (!result.isOk) {
      notify(result.message, "error", 2000);
    } else {
      dispatch(authActions.refreshToken(result));
    }
  };
};
