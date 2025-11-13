import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver, DriverSchema } from './entities/driver.entity';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }])
	],
	controllers: [DriversController],
	providers: [DriversService],
})
export class DriversModule {}
