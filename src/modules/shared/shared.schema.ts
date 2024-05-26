import { Type } from "@sinclair/typebox";

export const AuthTokenSchema = Type.Object({
  authorization: Type.String(),
});
