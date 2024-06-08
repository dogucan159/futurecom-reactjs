import { API_APPSETTINGS_PATH, API_URL } from "../constants";
import {
  create as createItemLog,
  createMulti as createItemLogMulti,
} from "./itemLog";
export async function getAll(access_token) {
  try {
    const response = await fetch(
      `${API_URL}/${API_APPSETTINGS_PATH}?orderBy=AppSettingName`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    const resData = await response.json();
    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? "401 - Unauthorized!!!"
          : `${resData.StatusCode} - ${resData.Message}`
      );
    }
    return {
      isOk: true,
      data: resData,
    };
  } catch (error) {
    return {
      isOk: false,
      message: error.message,
    };
  }
}

export async function create(data, access_token) {
  try {
    const response = await fetch(`${API_URL}/${API_APPSETTINGS_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: data,
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? "401 - Unauthorized!!!"
          : `${resData.StatusCode} - ${resData.Message}`
      );
    }

    //item log
    const user = JSON.parse(localStorage.getItem("session-user"));
    const itemLog = {
      itemLogControlName: "AppSetting",
      itemLog_SessionId: user.sessionId,
      itemLog_ItemId: resData.baseEntityId,
      itemLogActionType: "C",
      itemLogActionDate: new Date(),
      itemLogActionComment: `${resData.appSettingName} created`,
    };
    await createItemLog(JSON.stringify(itemLog), access_token);
    //

    return {
      isOk: true,
      data: resData,
    };
  } catch (error) {
    return {
      isOk: false,
      message: error.message,
    };
  }
}

export async function getById(id, access_token) {
  try {
    const response = await fetch(`${API_URL}/${API_APPSETTINGS_PATH}/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? "401 - Unauthorized!!!"
          : `${resData.StatusCode} - ${resData.Message}`
      );
    }
    return resData;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function update(data, access_token) {
  try {
    const response = await fetch(`${API_URL}/${API_APPSETTINGS_PATH}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: data,
    });
    if (!response.ok) {
      const resData = await response.json();
      throw new Error(
        response.status === 401
          ? "401 - Unauthorized!!!"
          : `${resData.StatusCode} - ${resData.Message}`
      );
    }

    //item log
    const user = JSON.parse(localStorage.getItem("session-user"));
    const jsonData = JSON.parse(data);
    const itemLog = {
      itemLogControlName: "AppSetting",
      itemLog_SessionId: user.sessionId,
      itemLog_ItemId: jsonData.baseEntityId,
      itemLogActionType: "U",
      itemLogActionDate: new Date(),
      itemLogActionComment: `${jsonData.appSettingName} updated`,
    };
    const resItemLogData = await createItemLog(
      JSON.stringify(itemLog),
      access_token
    );
    //

    if (!resItemLogData.isOk) {
      return {
        isOk: false,
        message: resItemLogData.message,
      };
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

export async function remove(data, access_token) {
  try {
    const response = await fetch(
      `${API_URL}/${API_APPSETTINGS_PATH}/DeleteMultipleAppSettings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        body: data,
      }
    );

    if (!response.ok) {
      const resData = await response.json();
      throw new Error(
        response.status === 401
          ? "401 - Unauthorized!!!"
          : `${resData.StatusCode} - ${resData.Message}`
      );
    }

    //item log
    const user = JSON.parse(localStorage.getItem("session-user"));
    const jsonData = JSON.parse(data);
    let lstItemLog = [];
    for (let index = 0; index < jsonData.length; index++) {
      const element = jsonData[index];
      const itemLog = {
        itemLogControlName: "AppSetting",
        itemLog_SessionId: user.sessionId,
        itemLog_ItemId: element,
        itemLogActionType: "D",
        itemLogActionDate: new Date(),
        itemLogActionComment: `Email Content deleted`,
      };
      lstItemLog = [...lstItemLog, itemLog];
    }
    await createItemLogMulti(JSON.stringify(lstItemLog), access_token);
    //

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
