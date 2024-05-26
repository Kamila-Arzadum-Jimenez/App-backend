import { DrizzleError, eq } from "drizzle-orm";
import { InsertUserType } from "./user.schema";
import { schema } from "@api/plugins/db";
import { SharedRepository } from "../shared/shared.repository";

export class UserRepository extends SharedRepository {
  async findByEmail(email: string) {
    const usuario = await this.db.query.usuario.findFirst({
      where: eq(schema.usuario.email, email),
      with: {
        perfilEmpresa: true,
        perfilCelebridad: true,
      },
    });
    return usuario;
  }

  async create(userData: InsertUserType) {
    try {
      const [usuario] = await this.db
        .insert(schema.usuario)
        .values({
          ...userData,
        })
        .returning();
      usuario.password = "";

      return usuario;
    } catch (error) {
      if (error instanceof DrizzleError) {
        throw new Error(error.message ?? error?.toString());
      }
      throw new Error(`${error}`);
    }
  }
}
