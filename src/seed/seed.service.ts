import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
@Injectable()
export class SeedService {

  
  //constructor (private readonly pokemonService: PokemonService) {}
  constructor(
      @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>,
      private readonly http: AxiosAdapter,
    ) {}
    

  
  async executeSeed() {
    //borar todo lo anterior
    await this.pokemonModel.deleteMany({}); //delete * from pokemons

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')
    //const conjuno : Promise<any>[] = [];
    const PokemonToInsert:{name: string, no: number}[] = [];
    data.results.forEach(({name, url}) => {
      
      const segmentes = url.split('/');
      const no = + segmentes [segmentes.length - 2] // -2 porque el ultimo segmento es un string vacio por el slash final;
      //conjuno.push(this.pokemonService.create({name, no}))
      PokemonToInsert.push({name, no});
  })
    //await Promise.all(conjuno);
    await this.pokemonModel.insertMany(PokemonToInsert);
    return 'Seed executed';

  }
  
}
