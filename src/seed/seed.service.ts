import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  //*Dependencia de axios
  private readonly axios: AxiosInstance = axios;

  async executeSeed(){
    
    //*La peticion HTTP la hacemos con Axios. Comando para instalar: yarn add axios
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limint=10');

    data.results.forEach(({name, url}) => {

      const segments = url.split('/');
      const no:number = +segments[segments.length -2];
      //console.log(segments)
      console.log(name, no);

    })

    return data.results;
  }


}
