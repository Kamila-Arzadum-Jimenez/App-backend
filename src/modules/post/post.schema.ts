import { Static, Type } from "@sinclair/typebox";
import { AuthTokenSchema } from "../shared/shared.schema";

// ESQUEMAS IMPORTANTES

const SelectComentarioSchema = Type.Object({
  comentarioID: Type.Number(),
  postID: Type.Number(),
  usuarioID: Type.Number(),
  texto: Type.String(),
  creadoEn: Type.String(),
  usuario: Type.Object({
    usuarioID: Type.Number(),
    imagen: Type.String(),
    nombreUsuario: Type.String(),
  }),
});

// ESQUEMA DE OBTENER TODOS LOS POSTS
export const SelectAllPostBody = Type.Object({
  postID: Type.Number(),
  usuarioID: Type.Number(),
  descripcion: Type.String(),
  imagen: Type.String(),
  reacciones: Type.Array(Type.Number()),
  usuario: Type.Object({
    usuarioID: Type.Number(),
    nombre: Type.String(),
    nombreUsuario: Type.String(),
    subNombre: Type.String(),
    imagen: Type.String(),
  }),
});
export const SelectAllPostResponse = {
  list: Type.Array(SelectAllPostBody),
};
export const SelectAllPostSchema = {
  response: {
    200: SelectAllPostResponse,
  },
};

// ESQUEMA DE CREAR POST
export type InsertPostType = Static<typeof InsertPostBody>;
export const InsertPostBody = Type.Omit(SelectAllPostBody, [
  "postID",
  "usuario",
  "reacciones",
]);
export const InsertPostSchema = {
  headers: AuthTokenSchema,
  body: Type.Omit(InsertPostBody, ["usuarioID"]),
};

// ESQUEMA DE REACCIONAR A POST
export type InsertReactionType = Static<typeof InsertReactionSchema>;
export const InsertReactionSchema = Type.Object({
  postID: Type.Number(),
  usuarioID: Type.Number(),
});

export const PostReactionSchemaBody = Type.Omit(InsertReactionSchema, [
  "usuarioID",
]);
export const PostReactionSchema = {
  headers: AuthTokenSchema,
  body: PostReactionSchemaBody,
  response: {
    200: Type.Object({
      reaccionExiste: Type.Boolean(),
    }),
  },
};

// ESQUEMA DE COMENTAR UN POST
export type InsertComentarioType = Static<typeof InsertComentarioSchema>;
export const InsertComentarioSchema = Type.Object({
  postID: Type.Number(),
  usuarioID: Type.Number(),
  texto: Type.String(),
});

export const PostComentarioSchemaBody = Type.Omit(InsertComentarioSchema, [
  "usuarioID",
]);
export const PostComentarioSchema = {
  headers: AuthTokenSchema,
  body: PostComentarioSchemaBody,
  response: {
    200: Type.Omit(SelectComentarioSchema, ["usuario"]),
  },
};

// ESQUEMA DE OBTENER COMENTARIOS DE UN POST
export const GetComentariosPostSchemaBody = Type.Object({
  postID: Type.Number(),
});
export const GetComentariosPostSchema = {
  headers: AuthTokenSchema,
  querystring: GetComentariosPostSchemaBody,
  response: {
    200: Type.Object({
      list: Type.Array(Type.Omit(SelectComentarioSchema, ["postID"])),
    }),
  },
};
