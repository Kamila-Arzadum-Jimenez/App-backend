import { Static, Type } from "@sinclair/typebox";
import { AuthTokenSchema } from "../shared/shared.schema";

// ESQUEMA PARA CREAR OFERTA
export const SelectOfertaSchema = Type.Object({
  ofertaID: Type.Number(),
  ofertanteID: Type.Number(),
  monto: Type.String(),
  descripcion: Type.String(),
  categoria: Type.String(),
  fechaPlazo: Type.String(),
  creadoEn: Type.String(),
  usuario: Type.Object({
    usuarioID: Type.Number(),
    direccion: Type.String(),
    ciudad: Type.String(),
    nombre: Type.String(),
    nombreUsuario: Type.String(),
    subNombre: Type.String(),
    imagen: Type.String(),
  }),
  favoritoPor: Type.Array(Type.Number()),
});

export const InsertOfertaSchema = Type.Omit(SelectOfertaSchema, [
  "ofertaID",
  "creadoEn",
  "usuario",
  "favoritoPor",
]);
export const InsertOfertaSchemaBody = Type.Omit(InsertOfertaSchema, [
  "ofertanteID",
]);
export type InsertOfertaType = Static<typeof InsertOfertaSchema>;

export const PostOfertaSchema = {
  headers: AuthTokenSchema,
  body: InsertOfertaSchemaBody,
  response: {
    200: SelectOfertaSchema,
  },
};

// ESQUEMA PARA GUARDAR OFERTA FAVORITA
export type InsertOfertaFavoritaType = Static<typeof InsertOfertaFavorita>;

const InsertOfertaFavorita = Type.Object({
  ofertaID: Type.Number(),
  usuarioID: Type.Number(),
});
const PostOfertaFavoritaSchemaBody = Type.Object({
  ofertaID: Type.Number(),
});
const PostOfertaFavoritaSchemaResponse = Type.Object({
  esFavorito: Type.Boolean(),
});
export const PostOfertaFavoritaSchema = {
  headers: AuthTokenSchema,
  body: PostOfertaFavoritaSchemaBody,
  response: {
    200: PostOfertaFavoritaSchemaResponse,
  },
};

// ESQUEMA PARA OBTENER OFERTAS FAVORITAS
export const GetAllOfertaFavoritaSchema = {
  headers: AuthTokenSchema,
  response: {
    200: Type.Object({ list: Type.Array(SelectOfertaSchema) }),
  },
};

// ESQUEMA PARA POSTULAR A OFERTA
export type InsertSolicitudOfertaType = Static<typeof InsertSolicitudOferta>;

const InsertSolicitudOferta = Type.Object({
  ofertaID: Type.Number(),
  solicitanteID: Type.Number(),
});
const PostSolicitudOfertaSchemaBody = Type.Object({
  ofertaID: Type.Number(),
});
const PostSolicitudOfertaSchemaResponse = Type.Object({
  guardado: Type.Boolean(),
});
export const PostSolicitudOfertaSchema = {
  headers: AuthTokenSchema,
  body: PostSolicitudOfertaSchemaBody,
  response: {
    200: PostSolicitudOfertaSchemaResponse,
  },
};

// ESQUEMA PARA OBTENER POSTULACIONES DE USUARIO - SOLO ID
export const GetSolicitudesOfertaSchema = {
  headers: AuthTokenSchema,
  response: {
    200: Type.Object({ list: Type.Array(Type.Number()) }),
  },
};

// ESQUEMA PARA OBTENER POSTULACIONES CON POSTULANTES - USADO POR EMPRESAS
const GetPostulantesOfertaResponse = Type.Object({
  postulantes: Type.Array(
    Type.Object({
      usuarioID: Type.Number(),
      nombre: Type.String(),
      nombreUsuario: Type.String(),
      subNombre: Type.String(),
    })
  ),
  creadoEn: Type.String(),
  descripcion: Type.String(),
  ofertaID: Type.Number(),
  monto: Type.String(),
});

export const GetSolicitudesOfertaPostulantesSchema = {
  headers: AuthTokenSchema,
  response: {
    200: Type.Object({
      list: Type.Array(GetPostulantesOfertaResponse),
    }),
  },
};

// ESQUEMA PARA CONTRATAR INFLUENCER
export type InsertContratoOferta = Static<typeof InsertContratoOfertaSchema>;

const InsertContratoOfertaSchema = Type.Object({
  ofertanteID: Type.Number(),
  ofertaID: Type.Number(),
  contratadoID: Type.Number(),
});

const PostContratarCelebridadSchemaBody = Type.Omit(
  InsertContratoOfertaSchema,
  ["ofertanteID"]
);

export const PostContratarCelebridadSchema = {
  headers: AuthTokenSchema,
  body: PostContratarCelebridadSchemaBody,
  response: {
    200: Type.Object({}),
  },
};

// ESQUEMA PARA DEJAR REVIEW INFLUENCER
export type UpdateReviewOfertaType = Static<typeof UpdateReviewOfertaSchema>;

const UpdateReviewOfertaSchema = Type.Object({
  ofertanteID: Type.Number(),
  ofertaID: Type.Number(),
  contratadoID: Type.Number(),
  puntuacion: Type.Number(),
});

const PutReviewOfertaSchemaBody = Type.Omit(UpdateReviewOfertaSchema, [
  "ofertanteID",
]);

export const PutReviewOfertaSchema = {
  headers: AuthTokenSchema,
  body: PutReviewOfertaSchemaBody,
  response: {
    200: Type.Object({}),
  },
};
