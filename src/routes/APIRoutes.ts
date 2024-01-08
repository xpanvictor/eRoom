const APIRoutes = {
  // ------ USER Routes -------
  userLogin: "/login",
  userRegister: "/register",
  userVerify: "/verify-user",
  // ------ COURSE Routes -----
  createCourse: "/create-course",
};

export type APIRoutesTitles = keyof typeof APIRoutes;
export type APIRoutesValues = typeof APIRoutes[APIRoutesTitles];

export default APIRoutes;
