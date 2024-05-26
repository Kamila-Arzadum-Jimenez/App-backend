CREATE TABLE IF NOT EXISTS "contratoOferta" (
	"ofertaID" integer NOT NULL,
	"contratadoID" integer NOT NULL,
	"ofertanteID" integer NOT NULL,
	"puntuacion" integer,
	"creadoEn" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "pk_contrato_oferta" PRIMARY KEY("ofertaID","ofertanteID","contratadoID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notificacion" (
	"notificacionID" serial PRIMARY KEY NOT NULL,
	"categoria" varchar(64) NOT NULL,
	"visto" boolean NOT NULL,
	"causadorID" integer,
	"destinoUsuarioID" integer NOT NULL,
	"creadoEn" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oferta" (
	"ofertaID" serial PRIMARY KEY NOT NULL,
	"monto" numeric,
	"descripcion" varchar(512) NOT NULL,
	"categoria" varchar(128) NOT NULL,
	"ofertanteID" integer NOT NULL,
	"fechaPlazo" timestamp(3) NOT NULL,
	"creadoEn" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ofertaFavorita" (
	"usuarioID" integer NOT NULL,
	"ofertaID" integer NOT NULL,
	"creadoEn" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "pk_ofertaFavorita" PRIMARY KEY("ofertaID","usuarioID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "perfilCelebridad" (
	"perfilCelebridadID" serial PRIMARY KEY NOT NULL,
	"genero" varchar(32),
	"plataformas" json NOT NULL,
	"usuarioID" integer NOT NULL,
	"creadoEn" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "perfilEmpresa" (
	"perfilEmpresaID" serial PRIMARY KEY NOT NULL,
	"productos" json NOT NULL,
	"usuarioID" integer NOT NULL,
	"creadoEn" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"postID" serial PRIMARY KEY NOT NULL,
	"descripcion" varchar(256) NOT NULL,
	"apellido" text NOT NULL,
	"comentarios" json NOT NULL,
	"usuarioID" integer NOT NULL,
	"creadoEn" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reaccion" (
	"postID" integer NOT NULL,
	"usuarioID" integer NOT NULL,
	"tipo" varchar(32),
	"creadoEn" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "pk_reacciones" PRIMARY KEY("postID","usuarioID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "solicitudOferta" (
	"ofertaID" integer NOT NULL,
	"solicitanteID" integer NOT NULL,
	"creadoEn" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "solicitudOferta_ofertaID_solicitanteID_pk" PRIMARY KEY("ofertaID","solicitanteID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usuario" (
	"usuarioID" serial PRIMARY KEY NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" varchar(128) NOT NULL,
	"nombre" varchar(256) NOT NULL,
	"nombreUsuario" varchar(256) NOT NULL,
	"subNombre" varchar(256) NOT NULL,
	"bio" varchar(256) DEFAULT '' NOT NULL,
	"imagen" text NOT NULL,
	"ciudad" varchar(256) NOT NULL,
	"telefono" varchar(256) NOT NULL,
	"direccion" varchar(512),
	CONSTRAINT "usuario_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contratoOferta" ADD CONSTRAINT "contratoOferta_ofertaID_oferta_ofertaID_fk" FOREIGN KEY ("ofertaID") REFERENCES "oferta"("ofertaID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contratoOferta" ADD CONSTRAINT "contratoOferta_contratadoID_usuario_usuarioID_fk" FOREIGN KEY ("contratadoID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contratoOferta" ADD CONSTRAINT "contratoOferta_ofertanteID_usuario_usuarioID_fk" FOREIGN KEY ("ofertanteID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_causadorID_usuario_usuarioID_fk" FOREIGN KEY ("causadorID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_destinoUsuarioID_usuario_usuarioID_fk" FOREIGN KEY ("destinoUsuarioID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oferta" ADD CONSTRAINT "oferta_ofertanteID_usuario_usuarioID_fk" FOREIGN KEY ("ofertanteID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ofertaFavorita" ADD CONSTRAINT "ofertaFavorita_usuarioID_usuario_usuarioID_fk" FOREIGN KEY ("usuarioID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ofertaFavorita" ADD CONSTRAINT "ofertaFavorita_ofertaID_oferta_ofertaID_fk" FOREIGN KEY ("ofertaID") REFERENCES "oferta"("ofertaID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "perfilCelebridad" ADD CONSTRAINT "perfilCelebridad_usuarioID_usuario_usuarioID_fk" FOREIGN KEY ("usuarioID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "perfilEmpresa" ADD CONSTRAINT "perfilEmpresa_usuarioID_usuario_usuarioID_fk" FOREIGN KEY ("usuarioID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_usuarioID_usuario_usuarioID_fk" FOREIGN KEY ("usuarioID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reaccion" ADD CONSTRAINT "reaccion_postID_post_postID_fk" FOREIGN KEY ("postID") REFERENCES "post"("postID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reaccion" ADD CONSTRAINT "reaccion_usuarioID_usuario_usuarioID_fk" FOREIGN KEY ("usuarioID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "solicitudOferta" ADD CONSTRAINT "solicitudOferta_ofertaID_oferta_ofertaID_fk" FOREIGN KEY ("ofertaID") REFERENCES "oferta"("ofertaID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "solicitudOferta" ADD CONSTRAINT "solicitudOferta_solicitanteID_usuario_usuarioID_fk" FOREIGN KEY ("solicitanteID") REFERENCES "usuario"("usuarioID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
