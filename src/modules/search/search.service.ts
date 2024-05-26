import { eq, isNull, like, or, sql } from "drizzle-orm";
import { SharedRepository } from "../shared/shared.repository";
import { schema } from "@api/plugins/db";

export class SearchService extends SharedRepository {
  async findUsers(query: string) {
    const users = await this.db.query.usuario.findMany({
      columns: {
        nombre: true,
        nombreUsuario: true,
        imagen: true,
        subNombre: true,
        ciudad: true,
        telefono: true,
        usuarioID: true,
      },
      where: sql`LOWER (${schema.usuario.nombreUsuario}) LIKE ${`%${query.toLowerCase()}%`}`,
    });
    return users;
  }

  async findOffers(query: string) {
    const offers = await this.db.query.oferta.findMany({
      where: like(schema.oferta.categoria, `%${query.toLowerCase()}%`),
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
    });

    const format = offers.map((offer) => ({
      ...offer,
      favoritoPor: offer.favoritoPor.map((f) => f.usuarioID),
    }));
    return format;
  }
}
