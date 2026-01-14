import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

export const DRIZZLE = 'DRIZZLE';

export const databaseProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: (
    configService: ConfigService,
  ): PostgresJsDatabase<typeof schema> => {
    const connectionString = configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in .env');
    }

    const client = postgres(connectionString);

    return drizzle(client, { schema });
  },
};
