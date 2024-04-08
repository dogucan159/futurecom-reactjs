export function getTokenDuration() {
  const tokenData = JSON.parse(localStorage.getItem("session-token"));
  const storedExpirationDate = new Date(tokenData.expiration);
  const now = new Date();
  const duration = storedExpirationDate.getTime() - now.getTime();
  return duration;
}

export function getToken() {
  const tokenData = JSON.parse(localStorage.getItem("session-token"));

  if (!tokenData || !tokenData.access_token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    tokenData.access_token = "EXPIRED";
  }

  return tokenData;
}

export function getUser() {
  return JSON.parse(localStorage.getItem("session-user"));
}
