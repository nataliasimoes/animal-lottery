import { Injectable } from '@nestjs/common';
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { interval, map } from 'rxjs';

// define as opções de conexão com o microserviço
const clientOptions : ClientOptions = {
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
    retryAttempts : 5,
    retryDelay : 5000
  },
}

const lottery: Animal[] = [
  { name: 'Avestruz', group: 1, dozens: ['01', '02', '03', '04'] },
  { name: 'Águia', group: 2, dozens: ['05', '06', '07', '08'] },
  { name: 'Burro', group: 3, dozens: ['09', '10', '11', '12'] },
  { name: 'Borboleta', group: 4, dozens: ['13', '14', '15', '16'] },
  { name: 'Cachorro', group: 5, dozens: ['17', '18', '19', '20'] },
  { name: 'Cabra', group: 6, dozens: ['21', '22', '23', '24'] },
  { name: 'Carneiro', group: 7, dozens: ['25', '26', '27', '28'] },
  { name: 'Camelo', group: 8, dozens: ['29', '30', '31', '32'] },
  { name: 'Cobra', group: 9, dozens: ['33', '34', '35', '36'] },
  { name: 'Coelho', group: 10, dozens: ['37', '38', '39', '40'] },
  { name: 'Cavalo', group: 11, dozens: ['41', '42', '43', '44'] },
  { name: 'Elefante', group: 12, dozens: ['45', '46', '47', '48'] },
  { name: 'Galo', group: 13, dozens: ['49', '50', '51', '52'] },
  { name: 'Gato', group: 14, dozens: ['53', '54', '55', '56'] },
  { name: 'Jacaré', group: 15, dozens: ['57', '58', '59', '60'] },
  { name: 'Leão', group: 16, dozens: ['61', '62', '63', '64'] },
  { name: 'Macaco', group: 17, dozens: ['65', '66', '67', '68'] },
  { name: 'Porco', group: 18, dozens: ['69', '70', '71', '72'] },
  { name: 'Pavão', group: 19, dozens: ['73', '74', '75', '76'] },
  { name: 'Peru', group: 20, dozens: ['77', '78', '79', '80'] },
  { name: 'Touro', group: 21, dozens: ['81', '82', '83', '84'] },
  { name: 'Tigre', group: 22, dozens: ['85', '86', '87', '88'] },
  { name: 'Urso', group: 23, dozens: ['89', '90', '91', '92'] },
  { name: 'Veado', group: 24, dozens: ['93', '94', '95', '96'] },
  { name: 'Vaca', group: 25, dozens: ['97', '98', '99', '00'] },
] 

interface Result {
  animal: Animal;
  number: string;
}

@Injectable()
export class AppService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(clientOptions);

    this.cachedItem.subscribe((result) => {
      const r: Result = {
        animal: lottery.find((animal) => animal.dozens.includes(result.substring(2, 4))),
        number: result
      } 
      return this.client.emit('result', r)
    })
  }

  private cachedItem = interval(5000).pipe(map(() => {
    const result = Math.floor(Math.random() * 1000).toString().padStart(4, '0')
    return result
  }))

}
