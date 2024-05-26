import { schema } from "@api/plugins/db";
import { SharedRepository } from "../shared/shared.repository";
import { count, eq, sql } from "drizzle-orm";
import { UpdateUserCelebrityType, UpdateUserCompanyType } from "./user.schema";
import dayjs from "dayjs";

export class UserService extends SharedRepository {
  async getCompleteProfile(usuarioID: number) {
    const usuario = await this.db.query.usuario.findFirst({
      where: eq(schema.usuario.usuarioID, usuarioID),
      with: {
        perfilEmpresa: true,
        perfilCelebridad: true,
      },
    });
    return usuario;
  }

  async updateCelebrityProfile(
    usuarioID: number,
    data: UpdateUserCelebrityType
  ) {
    this.db.transaction(async (tx) => {
      await tx
        .update(schema.perfilCelebridad)
        .set(data.perfilCelebridad)
        .where(eq(schema.perfilCelebridad.usuarioID, usuarioID));
      await tx
        .update(schema.usuario)
        .set(data.usuario)
        .where(eq(schema.usuario.usuarioID, usuarioID));
    });
  }

  async updateCompanyProfile(usuarioID: number, data: UpdateUserCompanyType) {
    this.db.transaction(async (tx) => {
      await tx
        .update(schema.perfilEmpresa)
        .set(data.perfilEmpresa)
        .where(eq(schema.perfilEmpresa.usuarioID, usuarioID));
      await tx
        .update(schema.usuario)
        .set(data.usuario)
        .where(eq(schema.usuario.usuarioID, usuarioID));
    });
  }

  async all() {
    const posts = await this.db
      .select()
      .from(schema.post)
      .orderBy(schema.post.creadoEn);
    return posts;
  }

  async contratosCelebridad(usuarioID: number) {
    const contratos = await this.db.query.contratoOferta.findMany({
      where: eq(schema.contratoOferta.contratadoID, usuarioID),
      with: {
        oferta: {
          columns: {
            ofertaID: true,
            monto: true,
            categoria: true,
            fechaPlazo: true,
            descripcion: true,
          },
        },
        ofertante: {
          columns: {
            nombre: true,
            nombreUsuario: true,
            subNombre: true,
            telefono: true,
            ciudad: true,
          },
        },
      },
    });
    return contratos;
  }

  async contratosEmpresa(usuarioID: number) {
    const contratos = await this.db.query.contratoOferta.findMany({
      where: eq(schema.contratoOferta.ofertanteID, usuarioID),
      with: {
        oferta: {
          columns: {
            ofertaID: true,
            monto: true,
            categoria: true,
            fechaPlazo: true,
            descripcion: true,
          },
        },
        contratado: {
          columns: {
            nombre: true,
            nombreUsuario: true,
            subNombre: true,
            telefono: true,
            ciudad: true,
          },
        },
      },
    });
    return contratos;
  }

  async estadisticas(usuarioID: number) {
    const totalPosts = this.db
      .select({ total: count() })
      .from(schema.post)
      .where(eq(schema.post.usuarioID, usuarioID));

    const totalReacciones = this.db
      .select({ total: count() })
      .from(schema.reaccion)
      .leftJoin(schema.post, eq(schema.post.postID, schema.reaccion.postID))
      .where(eq(schema.post.usuarioID, usuarioID));

    const totalComentarios = this.db
      .select({ total: count() })
      .from(schema.comentario)
      .leftJoin(schema.post, eq(schema.post.postID, schema.comentario.postID))
      .where(eq(schema.post.usuarioID, usuarioID));

    // EL TIMESTAMP ESTA SIN Z (TIME ZONE), ASÍ QUE ES MÁS CORTO RESTAR 4 HORAS
    // SINO TENDRÍA QUE CONVERTIR creadoEn -> TIME ZONE -> TIME ZONE (LA_PAZ)
    const timezoneDif = 4;
    const raw = sql.raw(`${timezoneDif}`);
    const offsetDate = sql<string>`date_trunc('day', ${schema.reaccion.creadoEn} - interval '${raw} hours')`;
    const totalReaccionesTimestamps = this.db
      .select({ timestamp: offsetDate, count: count() })
      .from(schema.reaccion)
      .leftJoin(schema.post, eq(schema.post.postID, schema.reaccion.postID))
      .where(eq(schema.post.usuarioID, usuarioID))
      .groupBy(offsetDate)
      .orderBy(offsetDate);

    const totalGanancias = 1500;
    const seguidores = 4;
    const results = await Promise.all([
      totalPosts,
      totalReacciones,
      totalComentarios,
      totalReaccionesTimestamps,
    ]);

    let timeIterator = dayjs().subtract(timezoneDif, "hours").startOf("month");
    const daysInMonth = timeIterator.daysInMonth();
    const reaccionesTimestamps = results[3];
    const reaccionesMes = [];
    let timestampIndex = 0;
    for (let day = 0; day < daysInMonth; day++) {
      const date1 = timeIterator.format("YYYY-MM-DD");
      const date2Raw = reaccionesTimestamps[timestampIndex]?.timestamp;
      const date2 = dayjs(date2Raw).format("YYYY-MM-DD");
      let count = 0;
      if (date1 === date2 && date2Raw) {
        count = reaccionesTimestamps[timestampIndex].count;
        timestampIndex++;
      }
      reaccionesMes.push({ timestamp: date1, count });
      timeIterator = timeIterator.add(1, "day");
    }

    return {
      postsCreados: results[0][0].total,
      reacciones: results[1][0].total,
      comentarios: results[2][0].total,
      seguidores: seguidores,
      ganancias: totalGanancias,
      reaccionesTimestamps: reaccionesMes,
    };
  }
}
