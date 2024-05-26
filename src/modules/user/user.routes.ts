import { FastifyTypebox } from "@api/types/FastifyTypebox";
import { UserService } from "./user.service";
import {
  GetContratosCelebridadSchema,
  GetContratosEmpresaSchema,
  GetEstadisticasUsuarioSchema,
  SelectCompleteProfileSchema,
  UpdateUserCelebritySchema,
  UpdateUserCompanySchema,
} from "./user.schema";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const userService = new UserService();
  fastify.get(
    "/profile",
    {
      schema: SelectCompleteProfileSchema,
    },
    async (req, reply) => {
      const usuarioID = req.query.usuarioID;
      const usuario = await userService.getCompleteProfile(usuarioID);
      reply.send(usuario);
    }
  );

  fastify.put(
    "/profile-celebrity",
    {
      preHandler: fastify.authenticate,
      schema: UpdateUserCelebritySchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      const usuario = await userService.updateCelebrityProfile(
        usuarioID,
        req.body
      );
      reply.send(usuario);
    }
  );

  fastify.put(
    "/profile-company",
    {
      preHandler: fastify.authenticate,
      schema: UpdateUserCompanySchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      const usuario = await userService.updateCompanyProfile(
        usuarioID,
        req.body
      );
      reply.send(usuario);
    }
  );

  fastify.get(
    "/contratos",
    {
      preHandler: fastify.authenticate,
      schema: GetContratosCelebridadSchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      const list = await userService.contratosCelebridad(usuarioID);
      reply.send({ list });
    }
  );

  fastify.get(
    "/contratos-empresa",
    {
      preHandler: fastify.authenticate,
      schema: GetContratosEmpresaSchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      const list = await userService.contratosEmpresa(usuarioID);
      reply.send({ list });
    }
  );

  fastify.get(
    "/estadisticas",
    {      preHandler: fastify.authenticate,

      schema: GetEstadisticasUsuarioSchema,
    },
    async (req, reply) => {
      const usuarioID = req.user.usuarioID;
      const datos = await userService.estadisticas(usuarioID);
      reply.send(datos);
    }
  );

  done();
}
