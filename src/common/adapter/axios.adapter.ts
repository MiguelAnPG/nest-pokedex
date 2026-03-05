import axios, {AxiosInstance} from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosAdapter implements HttpAdapter{
    private axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            //Desestructuracion de los datos con corchetes: {data}
            const {data} = await this.axios.get<T>(url);
            return data;
        } 
        catch (error) {
            throw new error('A ocurrido un error -Revisar log');
        }
    }

}