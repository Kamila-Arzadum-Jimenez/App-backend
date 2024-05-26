import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  json,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usuario = pgTable("usuario", {
  usuarioID: serial("usuarioID").primaryKey(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 128 }).notNull(),
  nombre: varchar("nombre", { length: 256 }).notNull(),
  nombreUsuario: varchar("nombreUsuario", { length: 256 }).notNull(),
  subNombre: varchar("subNombre", { length: 256 }).notNull(),
  bio: varchar("bio", { length: 256 }).default("").notNull(),
  imagen: text("imagen").notNull(),
  ciudad: varchar("ciudad", { length: 256 }).notNull(),
  telefono: varchar("telefono", { length: 256 }).notNull(),
  direccion: varchar("direccion", { length: 512 }),
});

export const perfilCelebridad = pgTable("perfilCelebridad", {
  perfilCelebridadID: serial("perfilCelebridadID").primaryKey(),
  genero: varchar("genero", { length: 32 }),
  plataformas: json("plataformas").notNull(),
  usuarioID: integer("usuarioID")
    .notNull()
    .references(() => usuario.usuarioID, {
      onDelete: "cascade",
    }), // Debería ser unique para evitar duplicados
  creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const perfilEmpresa = pgTable("perfilEmpresa", {
  perfilEmpresaID: serial("perfilEmpresaID").primaryKey(),
  productos: json("productos").notNull(),
  usuarioID: integer("usuarioID")
    .notNull()
    .references(() => usuario.usuarioID, {
      onDelete: "cascade",
    }),
  creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const post = pgTable("post", {
  postID: serial("postID").primaryKey(),
  descripcion: varchar("descripcion", { length: 256 }).notNull(),
  imagen: text("apellido").notNull(),
  usuarioID: integer("usuarioID")
    .notNull()
    .references(() => usuario.usuarioID, {
      onDelete: "cascade",
    }),
  creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const reaccion = pgTable(
  "reaccion",
  {
    postID: integer("postID")
      .notNull()
      .references(() => post.postID, {
        onDelete: "cascade",
      }),
    usuarioID: integer("usuarioID")
      .notNull()
      .references(() => usuario.usuarioID, {
        onDelete: "cascade",
      }),
    tipo: varchar("tipo", { length: 32 }),
    creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    pkReacciones: primaryKey({
      name: "pk_reacciones",
      columns: [t.postID, t.usuarioID],
    }),
  })
);

export const comentario = pgTable("comentario", {
  comentarioID: serial("comentarioID").primaryKey(),
  texto: varchar("texto", { length: 512 }).notNull(),
  usuarioID: integer("usuarioID")
    .notNull()
    .references(() => usuario.usuarioID, {
      onDelete: "cascade",
    }),
  postID: integer("postID")
    .notNull()
    .references(() => post.postID, {
      onDelete: "cascade",
    }),
  creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const ofertaFavorita = pgTable(
  "ofertaFavorita",
  {
    usuarioID: integer("usuarioID")
      .notNull()
      .references(() => usuario.usuarioID, {
        onDelete: "cascade",
      }),
    ofertaID: integer("ofertaID")
      .notNull()
      .references(() => oferta.ofertaID, {
        onDelete: "cascade",
      }),
    creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    pkOfertaFavorita: primaryKey({
      name: "pk_ofertaFavoritas",
      columns: [t.ofertaID, t.usuarioID],
    }),
  })
);

export const oferta = pgTable("oferta", {
  ofertaID: serial("ofertaID").primaryKey(),
  monto: numeric("monto"),
  descripcion: varchar("descripcion", { length: 512 }).notNull(),
  categoria: varchar("categoria", { length: 128 }).notNull(),
  ofertanteID: integer("ofertanteID")
    .notNull()
    .references(() => usuario.usuarioID, {
      onDelete: "cascade",
    }),
  fechaPlazo: timestamp("fechaPlazo", {
    precision: 3,
    mode: "string",
  }).notNull(),
  creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const solicitudOferta = pgTable(
  "solicitudOferta",
  {
    ofertaID: integer("ofertaID")
      .notNull()
      .references(() => oferta.ofertaID, {
        onDelete: "cascade",
      }),
    solicitanteID: integer("solicitanteID")
      .notNull()
      .references(() => usuario.usuarioID, {
        onDelete: "cascade",
      }),
    creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    pkSolicitudOferta: primaryKey({
      name: "pk_solicitudOfertass",
      columns: [t.ofertaID, t.solicitanteID],
    }),
  })
);

export const notificacion = pgTable("notificacion", {
  notificacionID: serial("notificacionID").primaryKey(),
  tipo: varchar("categoria", { length: 64 }).notNull(),
  visto: boolean("visto").notNull(),
  causadorID: integer("causadorID").references(() => usuario.usuarioID, {
    onDelete: "cascade",
  }),
  usuarioID: integer("destinoUsuarioID")
    .notNull()
    .references(() => usuario.usuarioID, {
      onDelete: "cascade",
    }),
  creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const contratoOferta = pgTable(
  "contratoOferta",
  {
    ofertaID: integer("ofertaID")
      .notNull()
      .references(() => oferta.ofertaID, {
        onDelete: "cascade",
      }),
    contratadoID: integer("contratadoID")
      .notNull()
      .references(() => usuario.usuarioID, {
        onDelete: "cascade",
      }),
    ofertanteID: integer("ofertanteID")
      .notNull()
      .references(() => usuario.usuarioID, {
        onDelete: "cascade",
      }),
    puntuacion: integer("puntuacion"),
    creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    pkContratoOferta: primaryKey({
      name: "pk_contrato_ofertass",
      columns: [t.ofertaID, t.ofertanteID, t.contratadoID],
    }),
  })
);

export const usuarioRelaciones = relations(usuario, ({ one, many }) => ({
  perfilCelebridad: one(perfilCelebridad, {
    fields: [usuario.usuarioID],
    references: [perfilCelebridad.usuarioID],
  }),
  posts: many(post),
  perfilEmpresa: one(perfilEmpresa, {
    fields: [usuario.usuarioID],
    references: [perfilEmpresa.usuarioID],
  }),
  ofertasFavoritas: many(ofertaFavorita),
}));

export const postRelaciones = relations(post, ({ one, many }) => ({
  usuario: one(usuario, {
    fields: [post.usuarioID],
    references: [usuario.usuarioID],
  }),
  reacciones: many(reaccion),
  comentarios: many(comentario),
}));

export const ofertaRelaciones = relations(oferta, ({ one, many }) => ({
  usuario: one(usuario, {
    fields: [oferta.ofertanteID],
    references: [usuario.usuarioID],
  }),
  contrato: one(contratoOferta),
  favoritoPor: many(ofertaFavorita),
  postulantes: many(solicitudOferta),
}));

export const solicitudOfertaRelaciones = relations(
  solicitudOferta,
  ({ one }) => ({
    solicitante: one(usuario, {
      fields: [solicitudOferta.solicitanteID],
      references: [usuario.usuarioID],
    }),
    oferta: one(oferta, {
      fields: [solicitudOferta.ofertaID],
      references: [oferta.ofertaID],
    }),
  })
);

export const reaccionRelaciones = relations(reaccion, ({ one }) => ({
  post: one(post, {
    fields: [reaccion.postID],
    references: [post.postID],
  }),
  usuario: one(usuario, {
    fields: [reaccion.usuarioID],
    references: [usuario.usuarioID],
  }),
}));

export const contratoOfertaRelaciones = relations(
  contratoOferta,
  ({ one }) => ({
    contratado: one(usuario, {
      fields: [contratoOferta.contratadoID],
      references: [usuario.usuarioID],
    }),
    ofertante: one(usuario, {
      fields: [contratoOferta.ofertanteID],
      references: [usuario.usuarioID],
    }),
    oferta: one(oferta, {
      fields: [contratoOferta.ofertaID],
      references: [oferta.ofertaID],
    }),
  })
);

export const ofertaFavoritaRelaciones = relations(
  ofertaFavorita,
  ({ one }) => ({
    usuario: one(usuario, {
      fields: [ofertaFavorita.usuarioID],
      references: [usuario.usuarioID],
    }),
    oferta: one(oferta, {
      fields: [ofertaFavorita.ofertaID],
      references: [oferta.ofertaID],
    }),
  })
);

export const comentarioRelaciones = relations(comentario, ({ one }) => ({
  post: one(post, {
    fields: [comentario.postID],
    references: [post.postID],
  }),
  usuario: one(usuario, {
    fields: [comentario.usuarioID],
    references: [usuario.usuarioID],
  }),
}));

export const notificacionRelaciones = relations(notificacion, ({ one }) => ({
  causador: one(usuario, {
    fields: [notificacion.causadorID],
    references: [usuario.usuarioID],
  }),
}));

// export const lineaTransporteRelaciones = relations(
//   lineaTransporte,
//   ({ many }) => ({
//     vehiculoLineaTransporte: many(vehiculoLineaTransporte),
//   })
// );

// export const vehiculoLineaTransporteRelaciones = relations(
//   vehiculoLineaTransporte,
//   ({ one }) => ({
//     vehiculo: one(vehiculo, {
//       fields: [vehiculoLineaTransporte.vehiculoID],
//       references: [vehiculo.vehiculoID],
//     }),
//     user: one(lineaTransporte, {
//       fields: [vehiculoLineaTransporte.lineaTransporteID],
//       references: [lineaTransporte.lineaTransporteID],
//     }),
//   })
// );
