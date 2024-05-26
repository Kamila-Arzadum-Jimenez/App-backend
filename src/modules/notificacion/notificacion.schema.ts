import { Static, Type } from "@sinclair/typebox";
import { AuthTokenSchema } from "../shared/shared.schema";

// ESQUEMA DE OBTENER NOTIFICACIONES
export type SelectNotificacionType = Static<typeof SelectNotificacionSchema>;
export const SelectNotificacionSchema = Type.Object({
  notificacionID: Type.Number(),
  usuarioID: Type.Number(),
  causadorID: Type.Optional(Type.Number()),
  tipo: Type.String(),
  visto: Type.Boolean(),
  causador: Type.Optional(
    Type.Object({
      usuarioID: Type.Number(),
      nombreUsuario: Type.String(),
      imagen: Type.String(),
    })
  ),
  creadoEn: Type.String(),
});
export const GetNotificacionesResponse = Type.Object({
  list: Type.Array(SelectNotificacionSchema),
});

export const GetNotificacionesSchema = {
  headers: AuthTokenSchema,
  response: {
    200: GetNotificacionesResponse,
  },
};

// ESQUEMA DE INSERTAR NOTIFICACIÓN
const PostNotificationSchema = Type.Omit(SelectNotificacionSchema, [
  "visto",
  "causador",
  "creadoEn",
  "notificacionID",
]);

export type InsertNotificacionType = Static<typeof PostNotificationSchema>;
export type InsertNofificacionComentario = {
  causadorID: number;
  postID: number;
  tipo: "reaccion" | "comentario";
};

export type InsertNofificacionPorContratoType = {
  causadorID: number;
  ofertaID: number;
  tipo: "aceptado";
};
