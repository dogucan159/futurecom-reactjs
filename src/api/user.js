export async function getUserByIdentificationNumber(identificationNumber, access_token) {
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
