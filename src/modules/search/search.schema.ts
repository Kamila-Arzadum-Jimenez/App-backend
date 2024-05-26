import { Type } from "@sinclair/typebox";
import { SelectOfertaSchema } from "../oferta/oferta.schema";

const SelectUserSchema = Type.Object({
  usuarioID: Type.Number(),
  nombre: Type.String(),
  nombreUsuario: Type.String(),
  subNombre: Type.String(),
  imagen: Type.String(),
  ciudad: Type.String(),
  telefono: Type.String(),
});
// ESQUEMA DE BUSCAR USUARIOS
export const GetSearchUsersQuery = Type.Object({
  query: Type.Optional(Type.String()),
});

export const GetSearchUsersSchema = {
  querystring: GetSearchUsersQuery,
  response: {
    200: Type.Object({ list: Type.Array(SelectUserSchema) }),
  },
};

// ESQUEMA DE BUSCAR OFERTAS
export const GetSearchOffersQuery = Type.Object({
  query: Type.Optional(Type.String()),
});

const GetSearchOffersResponse = Type.Object({
  list: Type.Array(SelectOfertaSchema),
});
export const GetSearchOffersSchema = {
  querystring: GetSearchOffersQuery,
  response: {
    200: GetSearchOffersResponse,
  },
};
