import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  pgEnum,
  real,
  integer,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const unidadMedidaEnum = pgEnum('unidad_medida', [
  'gramos',
  'mililitros',
  'unidad',
]);
export const categoriaProductoEnum = pgEnum('categoria_producto', [
  'pizza',
  'comida_rapida',
  'bebida',
  'helado',
]);
export const rolEmpleadoEnum = pgEnum('rol_empleado', [
  'cocinero',
  'jefe_cocina',
  'administrador',
  'jefe',
]);
export const tipoDocumentoEnum = pgEnum('tipo_documento', [
  'POS',
  'ELECTRONICA',
]);
export const metodoPagoEnum = pgEnum('metodo_pago', [
  'EFECTIVO',
  'CREDIBANCO',
  'BRE_B',
]);
export const estadoTraspasoEnum = pgEnum('estado_traspaso', [
  'EN_CAMINO',
  'RECIBIDO',
  'CANCELADO',
]);
export const tipoMovimientoEnum = pgEnum('tipo_movimiento', [
  'VENTA',
  'TRASPASO_SALIDA',
  'TRASPASO_ENTRADA',
  'COMPRA_PROVEEDOR',
  'MERMA',
]);

export const sedes = pgTable('sedes', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  ciudad: varchar('ciudad', { length: 255 }).notNull(),
});

export const empleados = pgTable('empleados', {
  id: uuid('id').primaryKey().defaultRandom(),
  idSede: uuid('id_sede')
    .references(() => sedes.id)
    .notNull(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  rol: rolEmpleadoEnum('rol').notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  activo: boolean('activo').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insumos = pgTable('insumos', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  unidadMedida: unidadMedidaEnum('unidad_medida').notNull(),
});

// Relación muchos a muchos entre Insumo y Sede (Stock)
export const insumoSedes = pgTable(
  'insumo_sedes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    idSede: uuid('id_sede')
      .references(() => sedes.id)
      .notNull(),
    idInsumo: uuid('id_insumo')
      .references(() => insumos.id)
      .notNull(),
    cantidadDisponible: real('cantidad_disponible').notNull().default(0),
  },
  (t) => ({
    uniqueSedeInsumo: unique().on(t.idSede, t.idInsumo),
  }),
);

export const productos = pgTable('productos', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  categoria: categoriaProductoEnum('categoria').notNull(),
  precio: real('precio').notNull(),
});

export const recetas = pgTable('recetas', {
  id: uuid('id').primaryKey().defaultRandom(),
  idProducto: uuid('id_producto')
    .references(() => productos.id)
    .notNull(),
  idInsumo: uuid('id_insumo')
    .references(() => insumos.id)
    .notNull(),
  cantidad: real('cantidad').notNull(),
});

export const ventas = pgTable('ventas', {
  id: uuid('id').primaryKey().defaultRandom(),
  idSede: uuid('id_sede')
    .references(() => sedes.id)
    .notNull(),
  idEmpleado: uuid('id_empleado')
    .references(() => empleados.id)
    .notNull(),
  montoTotal: real('monto_total').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ventaProductos = pgTable('venta_productos', {
  id: uuid('id').primaryKey().defaultRandom(),
  idVenta: uuid('id_venta')
    .references(() => ventas.id)
    .notNull(),
  idProducto: uuid('id_producto')
    .references(() => productos.id)
    .notNull(),
  cantidad: integer('cantidad').notNull(),
  precioUnitarioHistorico: real('precio_unitario_historico').notNull(),
});

// --- RELACIONES ---
export const sedesRelations = relations(sedes, ({ many }) => ({
  empleados: many(empleados),
  insumoSedes: many(insumoSedes),
  ventas: many(ventas),
}));

export const insumoSedesRelations = relations(insumoSedes, ({ one }) => ({
  sede: one(sedes, { fields: [insumoSedes.idSede], references: [sedes.id] }),
  insumo: one(insumos, {
    fields: [insumoSedes.idInsumo],
    references: [insumos.id],
  }),
}));

export const ventasRelations = relations(ventas, ({ one, many }) => ({
  sede: one(sedes, { fields: [ventas.idSede], references: [sedes.id] }),
  empleado: one(empleados, {
    fields: [ventas.idEmpleado],
    references: [empleados.id],
  }),
  productos: many(ventaProductos),
}));
