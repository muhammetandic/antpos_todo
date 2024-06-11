export type SignInRequest = {
  email: string;
  password: string;
  authType: "cookie" | "token";
};

export type SignInResponse = {
  token: string;
  email: string;
  expiresIn: Date;
};

export type SignUpRequest = {
  email: string;
  name: string;
};

export type SignUpResponse = {
  email: string;
  token: string;
};

export type SetPasswordRequest = {
  email: string;
  password: string;
  token: string;
  code: string;
};

export type SetPasswordResponse = Record<string, never>;

export type ForgottenPasswordRequest = {
  email: string;
};

export type ForgottenPasswordResponse = {
  email: string;
  token: string;
};
