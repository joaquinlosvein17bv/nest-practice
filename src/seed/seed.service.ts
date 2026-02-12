import { Injectable } from '@nestjs/common';
import  axios , {AxiosInstance} from 'axios';
import { PokeResponse } from './Interfaces/Poke-response.interface';


@Injectable()
export class SeedService {
  
  private readonly axios: AxiosInstance = axios;

  
  async executeSeed() {
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1')
    data.results.forEach(({name, url}) => {
      
      const segmentes = url.split('/');
      const no = + segmentes [segmentes.length - 2] // -2 porque el ultimo segmento es un string vacio por el slash final;
      console.log({name, no})
  })
    return data;
  }
}
