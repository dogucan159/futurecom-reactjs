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
        throw new Error(resData.error_description);
      }
      return resData;
    } catch (error) {
      // return {
      //   isOk: false,
      //   message: error.message,
      // };
      throw new Error(error.message);
    }
  }
  