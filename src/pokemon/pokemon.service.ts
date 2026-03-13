import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit')! ;

  }


  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    //se responde con un error especifico clase 7/12
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleExceptions( error );
    }


    
  }

  findAll(paginationDto: PaginationDto) {
    const {limit= +(process.env.DEFAULT_LIMIT ?? 10), offset=0} = paginationDto; //el ?? se usa para asignar un valor por defecto en caso de que el valor sea null o undefined, en este caso se asigna el valor de process.env.DEFAULT_LIMIT si existe, o 10 si no existe.
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({ 
      no: 1
     })
    .select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;
    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: Number(term)});
    }
    
    //mogoid
    if ( !pokemon && isValidObjectId(term)  ) {
      pokemon = await this.pokemonModel.findById(term);
    }
    //name
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }
    //not found
    if ( !pokemon )
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);  

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
    await pokemon.updateOne( updatePokemonDto);
    return { ...pokemon.toJSON(), ...updatePokemonDto };
    
  
    } catch (error) {
      this.handleExceptions( error );
    }

    
  }

  
  async remove(id: string) {
    //const pokemon = await this.findOne(id);
    
    //try {
    //  await pokemon.deleteOne();
    //  return { message: `Pokemon with id "${pokemon._id}" has been deleted.` };
    //} catch (error) {
    //  this.handleExceptions( error );
    //}
    const { deletedCount} = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    return ;
  }

  private handleExceptions( error: any ) { 
    
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
      }
      console.log(error);
      throw new InternalServerErrorException('Can not create or update Pokemon - Check server logs');

  }



}
