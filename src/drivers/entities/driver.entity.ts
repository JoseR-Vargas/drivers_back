import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Driver extends Document {
	@Prop({ required: true })
	nombreApellido: string;

	@Prop({ required: true })
	patente: string;

	@Prop({ required: true })
	ruta: string;

	@Prop({ required: true, type: Number })
	numeroPaquetes: number;

	@Prop({ required: true, type: Number })
	paquetesRecibidos: number;

	@Prop({ required: true, type: Number })
	cantidadParadas: number;

	@Prop({ type: Number, default: null })
	paquetesEntregados?: number;

	@Prop({ type: Number, default: null })
	paquetesDevueltos?: number;

	@Prop({ type: String, default: null })
	observaciones?: string;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
