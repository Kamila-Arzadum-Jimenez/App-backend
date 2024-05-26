import { and, eq, isNull } from "drizzle-orm";
import { SharedRepository } from "../shared/shared.repository";
import {
  InsertContratoOferta,
  InsertOfertaFavoritaType,
  InsertOfertaType,
  InsertSolicitudOfertaType,
  UpdateReviewOfertaType,
} from "./oferta.schema";
import { schema } from "@api/plugins/db";
import { NotificacionService } from "../notificacion/notificacion.service";

export class OfertaService extends SharedRepository {
  constructor() {
    super();
    this.notificacionService = new NotificacionService();
  }
  private notificacionService: NotificacionService;

  async create(oferta: InsertOfertaType) {
    await this.db.insert(schema.oferta).values(oferta);
  }

  async toggleFavorite(data: InsertOfertaFavoritaType) {
    let isFavorite = true;
    try {
      await this.db.insert(schema.ofertaFavorita).values(data);
    } catch (e) {
      isFavorite = false;
      await this.db
        .delete(schema.ofertaFavorita)
        .where(
          and(
            eq(schema.ofertaFavorita.ofertaID, data.ofertaID),
            eq(schema.ofertaFavorita.usuarioID, data.usuarioID)
          )
        );
    }
    return isFavorite;
  }

  async allFavorites(usuarioID: number) {
    const result = await this.db.query.ofertaFavorita.findMany({
      columns: {},
      where: eq(schema.ofertaFavorita.usuarioID, usuarioID),
      with: {
        oferta: {
          with: {
            usuario: {
              columns: {
                usuarioID: true,
                nombre: true,
                subNombre: true,
                nombreUsuario: true,
                imagen: true,
                direccion: true,
                ciudad: true,
              },
            },
            favoritoPor: {
              columns: {
                usuarioID: true,
              },
            },
          },
        },
      },
    });
    const flat = result.map((r) => ({
      ...r.oferta,
      favoritoPor: r.oferta.favoritoPor.map((f) => f.usuarioID),
    }));
    return flat;
  }

  async postular(data: InsertSolicitudOfertaType) {
    await this.db.insert(schema.solicitudOferta).values(data);
    return true;
  }

  async solicitudesIDs(usuarioID: number) {
    const solicitudes = await this.db.query.solicitudOferta.findMany({
      where: eq(schema.solicitudOferta.solicitanteID, usuarioID),
    });

    const flat = solicitudes.map((s) => s.ofertaID);
    return flat;
  }

  async ofertasConPostulantes(usuarioID: number) {
    const ofertas = await this.db.query.oferta.findMany({
      where: and(eq(schema.oferta.ofertanteID, usuarioID)),
      with: {
        contrato: { columns: { contratadoID: true } },
        postulantes: {
          with: {
            solicitante: {
              columns: {
                usuarioID: true,
                nombre: true,
                nombreUsuario: true,
                subNombre: true,
              },
            },
          },
        },
      },
    });

    const flat = ofertas.map((o) => ({
      ...o,
      postulantes: o.postulantes.map((p) => p.solicitante),
    }));
    // TODO: PREGUNTAR COMO HACER QUERY PARA BUSCAR 'contrato' NULL
    // FILTRANDO DESDE LA BASE DE DATOS Y NO COMO ACA
    const filter = flat.filter((o) => o.contrato === null);
    return filter;
  }

  async contratarCelebridad(data: InsertContratoOferta) {
    await this.db.insert(schema.contratoOferta).values(data);
    this.notificacionService.crearNotificacionPorContrato({
      causadorID: data.ofertanteID,
      ofertaID: data.ofertaID,
      tipo: "aceptado",
    });
    return true;
  }

  async reviewContrato(data: UpdateReviewOfertaType) {
    await this.db
      .update(schema.contratoOferta)
      .set({
        puntuacion: data.puntuacion,
      })
      .where(
        and(
          eq(schema.contratoOferta.ofertanteID, data.ofertanteID),
          eq(schema.contratoOferta.contratadoID, data.contratadoID),
          eq(schema.contratoOferta.ofertaID, data.ofertaID)
        )
      );
    return true;
  }
}
