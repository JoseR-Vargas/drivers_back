import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	// Configuración de CORS para desarrollo y producción
	const allowedOrigins = [
		'http://localhost:8000',
		'http://127.0.0.1:8000',
		'http://localhost:3000',
		'https://driversform.netlify.app',
		'https://driversform.netlify.app/'
	];

	app.enableCors({
		origin: function (origin, callback) {
			// Permitir requests sin origin (como mobile apps o curl)
			if (!origin) return callback(null, true);
			
			// Permitir orígenes en la lista o en desarrollo
			if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
				callback(null, true);
			} else {
				callback(null, true); // En producción, permitir todos por ahora (ajustar según necesidad)
			}
		},
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});

	await app.listen(process.env.PORT ?? 3000);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
