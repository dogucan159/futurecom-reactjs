export async function getUserByIdentificationNumber(
  identificationNumber,
  access_token
) {
  try {
    const userResponse = await fetch(
      `https://localhost:7224/api/users/${identificationNumber}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );

    const resUserData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error(resUserData.error_description);
    }
    return resUserData;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getById(id, access_token) {
  try {
    const userResponse = await fetch(`https://localhost:7224/api/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    const resUserData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error(resUserData.error_description);
    }
    return resUserData;
  } catch (error) {
    throw new Error(error);
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
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}
