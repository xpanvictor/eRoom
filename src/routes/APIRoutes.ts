const APIRoutes = {
  userLogin: "/login",
  userRegister: "/register",
};

export type APIRoutesTitles = keyof typeof APIRoutes;
export type APIRoutesValues = typeof APIRoutes[APIRoutesTitles];

export default APIRoutes;
