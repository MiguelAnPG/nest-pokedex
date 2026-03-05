import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapter/axios.adapter';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>,

    //Codigo que permite la consulta a la BD
    private readonly http: AxiosAdapter,
  ){}

  async executeSeed(){
    
    await this.pokemonModel.deleteMany({}); //Borrar la bd cada vez que se ejecuta la semilla

    //La peticion HTTP la hacemos con Axios. Comando para instalar: yarn add axios
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
        
    const pokemonToInsert: {name:string, no:number}[] = []; //Insersion de datos, a partir de una promesa

    data.results.forEach(({name, url}) => {

      const segments = url.split('/');
      const no = +segments[segments.length -2];

      pokemonToInsert.push({ name, no});

    });

    //Una vez que se cargan todas las promesas se inserta en la bd
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Semilla Ejecutada';
    
  }


}
