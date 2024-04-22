export async function getUserByIdentificationNumber(
  identificationNumber,
  access_token
) {
  try {
    const response = await fetch(
      `https://localhost:7224/api/users/${identificationNumber}`,
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

export async function getById(id, access_token) {
  try {
    const response = await fetch(`https://localhost:7224/api/users/${id}`, {
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

export async function update(user, access_token) {
  try {
    const response = await fetch("https://localhost:7224/api/users", {
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
      "https://localhost:7224/api/users/UpdateUserPassword",
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
