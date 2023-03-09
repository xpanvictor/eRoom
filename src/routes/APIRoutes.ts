const APIRoutes = {
  userLogin: "/login",
  userRegister: "/register",
  userVerify: "/verify-user",
};

export type APIRoutesTitles = keyof typeof APIRoutes;
export type APIRoutesValues = typeof APIRoutes[APIRoutesTitles];

export default APIRoutes;
