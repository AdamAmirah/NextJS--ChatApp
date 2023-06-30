import jwt, { JwtPayload } from "jsonwebtoken";
interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1h",
};

export const signJwtAccessToken = (
  payload: JwtPayload,
  options: SignOption = DEFAULT_SIGN_OPTION
) => {
  const secret_key = process.env.SECRET_KEY as string;
  return jwt.sign(payload, secret_key, options);
};
