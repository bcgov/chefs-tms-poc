import request from 'supertest';
import app from '../app'; 
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

let PostgreSqlContainer;
try {
  const module = require('@testcontainers/postgresql');
  PostgreSqlContainer = module.PostgreSqlContainer;
} catch (e) {
  try {
    const module = require('testcontainers');
    PostgreSqlContainer = module.PostgreSqlContainer;
  } catch (err) {
    console.error('Could not import PostgreSqlContainer:', err);
    process.exit(1);
  }
}

dotenv.config();
const testApp = new app().app;

let container;
let dataSource: DataSource;

beforeAll(async () => {
  try {
    console.log('Starting PostgreSQL container...');
    container = await new PostgreSqlContainer()
      .withExposedPorts(5432)
      .start();
    
    console.log('Container started successfully');
    console.log(`Host: ${container.getHost()}`);
    console.log(`Port: ${container.getMappedPort(5432)}`);
    console.log(`Username: ${container.getUsername()}`);
    console.log(`Database: ${container.getDatabase()}`);

    const testConfig = {
      type: 'postgres' as const,
      host: container.getHost(),
      port: container.getMappedPort(5432),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase() || 'postgres', 
      synchronize: false,
      logging: true,
      entities: ['src/entities/**/*.ts'],
      migrations: ['./src/migrations/*.ts'],
      subscribers: ['src/subscribers/**/*.ts'],
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers'
      }
    };

    console.log('Initializing database connection...');
    dataSource = new DataSource(testConfig);
    await dataSource.initialize();
    console.log('Database connection initialized successfully');

    console.log('Running migrations...');
    await dataSource.runMigrations();
    console.log('Migrations completed');
  } catch (error) {
    console.error('Error in beforeAll:', error);
    throw error;
  }
}, 60000); 

afterAll(async () => {
  try {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
    
    if (container) {
        await container.stop({
            removeVolumes: true,
            force: true
          });
      await container.removeVolumes()
      console.log('Container stopped');
    }
  } catch (error) {
    console.error('Error in afterAll:', error);
  } finally {
    console.log('Test completed, cleaning up...');
  }
});

describe('Health Check API', () => {
  it('should return 200 OK', async () => {
    const response = await request(testApp).get('/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ apiStatus: 'Healthy' });
  });
});

describe('Create Tenant API', () => {
    it('should return 201 Created', async () => {
      const response = await request(testApp).post('/v1/tenants').send({
        "name": "T1",
        "ministryName": "Newwd Mtinwistry",
        "user": {
          "firstName": "Shankar",
          "lastName": "Sethuraman",
          "displayName": "Sethuraman, Shankar: JEDI: EX",
          "userName": "SSETHURA",
          "ssoUserId": "fd33f1cef7ca4b19a71104d4ecf7066b",
          "email": "shankar1@gov.bc.ca"
        }
      });
      
      console.log(response.body);
    });
  });