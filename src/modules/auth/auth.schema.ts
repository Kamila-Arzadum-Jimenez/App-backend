import { Static, Type } from "@sinclair/typebox";
import {
  InsertCelebritySchema,
  InsertCompanySchema,
  InsertUserSchema,
  SelectCompleteProfileUser,
  SelectUserSchema,
} from "../user/user.schema";

// ESQUEMA DE REGISTRAR CELEBRIDAD
export type RegisterCelebrityType = Static<typeof PostCelebritySchemaBody>;
export const PostCelebritySchemaBody = Type.Object({
  usuario: InsertUserSchema,
  celebridad: Type.Omit(InsertCelebritySchema, ["usuarioID"]),
});

export const PostCelebritySchema = {
  body: PostCelebritySchemaBody,
};

// ESQUEMA DE REGISTRAR EMPRESA
export type RegisterCompanyType = Static<typeof PostCompanyBody>;
export const PostCompanyBody = Type.Object({
  usuario: InsertUserSchema,
  empresa: Type.Omit(InsertCompanySchema, ["usuarioID"]),
});

export const PostCompanySchema = {
  body: PostCompanyBody,
};

// ESQUEMA DE LOGIN
export type LoginRequestType = Static<typeof LoginRequestSchema>;
export const LoginRequestSchema = Type.Object({
  password: Type.String(),
  email: Type.String({ format: "email" }),
});
export const LoginRequestResponse = Type.Object({
  usuario: SelectCompleteProfileUser,
  token: Type.String(),
  esEmpresa: Type.Boolean(),
});

export const LoginSchema = {
  body: LoginRequestSchema,
  response: {
    200: LoginRequestResponse,
  },
};
