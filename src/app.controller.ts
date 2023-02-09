import { Controller, Inject, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { RedisClientType } from '@redis/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject('CACHE_MANAGER') private redisClient : RedisClientType) {}

  @Sse("watch")
    watchVariable() : Observable<MessageEvent> {
      //criar um enventsource no browser para ficar escutando
      return new Observable(subscriber => {
        (async () => {
          let client;
          try {
            client = await this.redisClient.duplicate();
            client.connect().then(() => {
              this.redisClient.subscribe("result", (message, channel) => {
                const messageEvent = new MessageEvent("message", {data: message});
                subscriber.next(messageEvent)
              })
            })
          } catch (error) {
            console.log(error);
            
          }
          return () => {
            console.log("Disconectou...");
            
            subscriber.unsubscribe();
            client.disconnect();
          }
        })();
      })
  }

}
