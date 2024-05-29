export async function getAll(access_token) {
  try {
    const response = await fetch(
      `https://localhost:7224/api/institutions?orderBy=InstitutionName`,
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
