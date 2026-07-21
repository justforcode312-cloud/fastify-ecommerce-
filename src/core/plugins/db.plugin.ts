import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose, { type ConnectionStates } from 'mongoose';

import { env } from '@/core/config/env.config';

async function dbPlugin(fastify: FastifyInstance): Promise<void> {
  if (mongoose.connection.readyState === (1 as ConnectionStates)) {
    return;
  }

  mongoose.connection.on('connected', () => {
    fastify.log.info('🔌 MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err: Error) => {
    fastify.log.error(err, '❌ MongoDB connection error');
  });

  mongoose.connection.on('disconnected', () => {
    fastify.log.warn('🔌 MongoDB disconnected');
  });

  try {
    // Set a serverSelectionTimeoutMS so we fail fast (5s) instead of hanging and timing out the plugin loading.
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    fastify.log.error(err, '❌ Failed to connect to MongoDB during startup');
    throw err;
  }

  // Decorate fastify instance with mongoose
  fastify.decorate('mongoose', mongoose);

  // Close connection when server closes
  fastify.addHook('onClose', async () => {
    fastify.log.info('🔌 Closing MongoDB connection...');
    await mongoose.disconnect();
  });
}

export default fp(dbPlugin, { name: 'db' });
