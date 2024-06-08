import { API_URL, API_USERLOGS_PATH } from "../constants";

export async function create(data, access_token) {
  try {
    const response = await fetch(`${API_URL}/${API_USERLOGS_PATH}`, {
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
export async function partially_update(id, data, access_token) {
  try {
    const response = await fetch(`${API_URL}/${API_USERLOGS_PATH}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json-patch+json",
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
export async function getByStartAndFinishDate(sd, fd, access_token) {
  try {
    const response = await fetch(
      `${API_URL}/${API_USERLOGS_PATH}/getAllUserLogsByStartAndFinishDate?startDate=${sd}&finishDate=${fd}&orderBy=UserLogActionDateTime`,
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
