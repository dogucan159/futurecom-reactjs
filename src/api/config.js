export async function getAll(access_token) {
  try {
    const response = await fetch(
      `https://localhost:7224/api/configs?orderBy=ConfigKey`,
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

export async function update(data, access_token) {
    try {
      const response = await fetch(
        `https://localhost:7224/api/configs`,
        {
          method: "PUT",
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
