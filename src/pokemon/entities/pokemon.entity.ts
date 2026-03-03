import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema() //Este decordor indica que es un esquema de base de datos
export class Pokemon extends Document{

    //id: string // Mongo ya lo da
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;

}

//Exportamos el esquema

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);