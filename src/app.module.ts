import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { createClient } from '@redis/client'
import { AppService } from './app.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client'),
  }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'CACHE_MANAGER',
    useFactory: async () => {
      const client = createClient({
        url: 'redis://localhost:6379'
      })
      await client.connect();
      return client;
    }
  }],
})
export class AppModule {}
