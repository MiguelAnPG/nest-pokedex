import { promises } from "dns";

//*Definicion de la clase adaptadora
export interface HttpAdapter{
    get<T>(url:string): Promise<T>;
}
