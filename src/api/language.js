export async function getAll(access_token) {
    try {
      const response = await fetch(
        `https://localhost:7224/api/languages?orderBy=LanguageCode`,
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
  