import request from 'supertest';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

let PostgreSqlContainer, testApp, App;

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

let container:any;
let dataSource: DataSource;

beforeAll(async () => {
  try {
    console.log('Starting PostgreSQL container...');   
    
    container = await new PostgreSqlContainer()
      .withUsername('testuser')
      .withPassword('testpassword')
      .withDatabase('testdb')
      .withExposedPorts({
        container: 5432,
        host: 54321  
      })
      .start();

    console.log('Container started successfully');

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

    dataSource = new DataSource(testConfig);
    await dataSource.initialize();
    console.log('Database connection initialized successfully');

    console.log('Running migrations...');
    await dataSource.runMigrations();

    console.log('Checking if tables exist and if migrations ran successfully before commencing tests...')
    await new Promise(resolve => setTimeout(resolve, 3000));
    const waitForDatabaseReady = async (dataSource: DataSource) => {
      for (let i = 0; i < 20; i++) {
        try {
          console.log(`Checking database readiness (attempt ${i + 1})...`);
          const tables = await dataSource.query(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
          );
          console.log('Tables in the database:', tables.map(t => t.table_name));
          return;
        } catch (error) {
          console.log('⏳ Database not ready yet, retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      throw new Error('Database not ready or migrations failed and tables were not created');
    };

    await waitForDatabaseReady(dataSource);

    App = require('../app').default;
    testApp = new App().app;
    
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
      console.log('Container stopped');
    }
  } catch (error) {
    console.error('Error in afterAll:', error);
  } finally {
    console.log('Test completed, cleaning up...');
  }
});

describe('Health Check API', () => {
  it('should return 200 OK and healthy status', async () => {
    const response = await request(testApp).get('/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ apiStatus: 'Healthy' });
  });
});


describe('Create Tenant API', () => {
    it('should return 201 Created', async () => {      
      const response = await request(testApp).post('/v1/tenants').send({
        "name": "Test Tenant",
        "ministryName": "Test Ministry",
        "user": {
          "firstName": "John",
          "lastName": "Smith",
          "displayName": "Smith, John: MIN: EX",
          "userName": "SMITHJ1",
          "ssoUserId": "fd33f1cef7ca4b19a71104d4ecf7066b",
          "email": "john.smith@gov.bc.ca"
        }
      }); 
      expect(response.status).toBe(201);
      console.log(response.body);
    });
  });