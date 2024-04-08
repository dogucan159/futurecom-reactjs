import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { refreshTokenData, signIn as sendSignInRequest } from "../api/auth";
import { getUser } from "../utils/auth";

function AuthProvider(props) {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  const refreshToken = useCallback(async () => {
    const result = await refreshTokenData();
    if (result.isOk) {
      setToken(result.tokenData);
    }
    return result;
  }, []);
  const signIn = useCallback(async (identificationNumber, password) => {
    const result = await sendSignInRequest(identificationNumber, password);
    if (result.isOk) {
      setUser(result.sessionUserData);
      setToken(result.tokenData);
    }

    return result;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("session-user");
    localStorage.removeItem("session-token");
    setUser(undefined);
    setToken(undefined);
  }, []);

  useEffect(() => {
    const sessionUserData = getUser();
    setUser(sessionUserData);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, signIn, signOut, refreshToken, loading }}
      {...props}
    />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
