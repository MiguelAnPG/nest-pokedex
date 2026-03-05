import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Console } from 'console';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {  

  //Constructor. Hacemos inyeccion de dependencias
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}


  //*-------------------INICIO CODIGO PARA INSERTAR REGISTROS NUEVOS EN LA BASE DE DATOS-------------------*/
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      //Insertamos en la base de datos
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      
      return pokemon;

    } catch (error) {
      this.handleException(error);
    }
  }
  //*-------------------FINALIZA CODIGO PARA INSERTAR REGISTROS NUEVOS EN LA BASE DE DATOS-------------------*/


  //*-------------------INICIO CODIGO PARA CONSULTAR TODOS LOS REGISTROS NUEVOS EN LA BASE DE DATOS  -------------------*/
  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0} = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      //opcional
      .select('-__v');

  }
  //*-------------------FINALIZA CODIGO PARA CONSULTAR TODOS LOS REGISTROS NUEVOS EN LA BASE DE DATOS  -------------------*/


  //*-------------------INICIA CODIGO PARA CONSULTAR REGISTROS EN LA BASE DE DATOS-------------------*/
  async findOne(term: string) {

    let pokemon: Pokemon | null = null;

    //Evaluamon si el termino existe en la BD
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: +term});
    }
    
    //MongID. Evaluamos si es un mongoId
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    //Name. Evaluamos encontramos el pokemon por el nombre
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()})
    }

    if(!pokemon)
      throw new NotFoundException(`Pokemon con id, nombre o no "${term}" no fue encontrado`);
    
    return pokemon;
  }
  //*-------------------FINALIZA CODIGO PARA CONSULTAR REGISTROS EN LA BASE DE DATOS-------------------*/


  //*-------------------INICIA CODIGO PARA ACTUALIZAR REGISTROS EN LA BASE DE DATOS-------------------*/
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {

      await pokemon.updateOne( updatePokemonDto, {new:true} );
      return {...pokemon.toJSON(), ...updatePokemonDto}; 

    } 
    catch (error) {
      this.handleException(error);
    }
  }
  //*-------------------FINALIZA CODIGO PARA ACTUALIZAR REGISTROS EN LA BASE DE DATOS-------------------*/

  
  //*-------------------INICIA CODIGO PARA BORRAR REGISTROS EN LA BASE DE DATOS-------------------*/
  async remove(id: string) {

    //const pokemon = await this.findOne(id);
    //await pokemon.deleteOne();
    //return{ id };
    //const result = await this.pokemonModel.findByIdAndDelete(id);

    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id });
    if(deletedCount === 0)
      throw new BadRequestException(`El Pokemon con el id "${id}" no se encuentra`);

    return;
  }
  //*-------------------FINALIZA CODIGO PARA BORRAR REGISTROS EN LA BASE DE DATOS-------------------*/


  //*-------------------INICIA METODO PARA EVALUAR ERRORES-------------------*/
    private handleException(error: any){
      if(error.code === 11000){
        throw new BadGatewayException(`El Pokemon ya existe en la BD ${JSON.stringify(error.keyValue)}`);
      }
      console.log(error);
      throw new InternalServerErrorException(`No se puede crear el Pokemon - Revisar server logs`);
    }
  //*-------------------FINALIZA METODO PARA EVALUAR ERRORES-------------------*/
}