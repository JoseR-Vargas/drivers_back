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
		const fechaInicio = new Date(fecha);
		fechaInicio.setHours(0, 0, 0, 0);

		const fechaFin = new Date(fecha);
		fechaFin.setHours(23, 59, 59, 999);

		return this.driverModel.find({
			createdAt: {
				$gte: fechaInicio,
				$lte: fechaFin
			}
		}).sort({ createdAt: -1 }).exec();
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
