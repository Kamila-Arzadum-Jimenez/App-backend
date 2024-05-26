import { Static, Type } from "@sinclair/typebox";
import { AuthTokenSchema } from "../shared/shared.schema";

// ESQUEMAS ÚTILES RELACIONADOS A USUARIO
export type SelectUserType = Static<typeof InsertUserSchema>;
export type InsertUserType = Static<typeof InsertUserSchema>;
export type InsertCelebrityType = Omit<
  Static<typeof InsertCelebritySchema>,
  "perfilCelebridadID"
>;

export type InsertCompanyType = Omit<
  Static<typeof InsertCompanySchema>,
  "perfilEmpresaID"
>;

export const SelectUserSchema = Type.Object({
  usuarioID: Type.Number(),
  email: Type.String({ format: "email" }),
  nombre: Type.String(),
  password: Type.String(),
  bio: Type.Optional(Type.String()),
  nombreUsuario: Type.String(),
  subNombre: Type.String(),
  imagen: Type.String(),
  ciudad: Type.String(),
  telefono: Type.String(),
  direccion: Type.String(),
});

export const SelectCelebrityProfile = Type.Object({
  perfilCelebridadID: Type.Number(),
  genero: Type.String(),
  plataformas: Type.String(),
  usuarioID: Type.Number(),
});

export const SelectCompanyProfile = Type.Object({
  perfilEmpresaID: Type.Number(),
  productos: Type.String(),
  usuarioID: Type.Number(),
});

export const InsertUserSchema = Type.Omit(SelectUserSchema, ["usuarioID"]);
export const InsertCelebritySchema = Type.Omit(SelectCelebrityProfile, [
  "perfilCelebridadID",
]);
export const UpdateUserSchema = Type.Omit(InsertUserSchema, [
  "email",
  "password",
]);
export const InsertCompanySchema = Type.Omit(SelectCompanyProfile, [
  "perfilEmpresaID",
]);

// ESQUEMA DE EDITAR PERFIL DE CELEBRIDAD
export const UpdateCelebritySchema = Type.Omit(InsertCelebritySchema, [
  "usuarioID",
]);
export const UpdateUserCelebrityBody = Type.Object({
  usuario: UpdateUserSchema,
  perfilCelebridad: UpdateCelebritySchema,
});
export const UpdateUserCelebritySchema = {
  headers: AuthTokenSchema,
  body: UpdateUserCelebrityBody,
};
export type UpdateUserCelebrityType = Static<typeof UpdateUserCelebrityBody>;

// ESQUEMA DE EDITAR PERFIL DE EMPRESA
export const UpdateCompanySchema = Type.Omit(InsertCompanySchema, [
  "usuarioID",
]);
export const UpdateUserCompanyBody = Type.Object({
  usuario: UpdateUserSchema,
  perfilEmpresa: UpdateCompanySchema,
});
export const UpdateUserCompanySchema = {
  headers: AuthTokenSchema,
  body: UpdateUserCompanyBody,
};
export type UpdateUserCompanyType = Static<typeof UpdateUserCompanyBody>;

// ESQUEMA DE OBTENER PERFIL COMPLETO
export const SelectCompleteProfileUser = Type.Object({
  usuarioID: Type.Number(),
  nombre: Type.String(),
  nombreUsuario: Type.String(),
  subNombre: Type.String(),
  bio: Type.String(),
  imagen: Type.String(),
  ciudad: Type.String(),
  telefono: Type.String(),
  direccion: Type.String(),
  perfilEmpresa: Type.Optional(
    Type.Object({
      perfilEmpresaID: Type.Number(),
      productos: Type.Unknown(),
      usuarioID: Type.Number(),
    })
  ),
  perfilCelebridad: Type.Optional(
    Type.Object({
      perfilCelebridadID: Type.Number(),
      genero: Type.String(),
      plataformas: Type.Unknown(),
      usuarioID: Type.Number(),
    })
  ),
});

export const SelectCelebrityProfileQuery = Type.Object({
  usuarioID: Type.Number(),
});

export const SelectCompleteProfileSchema = {
  headers: AuthTokenSchema,
  querystring: SelectCelebrityProfileQuery,
  response: {
    200: SelectCompleteProfileUser,
  },
};

// ESQUEMA PARA OBTENER CONTRATOS DE CELEBRIDAD

const GetContratosUsuarioSchema = Type.Object({
  nombre: Type.String(),
  nombreUsuario: Type.String(),
  subNombre: Type.String(),
  telefono: Type.String(),
  ciudad: Type.String(),
});
export const GetContratosCelebridadSchemaBody = Type.Object({
  creadoEn: Type.String(),
  ofertaID: Type.Number(),
  ofertanteID: Type.Number(),
  contratadoID: Type.Number(),
  oferta: Type.Object({
    descripcion: Type.String(),
    ofertaID: Type.Number(),
    monto: Type.String(),
    categoria: Type.String(),
    fechaPlazo: Type.String(),
  }),
  ofertante: GetContratosUsuarioSchema,
});

export const GetContratosCelebridadSchema = {
  headers: AuthTokenSchema,
  response: {
    200: Type.Object({ list: Type.Array(GetContratosCelebridadSchemaBody) }),
  },
};

// ESQUEMA PARA OBTENER CONTRATOS DE EMPRESA
export const GetContratosEmpresaSchemaBody = Type.Object({
  creadoEn: Type.String(),
  ofertaID: Type.Number(),
  ofertanteID: Type.Number(),
  contratadoID: Type.Number(),
  puntuacion: Type.Union([Type.Null(), Type.Number()]),
  oferta: Type.Object({
    descripcion: Type.String(),
    ofertaID: Type.Number(),
    monto: Type.String(),
    categoria: Type.String(),
    fechaPlazo: Type.String(),
  }),
  contratado: GetContratosUsuarioSchema,
});

export const GetContratosEmpresaSchema = {
  headers: AuthTokenSchema,
  response: {
    200: Type.Object({ list: Type.Array(GetContratosEmpresaSchemaBody) }),
  },
};

// ESQUEMA DE ESTADÍSTICAS DE USUARIO
export const GetEstadisticasUsuarioSchemaResponse = Type.Object({
  postsCreados: Type.Number(),
  reacciones: Type.Number(),
  comentarios: Type.Number(),
  seguidores: Type.Number(),
  ganancias: Type.Number(),
  reaccionesTimestamps: Type.Array(
    Type.Object({
      timestamp: Type.String(),
      count: Type.Number(),
    })
  ),
});

export const GetEstadisticasUsuarioSchema = {
  headers: AuthTokenSchema,
  response: {
    200: GetEstadisticasUsuarioSchemaResponse,
  },
};
