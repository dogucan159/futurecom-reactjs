import { getUserByIdentificationNumber } from "./user";

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
    // console.log(resTokenData);
    // const userResponse = await fetch(
    //   `https://localhost:7224/api/users/${identificationNumber}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: "Bearer " + resTokenData.access_token,
    //     },
    //   }
    // );

    // const resUserData = await userResponse.json();

    // if (!userResponse.ok) {
    //   throw new Error(resUserData.error_description);
    // }

    const resUserData = await getUserByIdentificationNumber(
      identificationNumber,
      resTokenData.access_token
    );

    localStorage.setItem("session-user", JSON.stringify(resUserData));
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

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to change password",
    };
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to reset password",
    };
  }
}
