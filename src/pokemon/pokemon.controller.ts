import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  //*-------------------INICIO CODIGO PARA INSERTAR REGISTROS NUEVOS EN LA BASE DE DATOS  -------------------*/
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }
  //*-------------------FINALIZA CODIGO PARA INSERTAR REGISTROS NUEVOS EN LA BASE DE DATOS -------------------*/


  //*-------------------INICIO CODIGO PARA CONSULTAR TODOS LOS REGISTROS NUEVOS EN LA BASE DE DATOS  -------------------*/
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pokemonService.findAll(paginationDto);
  }
  //*-------------------FINALIZA CODIGO PARA CONSULTAR TODOS LOS REGISTROS NUEVOS EN LA BASE DE DATOS  -------------------*/


  //*-------------------INICIO CODIGO PARA CONSULTAR REGISTROS EN LA BASE DE DATOS-------------------*/
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }
  //*-------------------FINALIZA CODIGO PARA CONSULTAR REGISTROS EN LA BASE DE DATOS-------------------*/


  //*-------------------INICIO CODIGO PARA ACTUALIZAR REGISTROS EN LA BASE DE DATOS-------------------*/
  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {    
    return this.pokemonService.update(term, updatePokemonDto);
  }
  //*-------------------FINALIZA CODIGO PARA ACTUALIZAR REGISTROS EN LA BASE DE DATOS-------------------*/
  

  //*-------------------INICIO CODIGO PARA BORRAR REGISTROS EN LA BASE DE DATOS-------------------*/
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
  //*-------------------FINALIZA CODIGO PARA BORRAR REGISTROS EN LA BASE DE DATOS-------------------*/
}
