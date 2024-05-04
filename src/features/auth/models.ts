export type SignUp = {
  email: string;
  name: string;
};

export type SetPassword = {
  email: string;
  password: string;
  token: string;
};

export type ForgottenPassword = {
  email: string;
};
