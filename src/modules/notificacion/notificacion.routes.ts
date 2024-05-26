import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { GetNotificacionesSchema } from "./notificacion.schema";
import { NotificacionService } from "./notificacion.service";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const notificacionService = new NotificacionService();

  fastify.get(
    "/notificacion",
    {
      preHandler: fastify.authenticate,
      schema: GetNotificacionesSchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      const list = await notificacionService.obtenerDeUsuario(usuarioID);
      reply.send({ list });
    }
  );

  done();
}
