import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	// Configuración de CORS para desarrollo y producción
	const allowedOrigins = [
		'http://localhost:8000',
		'http://127.0.0.1:8000',
		'http://localhost:3000',
		'http://localhost:5500',
		'http://127.0.0.1:5500',
		'https://driversform.netlify.app',
		'https://drivers-back-479x.onrender.com',
		process.env.FRONTEND_URL
	].filter(Boolean);

	console.log('🔒 CORS - Orígenes permitidos:', allowedOrigins);
	console.log('🌍 Entorno:', process.env.NODE_ENV);

	app.enableCors({
		origin: function (origin, callback) {
			console.log('🌐 Request desde origen:', origin);
			
			// Permitir requests sin origin (como Postman, mobile apps)
			if (!origin) {
				console.log('✅ Sin origen - Permitido');
				return callback(null, true);
			}
			
			// Verificar si el origen está en la lista permitida
			if (allowedOrigins.indexOf(origin) !== -1) {
				console.log('✅ Origen permitido:', origin);
				callback(null, true);
			} else if (process.env.NODE_ENV !== 'production') {
				// En desarrollo, permitir todos los orígenes
				console.log('✅ Modo desarrollo - Origen permitido:', origin);
				callback(null, true);
			} else {
				// En producción, rechazar orígenes no permitidos
				console.warn('❌ CORS blocked origin:', origin);
				callback(new Error('Not allowed by CORS'), false);
			}
		},
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
		credentials: true,
		preflightContinue: false,
		optionsSuccessStatus: 204
	});

	// Configurar puerto (Render usa la variable PORT)
	const port = process.env.PORT || 3000;
	await app.listen(port, '0.0.0.0');
	
	console.log(`🚀 Application is running on: http://localhost:${port}`);
	console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
