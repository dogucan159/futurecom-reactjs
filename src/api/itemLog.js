export async function create(data, access_token) {
  try {
    const response = await fetch("https://localhost:7224/api/itemlogs", {
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
export async function createMulti(data, access_token) {
  try {
    const response = await fetch(
      "https://localhost:7224/api/itemlogs/CreateMultipleItemLogs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        body: data,
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
export async function getByUserLogId(id, access_token) {
  try {
    const response = await fetch(
      `https://localhost:7224/api/itemLogs/GetItemLogsByUserLogId?userLogId=${id}`,
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
