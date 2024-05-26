import { schema } from "@api/plugins/db";
import { SharedRepository } from "../shared/shared.repository";
import {
  InsertComentarioType,
  InsertPostType,
  InsertReactionType,
} from "./post.schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { NotificacionService } from "../notificacion/notificacion.service";

export class PostService extends SharedRepository {
  constructor() {
    super();
    this.notificacionService = new NotificacionService();
  }

  private notificacionService: NotificacionService;

  async create(data: InsertPostType) {
    const post = await this.db.insert(schema.post).values(data).returning();
    return post;
  }

  async commentPost(data: InsertComentarioType) {
    const [result] = await this.db
      .insert(schema.comentario)
      .values(data)
      .returning();

    this.notificacionService.crearNotificacionPorPost({
      causadorID: data.usuarioID,
      postID: data.postID,
      tipo: "comentario",
    });
    return result;
  }
  async like(data: InsertReactionType) {
    let reaccionExiste = true;
    try {
      await this.db.insert(schema.reaccion).values(data);
      this.notificacionService.crearNotificacionPorPost({
        causadorID: data.usuarioID,
        postID: data.postID,
        tipo: "reaccion",
      });
    } catch (e) {
      reaccionExiste = false;
      await this.db
        .delete(schema.reaccion)
        .where(
          and(
            eq(schema.reaccion.usuarioID, data.usuarioID),
            eq(schema.reaccion.postID, data.postID)
          )
        );
    }
    return reaccionExiste;
  }

  async all() {
    const allPosts = await this.db.query.post.findMany({
      with: {
        comentarios: {
          columns: {
            postID: true,
            comentarioID: true,
            creadoEn: true,
            texto: true,
          },
          with: {
            usuario: {
              columns: {
                usuarioID: true,
                imagen: true,
                nombreUsuario: true,
              },
            },
          },
        },
        reacciones: {
          columns: {
            usuarioID: true,
          },
        },
        usuario: {
          columns: {
            usuarioID: true,
            nombre: true,
            nombreUsuario: true,
            subNombre: true,
            imagen: true,
          },
        },
      },
      orderBy: desc(schema.post.creadoEn),
    });

    const flat = allPosts.map((a) => ({
      ...a,
      reacciones: a.reacciones.map((r) => r.usuarioID),
    }));
    return flat;
  }

  async comentarios(postID: number) {
    const result = await this.db.query.comentario.findMany({
      where: eq(schema.comentario.postID, postID),
      columns: {
        usuarioID: true,
        comentarioID: true,
        creadoEn: true,
        texto: true,
      },
      orderBy: desc(schema.comentario.creadoEn),
      with: {
        usuario: {
          columns: {
            usuarioID: true,
            imagen: true,
            nombreUsuario: true,
          },
        },
      },
    });
    return result;
  }
}
