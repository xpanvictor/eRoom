enum IUserType {
  student,
  instructor,
}

interface IClassesBelonged {
  // unique class Id to identify class
  class_id: string;
  // type user is in class
  user_type: IUserType;
}

interface IUser {
  // compulsory id of the user
  id: string;
  // the user's name
  name: string;
  // email of the user
  email: string;
  // classes: Aligns to array of user's classes with type of membership
  classes: Array<IClassesBelonged>;
  // todo: map out remaining user type
}

export default IUser;
