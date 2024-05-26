import * as bcrypt from "bcrypt";
import {
  LoginRequestType,
  RegisterCelebrityType,
  RegisterCompanyType,
} from "./auth.schema";
import { UserRepository } from "../user/user.repository";
import { InvalidLoginError } from "@api/errors/errors";
import {
  InsertCelebrityType,
  InsertCompanyType,
  InsertUserType,
} from "../user/user.schema";
import { SharedRepository } from "../shared/shared.repository";
import { schema } from "@api/plugins/db";

export class AuthService extends SharedRepository {
  private userRepository: UserRepository;
  constructor(userRp?: UserRepository) {
    super();
    this.userRepository = userRp ?? new UserRepository();
  }

  private async registerUser(usuario: InsertUserType) {
    usuario.nombreUsuario = usuario.nombreUsuario.toLowerCase();
    const hashed = await this.hashPassword(usuario.password);
    usuario.password = hashed;
    const [user] = await this.db
      .insert(schema.usuario)
      .values(usuario)
      .returning();
    return user;
  }

  private async createCelebrity(data: InsertCelebrityType) {
    const [result] = await this.db
      .insert(schema.perfilCelebridad)
      .values(data)
      .returning();
    return result;
  }

  private async createCompany(data: InsertCompanyType) {
    const [result] = await this.db
      .insert(schema.perfilEmpresa)
      .values(data)
      .returning();
    return result;
  }

  async registerCelebrity(data: RegisterCelebrityType) {
    const usuario = await this.registerUser(data.usuario);
    const celebridad = await this.createCelebrity({
      ...data.celebridad,
      usuarioID: usuario.usuarioID,
    });

    return { usuario, celebridad };
  }

  async registerCompany(data: RegisterCompanyType) {
    const usuario = await this.registerUser(data.usuario);
    const company = await this.createCompany({
      ...data.empresa,
      usuarioID: usuario.usuarioID,
    });

    return { usuario, company };
  }

  async loginRequest(data: LoginRequestType) {
    const usuario = await this.userRepository.findByEmail(data.email);

    if (!usuario) {
      throw new InvalidLoginError();
    }

    const equal = await this.passwordsMatch(data.password, usuario.password);
    if (!equal) {
      throw new InvalidLoginError();
    }
    usuario.password = "";
    return { usuario };
  }
  async passwordsMatch(password: string, hash: string) {
    const equal = await bcrypt.compare(password, hash);
    return equal;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 1);
  }
}
