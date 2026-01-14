CREATE TYPE "public"."categoria_producto" AS ENUM('pizza', 'comida_rapida', 'bebida', 'helado');--> statement-breakpoint
CREATE TYPE "public"."estado_traspaso" AS ENUM('EN_CAMINO', 'RECIBIDO', 'CANCELADO');--> statement-breakpoint
CREATE TYPE "public"."metodo_pago" AS ENUM('EFECTIVO', 'CREDIBANCO', 'BRE_B');--> statement-breakpoint
CREATE TYPE "public"."rol_empleado" AS ENUM('cocinero', 'jefe_cocina', 'administrador', 'jefe');--> statement-breakpoint
CREATE TYPE "public"."tipo_documento" AS ENUM('POS', 'ELECTRONICA');--> statement-breakpoint
CREATE TYPE "public"."tipo_movimiento" AS ENUM('VENTA', 'TRASPASO_SALIDA', 'TRASPASO_ENTRADA', 'COMPRA_PROVEEDOR', 'MERMA');--> statement-breakpoint
CREATE TYPE "public"."unidad_medida" AS ENUM('gramos', 'mililitros', 'unidad');--> statement-breakpoint
CREATE TABLE "empleados" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_sede" uuid NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"rol" "rol_empleado" NOT NULL,
	"password" varchar(255) NOT NULL,
	"activo" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "insumo_sedes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_sede" uuid NOT NULL,
	"id_insumo" uuid NOT NULL,
	"cantidad_disponible" real DEFAULT 0 NOT NULL,
	CONSTRAINT "insumo_sedes_id_sede_id_insumo_unique" UNIQUE("id_sede","id_insumo")
);
--> statement-breakpoint
CREATE TABLE "insumos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"unidad_medida" "unidad_medida" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"categoria" "categoria_producto" NOT NULL,
	"precio" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recetas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_producto" uuid NOT NULL,
	"id_insumo" uuid NOT NULL,
	"cantidad" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sedes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"ciudad" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venta_productos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_venta" uuid NOT NULL,
	"id_producto" uuid NOT NULL,
	"cantidad" integer NOT NULL,
	"precio_unitario_historico" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ventas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_sede" uuid NOT NULL,
	"id_empleado" uuid NOT NULL,
	"monto_total" real NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "empleados" ADD CONSTRAINT "empleados_id_sede_sedes_id_fk" FOREIGN KEY ("id_sede") REFERENCES "public"."sedes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insumo_sedes" ADD CONSTRAINT "insumo_sedes_id_sede_sedes_id_fk" FOREIGN KEY ("id_sede") REFERENCES "public"."sedes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insumo_sedes" ADD CONSTRAINT "insumo_sedes_id_insumo_insumos_id_fk" FOREIGN KEY ("id_insumo") REFERENCES "public"."insumos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_id_producto_productos_id_fk" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_id_insumo_insumos_id_fk" FOREIGN KEY ("id_insumo") REFERENCES "public"."insumos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venta_productos" ADD CONSTRAINT "venta_productos_id_venta_ventas_id_fk" FOREIGN KEY ("id_venta") REFERENCES "public"."ventas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venta_productos" ADD CONSTRAINT "venta_productos_id_producto_productos_id_fk" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_sede_sedes_id_fk" FOREIGN KEY ("id_sede") REFERENCES "public"."sedes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_empleado_empleados_id_fk" FOREIGN KEY ("id_empleado") REFERENCES "public"."empleados"("id") ON DELETE no action ON UPDATE no action;