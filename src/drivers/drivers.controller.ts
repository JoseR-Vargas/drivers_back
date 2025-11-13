import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('drivers')
export class DriversController {
	constructor(private readonly driversService: DriversService) {}

	@Post()
	async create(@Body() createDriverDto: CreateDriverDto) {
		try {
			return await this.driversService.create(createDriverDto);
		} catch (error) {
			if (error.name === 'ValidationError') {
				const messages = Object.values(error.errors).map((err: any) => err.message);
				throw new HttpException(
					{ message: 'Error de validación', errors: messages },
					HttpStatus.BAD_REQUEST
				);
			}
			throw new HttpException(
				{ message: 'Error al crear el conductor', error: error.message },
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@Get()
	findAll(@Query('fecha') fecha?: string) {
		if (fecha) {
			return this.driversService.findByDate(fecha);
		}
		return this.driversService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.driversService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
		return this.driversService.update(id, updateDriverDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		try {
			const resultado = await this.driversService.remove(id);
			if (!resultado) {
				throw new HttpException(
					{ message: 'Registro no encontrado' },
					HttpStatus.NOT_FOUND
				);
			}
			return { message: 'Registro eliminado correctamente', id: id };
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				{ message: 'Error al eliminar el registro', error: error.message },
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
}
