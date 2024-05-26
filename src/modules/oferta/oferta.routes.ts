import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { OfertaService } from "./oferta.service";
import {
  GetAllOfertaFavoritaSchema,
  GetSolicitudesOfertaPostulantesSchema as GetPostulantesOfertaSchema,
  GetSolicitudesOfertaSchema,
  PostContratarCelebridadSchema,
  PostOfertaFavoritaSchema,
  PostOfertaSchema,
  PostSolicitudOfertaSchema,
  PutReviewOfertaSchema,
} from "./oferta.schema";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const ofertaService = new OfertaService();

  fastify.post(
    "/",
    {
      preHandler: fastify.authenticate,
      schema: PostOfertaSchema,
    },
    async (req) => {
      const usuarioID = req.user.usuarioID;
      const result = await ofertaService.create({
        ...req.body,
        ofertanteID: usuarioID,
      });
      return result;
    }
  );

  fastify.post(
    "/toggle-favorite",
    {
      preHandler: fastify.authenticate,
      schema: PostOfertaFavoritaSchema,
    },
    async (req) => {
      const usuarioID = req.user.usuarioID;
      const esFavorito = await ofertaService.toggleFavorite({
        usuarioID: usuarioID,
        ofertaID: req.body.ofertaID,
      });
      return { esFavorito };
    }
  );

  fastify.get(
    "/favorites",
    {
      preHandler: fastify.authenticate,
      schema: GetAllOfertaFavoritaSchema,
    },
    async (req) => {
      const usuarioID = req.user.usuarioID;
      const list = await ofertaService.allFavorites(usuarioID);
      return { list };
    }
  );

  fastify.post(
    "/postular",
    {
      preHandler: fastify.authenticate,
      schema: PostSolicitudOfertaSchema,
    },
    async (req) => {
      const solicitanteID = req.user.usuarioID;
      const guardado = await ofertaService.postular({
        ofertaID: req.body.ofertaID,
        solicitanteID,
      });
      return { guardado };
    }
  );

  fastify.get(
    "/solicitudes",
    {
      preHandler: fastify.authenticate,
      schema: GetSolicitudesOfertaSchema,
    },
    async (req) => {
      const usuarioID = req.user.usuarioID;
      const list = await ofertaService.solicitudesIDs(usuarioID);
      return { list };
    }
  );

  fastify.get(
    "/ofertas-postulantes",
    {
      preHandler: fastify.authenticate,
      schema: GetPostulantesOfertaSchema,
    },
    async (req) => {
      const usuarioID = req.user.usuarioID;
      const list = await ofertaService.ofertasConPostulantes(usuarioID);
      return { list };
    }
  );

  fastify.post(
    "/contratar",
    {
      preHandler: fastify.authenticate,
      schema: PostContratarCelebridadSchema,
    },
    async (req) => {
      const usuarioID = req.user.usuarioID;
      const list = await ofertaService.contratarCelebridad({
        ...req.body,
        ofertanteID: usuarioID,
      });
      return { list };
    }
  );

  fastify.put(
    "/review",
    {
      preHandler: fastify.authenticate,
      schema: PutReviewOfertaSchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      await ofertaService.reviewContrato({
        ...req.body,
        ofertanteID: usuarioID,
      });
      reply.send({});
    }
  );

  done();
}
