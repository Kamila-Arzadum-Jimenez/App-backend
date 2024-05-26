import { FastifyTypebox } from "@api/types/FastifyTypebox";
import {
  GetComentariosPostSchema,
  InsertPostSchema,
  PostComentarioSchema,
  PostReactionSchema,
  SelectAllPostSchema,
} from "./post.schema";
import { PostService } from "./post.service";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const postService = new PostService();

  fastify.get(
    "/",
    {
      schema: SelectAllPostSchema,
    },
    async (req, reply) => {
      const posts = await postService.all();
      reply.send({ list: posts });
    }
  );

  fastify.post(
    "/",
    {
      preHandler: fastify.authenticate,
      schema: InsertPostSchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      const post = await postService.create({ ...req.body, usuarioID });
      reply.send({ post });
    }
  );

  fastify.post(
    "/comentar",
    {
      preHandler: fastify.authenticate,
      schema: PostComentarioSchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      const comentario = await postService.commentPost({
        ...req.body,
        usuarioID,
      });
      comentario;
      reply.send(comentario);
    }
  );

  fastify.post(
    "/like",
    {
      preHandler: fastify.authenticate,
      schema: PostReactionSchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      const reaccionExiste = await postService.like({ ...req.body, usuarioID });
      reply.send({ reaccionExiste });
    }
  );

  fastify.get(
    "/comentarios",
    {
      preHandler: fastify.authenticate,
      schema: GetComentariosPostSchema,
    },
    async (req, reply) => {
      const list = await postService.comentarios(req.query.postID);
      reply.send({ list });
    }
  );

  done();
}
