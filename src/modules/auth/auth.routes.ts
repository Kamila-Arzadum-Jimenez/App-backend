import { FastifyTypebox } from "@api/types/FastifyTypebox";
import {
  LoginSchema,
  PostCelebritySchema,
  PostCompanySchema,
} from "./auth.schema";
import { AuthService } from "./auth.service";

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void
) {
  const authService = new AuthService();

  fastify.post(
    "/register-celebrity",
    {
      schema: PostCelebritySchema,
    },
    async (req) => {
      const result = await authService.registerCelebrity(req.body);
      return result;
    }
  );

  fastify.post(
    "/register-company",
    {
      schema: PostCompanySchema,
    },
    async (req) => {
      const result = await authService.registerCompany(req.body);
      return result;
    }
  );

  fastify.post(
    "/login",
    {
      schema: LoginSchema,
    },
    async (req, reply) => {
      const { usuario } = await authService.loginRequest(req.body);
      const token = fastify.jwt.createAccessToken({
        usuarioID: usuario.usuarioID,
      });
      const esEmpresa = !!usuario?.perfilEmpresa?.perfilEmpresaID;
      reply.send({ usuario, token, esEmpresa });
    }
  );

  done();
}
