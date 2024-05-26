import { SharedRepository } from "../shared/shared.repository";
import { schema } from "@api/plugins/db";
import {
  InsertNofificacionComentario,
  InsertNofificacionPorContratoType,
  InsertNotificacionType,
} from "./notificacion.schema";
import { desc, eq } from "drizzle-orm";

export class NotificacionService extends SharedRepository {
  async create(data: InsertNotificacionType) {
    if (data.causadorID === data.usuarioID) {
      // No tiene sentido recibir notificación causada por uno mismo :p
      return;
    }
    await this.db.insert(schema.notificacion).values({
      ...data,
      visto: false,
    });
  }

  async crearNotificacionPorPost(data: InsertNofificacionComentario) {
    const { usuarioID } = await this.db.query.post.findFirst({
      columns: {
        usuarioID: true,
      },
      where: eq(schema.post.postID, data.postID),
    });

    await this.create({
      usuarioID,
      tipo: data.tipo,
      causadorID: data.causadorID,
    });
  }

  async crearNotificacionPorContrato(data: InsertNofificacionPorContratoType) {
    const { ofertanteID } = await this.db.query.contratoOferta.findFirst({
      columns: {
        ofertanteID: true,
      },
      where: eq(schema.contratoOferta.ofertaID, data.ofertaID),
    });

    await this.create({
      usuarioID: ofertanteID,
      tipo: data.tipo,
      causadorID: data.causadorID,
    });
  }

  async obtenerDeUsuario(usuarioID: number) {
    const result = await this.db.query.notificacion.findMany({
      where: eq(schema.notificacion.usuarioID, usuarioID),
      orderBy: desc(schema.notificacion.creadoEn),
      with: {
        causador: {
          columns: {
            nombreUsuario: true,
            usuarioID: true,
            imagen: true,
          },
        },
      },
    });
    return result;
  }
}
