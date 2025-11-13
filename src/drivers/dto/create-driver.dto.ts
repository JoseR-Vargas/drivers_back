export class CreateDriverDto {
	nombreApellido: string;
	patente: string;
	ruta: string;
	numeroPaquetes: number;
	paquetesRecibidos: number;
	cantidadParadas: number;
	paquetesEntregados?: number;
	paquetesDevueltos?: number;
	observaciones?: string;
}
