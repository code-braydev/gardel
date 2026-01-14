import { Injectable, Inject } from '@nestjs/common';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { DRIZZLE } from '../database/database.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SedesService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(createSedeDto: CreateSedeDto) {
    const nuevaSede = await this.db
      .insert(schema.sedes)
      .values(createSedeDto)
      .returning();
    return nuevaSede[0];
  }

  async findAll() {
    return await this.db.select().from(schema.sedes);
  }

  async findOne(id: string) {
    const resultado = await this.db
      .select()
      .from(schema.sedes)
      .where(eq(schema.sedes.id, id));
    return resultado[0] || null;
  }

  async update(id: string, updateSedeDto: UpdateSedeDto) {
    const actualizado = await this.db
      .update(schema.sedes)
      .set(updateSedeDto)
      .where(eq(schema.sedes.id, id))
      .returning();
    return actualizado[0] || null;
  }

  async remove(id: string) {
    const eliminado = await this.db
      .delete(schema.sedes)
      .where(eq(schema.sedes.id, id))
      .returning();
    return eliminado[0] || null;
  }
}
