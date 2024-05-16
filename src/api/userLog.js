export async function partially_update(id, data, access_token) {
  try {
    console.log(id);
    const response = await fetch(`https://localhost:7224/api/userlogs/${id}`, {
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
