import { Controller, Inject, Sse } from "@nestjs/common";
import { AppService } from "./app.service";
import { Observable } from "rxjs";
import { RedisClientType } from "@redis/client";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("CACHE_MANAGER") private redisClient: RedisClientType
  ) {}

  @Sse("watch")
  watchVariable(): Observable<MessageEvent> {
    //criar um enventsource no browser para ficar escutando
    return new Observable((subscriber) => {
      (async () => {
        let client;
        try {
          // O método duplicate cria um novo cliente e o método connect é chamado para conectar esse cliente ao Redis.
          client = await this.redisClient.duplicate();
          client.connect().then(() => {
            // subscribe no canal result e passando a mensagem
            this.redisClient.subscribe("result", (message) => {
              const messageEvent = new MessageEvent("message", {
                data: message,
              });
              // é parâmetro callback do observable
              subscriber.next(messageEvent);
            });
          });
        } catch (error) {
          console.log(error);
        }
        return () => {
          console.log("Disconnected...");

          subscriber.unsubscribe();
          client.disconnect();
        };
      })();
    });
  }
}
