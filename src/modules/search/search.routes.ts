import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { SearchService } from "./search.service";
import { GetSearchOffersSchema, GetSearchUsersSchema } from "./search.schema";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const searchService = new SearchService();

  fastify.get(
    "/ofertas",
    {
      schema: GetSearchOffersSchema,
    },
    async (req, reply) => {
      const ofertas = await searchService.findOffers(req.query.query ?? "");
      reply.send({ list: ofertas });
    }
  );

  fastify.get(
    "/usuarios",
    {
      schema: GetSearchUsersSchema,
    },
    async (req, reply) => {
      const usuarios = await searchService.findUsers(req.query.query ?? "");
      reply.send({ list: usuarios });
    }
  );

  done();
}
