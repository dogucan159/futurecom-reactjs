import { getUserByIdentificationNumber } from "./user";
import { create as createUserLog } from "./userLog";

export async function refreshTokenData() {
  try {
    const tokenData = JSON.parse(localStorage.getItem("session-token"));
    const refreshTokenData = {
      client_id: "icdenClient",
      client_secret: "cap123",
      grant_type: "refresh_token",
      refresh_token: tokenData.refresh_token,
    };

    var formBody = [];
    for (var property in refreshTokenData) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(refreshTokenData[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const tokenResponse = await fetch("https://localhost:7272/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });

    const resTokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(resTokenData.error_description);
    }

    const expiration = new Date();
    const hour = resTokenData.expires_in / 3600;
    expiration.setHours(expiration.getHours() + hour);
    // const expiration = new Date();
    // expiration.setMinutes(expiration.getMinutes() + 1);
    localStorage.setItem(
      "session-token",
      JSON.stringify({ ...resTokenData, expiration })
    );

    return {
      isOk: true,
      tokenData: resTokenData,
    };
  } catch (error) {
    return {
      isOk: false,
      message: error.message,
    };
  }
}

export async function signIn(identificationNumber, password) {
  try {
    const authData = {
      client_id: "icdenClient",
      client_secret: "cap123",
      grant_type: "password",
      username: identificationNumber,
      password: password,
    };

    var formBody = [];
    for (var property in authData) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(authData[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const tokenResponse = await fetch("https://localhost:7272/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });

    const resTokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(resTokenData.error_description);
    }

    const resUserData = await getUserByIdentificationNumber(
      identificationNumber,
      resTokenData.access_token
    );

    const userLog = {
      userLogAction: "S",
      baseEntitySiteId: resUserData.baseEntitySiteId,
      userLogActionDateTime: new Date(),
      userLogUserId: resUserData.baseEntityId,
    };

    const resUserLogData = await createUserLog(
      JSON.stringify(userLog),
      resTokenData.access_token
    );

    if (!resUserLogData.isOk) {
      return {
        isOk: false,
        message: resUserLogData.message,
      };
    }

    localStorage.setItem(
      "session-user",
      JSON.stringify({
        ...resUserData,
        sessionId: resUserLogData.data.baseEntityId,
      })
    );
    const expiration = new Date();
    const hour = resTokenData.expires_in / 3600;
    expiration.setHours(expiration.getHours() + hour);
    // const expiration = new Date();
    // expiration.setMinutes(expiration.getMinutes() + 1);
    localStorage.setItem(
      "session-token",
      JSON.stringify({ ...resTokenData, expiration })
    );
    return {
      isOk: true,
      sessionUserData: resUserData,
      tokenData: resTokenData,
    };
  } catch (error) {
    return {
      isOk: false,
      message: error.message,
    };
  }
}

export async function createAccount(email, password) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to create account",
    };
  }
}

export async function changePassword(id, newPassword, confirmedPassword) {
  try {
    // Send request
    const data = JSON.stringify({
      userId: id,
      newPassword,
      confirmPassword: confirmedPassword,
    });
    const response = await fetch(
      "https://localhost:7224/api/users/ResetUserPassword",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }
    );

    if (!response.ok) {
      const resData = await response.json();
      throw new Error(`${resData.StatusCode} - ${resData.Message}`);
    }

    return {
      isOk: true,
    };
  } catch (error) {
    return {
      isOk: false,
      message: error.message,
    };
  }
}

export async function sendResetPasswordMail(email) {
  try {
    // Send request
    const response = await fetch(
      `https://localhost:7224/api/users/SendResetUserPasswordMail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
        }),
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      throw new Error(`${resData.StatusCode} - ${resData.Message}`);
    }

    return {
      isOk: true,
    };
  } catch (error) {
    console.log(error.message);
    return {
      isOk: false,
      message: error.message,
    };
  }
}
