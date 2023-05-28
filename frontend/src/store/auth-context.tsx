import {
  ACCESS_TOKEN,
  CASBIN_POLICIES,
  COOKIE_COMPANY_ID,
  LOGIN_DATA,
  USER,
} from 'constant/cookies';
import Cookies from 'js-cookie';
import React, { useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from 'services/users';
import {
  getUserPolicies,
  login,
  logout,
  updateCompanyId,
  updateHeaders,
} from 'services/auth';

type AuthContextProps = {
  user: User | null;
  policies: CasbinPolicies | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean | null;
  // protector: () => Promise<void>;
  loginHandler: (email: string, password: string) => Promise<void>;
  updateUserInfo: () => void;
  logoutHandler: () => void;
};

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  policies: null,
  accessToken: '',
  refreshToken: '',
  isAuth: null,
  // protector: async () => {},
  loginHandler: async () => {},
  logoutHandler: () => {},
  updateUserInfo: () => {},
});

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loginData, setLoginData] = useState<LoginResponse | null>(null);
  const [policies, setPolicies] = useState<CasbinPolicies | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuth, setAuth] = useState<boolean | null>(null);
  // const redirectURL = useSelector((state) => state.ui.redirectURL);

  const loginHandler = async (email: string, password: string) => {
    try {
      const loginData = await login(email, password);
      const d = new Date();
      d.setSeconds(d.getSeconds() + loginData.expiresIn);
      loginData.expiresIn = d.getTime();
      console.log(loginData);
      updateHeaders(loginData.accessToken);
      const user = await getMyProfile();
      const policies = await getUserPolicies();
      Cookies.set(USER, JSON.stringify(user));
      Cookies.set(ACCESS_TOKEN, loginData.accessToken);
      Cookies.set(LOGIN_DATA, JSON.stringify(loginData));
      Cookies.set(CASBIN_POLICIES, JSON.stringify(policies));
      Cookies.set(COOKIE_COMPANY_ID, user.companyId.toString());

      updateCompanyId(user.companyId);
      setUser(user);
      setPolicies(policies);
      setAccessToken(loginData.accessToken);
      setAuth(true);
      if (user.role.desc === 'user') navigate('/');
      if (user.role.desc === 'admin') navigate('/company/exams-projects');
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const updateUserInfo = async () => {
    try {
      const user = await getMyProfile();
      setUser(user);
      Cookies.set(USER, JSON.stringify(user));
    } catch (err) {
      throw err;
    }
  };

  const logoutHandler = () => {
    if (loginData) {
      logout(loginData.sessionId);
    }
    updateHeaders('');
    updateCompanyId(0);
    Cookies.remove(USER);
    Cookies.remove(LOGIN_DATA);
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(COOKIE_COMPANY_ID);

    setUser(null);
    setLoginData(null);
    setAccessToken(null);
    setPolicies(null);
    setAuth(false);
    navigate('/login');
  };

  const sessionTimeout = () => {
    // if (loginData) {
    //   const expiresIn = new Date(loginData.expiresIn * 1000).getTime();
    //   const timeNow = Date.now();
    //   const remainingTime = expiresIn - timeNow;
    //   setTimeout(() => {
    //     logoutHandler();
    //   }, remainingTime);
    // }
  };

  useEffect(() => {
    const userJSON = Cookies.get(USER);
    const loginDataJSON = Cookies.get(LOGIN_DATA);
    const accessToken = Cookies.get(ACCESS_TOKEN);
    const policiesJSON = Cookies.get(CASBIN_POLICIES);
    const companyId = Cookies.get(COOKIE_COMPANY_ID);

    if (userJSON && loginDataJSON && accessToken && policiesJSON && companyId) {
      const userInfo: User = JSON.parse(userJSON);
      const policies: CasbinPolicies = JSON.parse(policiesJSON);
      const loginData: LoginResponse = JSON.parse(loginDataJSON);

      const expiresIn = new Date(loginData.expiresIn).getTime();
      const timeNow = Date.now();
      const remainingTime = expiresIn - timeNow;
      // less than a 5 minutes
      if (remainingTime <= 60 * 5) {
        return logoutHandler();
      }

      updateHeaders(loginData.accessToken);
      updateCompanyId(+companyId);
      setUser(userInfo);
      setPolicies(policies);
      setLoginData(loginData);
      setAccessToken(loginData.accessToken);
      setAuth(true);
      sessionTimeout();
    } else {
      logoutHandler();
    }
  }, []);

  const contextValue: AuthContextProps = {
    user,
    policies,
    accessToken,
    refreshToken: null,
    isAuth,
    // protector,
    loginHandler,
    logoutHandler,
    updateUserInfo,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
