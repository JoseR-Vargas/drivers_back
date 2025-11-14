import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriversService {
	constructor(
		@InjectModel(Driver.name) private driverModel: Model<Driver>
	) {}

	async create(createDriverDto: CreateDriverDto): Promise<Driver> {
		const createdDriver = new this.driverModel(createDriverDto);
		return createdDriver.save();
	}

	async findAll(): Promise<Driver[]> {
		return this.driverModel.find().sort({ createdAt: -1 }).exec();
	}

	async findByDate(fecha: string): Promise<Driver[]> {
		// Parsear la fecha en formato YYYY-MM-DD
		const [año, mes, dia] = fecha.split('-').map(Number);
		
		// Crear fechas en UTC pero ajustadas para cubrir todo el día en Argentina (UTC-3)
		// Si son las 23:51 en Argentina del 13/11, en UTC es 02:51 del 14/11
		// Por eso necesitamos ampliar el rango
		const fechaInicio = new Date(Date.UTC(año, mes - 1, dia, 0, 0, 0, 0));
		fechaInicio.setUTCHours(fechaInicio.getUTCHours() - 6); // Ampliar 6 horas antes
		
		const fechaFin = new Date(Date.UTC(año, mes - 1, dia, 23, 59, 59, 999));
		fechaFin.setUTCHours(fechaFin.getUTCHours() + 6); // Ampliar 6 horas después

		console.log('Filtro de fecha (Argentina UTC-3):', {
			fechaOriginal: fecha,
			fechaInicio: fechaInicio.toISOString(),
			fechaFin: fechaFin.toISOString()
		});

		const resultados = await this.driverModel.find({
			createdAt: {
				$gte: fechaInicio,
				$lte: fechaFin
			}
		}).sort({ createdAt: -1 }).exec();

		// Filtrar en la aplicación para ser más precisos con la fecha local de Argentina
		const resultadosFiltrados = resultados.filter(doc => {
			if (!doc.createdAt) return false;
			
			const fechaDoc = new Date(doc.createdAt);
			// Convertir a fecha local de Argentina (UTC-3)
			const fechaLocal = new Date(fechaDoc.getTime() - (3 * 60 * 60 * 1000));
			const diaLocal = fechaLocal.getUTCDate();
			const mesLocal = fechaLocal.getUTCMonth() + 1;
			const añoLocal = fechaLocal.getUTCFullYear();
			
			return diaLocal === dia && mesLocal === mes && añoLocal === año;
		});

		console.log(`Encontrados: ${resultados.length} en DB, ${resultadosFiltrados.length} después de filtrar por zona horaria`);

		return resultadosFiltrados;
	}

	async findOne(id: string): Promise<Driver | null> {
		return this.driverModel.findById(id).exec();
	}

	async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver | null> {
		return this.driverModel.findByIdAndUpdate(id, updateDriverDto, { new: true }).exec();
	}

	async remove(id: string): Promise<Driver | null> {
		return this.driverModel.findByIdAndDelete(id).exec();
	}
}
