import { API_URL, API_USERS_PATH } from "../constants";

export async function getUserByIdentificationNumber(
  identificationNumber,
  access_token
) {
  try {
    const response = await fetch(
      `${API_URL}/${API_USERS_PATH}/${identificationNumber}`,
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

export async function getById(id, access_token) {
  try {
    const response = await fetch(`${API_URL}/${API_USERS_PATH}/${id}`, {
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

export async function update(user, access_token) {
  try {
    const response = await fetch(`${API_URL}/${API_USERS_PATH}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const resData = await response.json();
      throw new Error(
        response.status === 401
          ? "401 - Unauthorized!!!"
          : `${resData.StatusCode} - ${resData.Message}`
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updatePassword(
  id,
  currentPassword,
  newPassword,
  confirmPassword,
  access_token
) {
  try {
    const bodyData = JSON.stringify({
      userId: id,
      currentPassword,
      newPassword,
      confirmPassword,
    });
    const response = await fetch(
      `${API_URL}/${API_USERS_PATH}/UpdateUserPassword`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        body: bodyData,
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
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getAll(access_token) {
  try {
    const response = await fetch(
      `${API_URL}/${API_USERS_PATH}?orderBy=UserIdentificationNumber`,
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
    return resData;
  } catch (error) {
    throw new Error(error.message);
  }
}
