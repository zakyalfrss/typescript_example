import app from './app';
import envConfig from './config/env';
import { prisma } from './prisma';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    console.log('🚀 Starting server...');
    console.log(`📁 Environment: ${envConfig.NODE_ENV}`);
    
    // Test database connection
    try {
      console.log('🔗 Testing database connection...');
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      
      // Test a simple query
      const userCount = await prisma.user.count();
      console.log(`📊 Database has ${userCount} users`);
    } catch (dbError: any) {
      console.error('❌ Database connection error:', dbError.message);
      console.log('⚠️ Starting server without database connection...');
    }

    // Start the server
    const port = envConfig.PORT;
    const server = app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
      console.log(`🌐 CORS Origin: ${envConfig.CORS_ORIGIN}`);
      console.log(`🩺 Health check: http://localhost:${port}/health`);
      console.log(`🔐 Auth endpoints:`);
      console.log(`   POST http://localhost:${port}/api/auth/register`);
      console.log(`   POST http://localhost:${port}/api/auth/login`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (): Promise<void> => {
      console.log('\n🛑 Received shutdown signal, closing server...');

      server.close(async () => {
        console.log('✅ HTTP server closed');

        // Close database connection
        try {
          await prisma.$disconnect();
          console.log('✅ Database connection closed');
        } catch (error) {
          console.error('❌ Error closing database connection:', error);
        }

        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⏰ Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
      console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason.message);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('⚠️ Uncaught Exception:', error.message);
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();