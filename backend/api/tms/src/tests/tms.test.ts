import request from 'supertest';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
const dbConfig = require('../ormconfig');
dotenv.config();

let PostgreSqlContainer, testApp, App, container
let dataSource: DataSource;

beforeAll(async () => {

  try {
    const containerModule = require('@testcontainers/postgresql');
    PostgreSqlContainer = containerModule.PostgreSqlContainer;
  } catch (e) {
    try {
      const containerModule = require('testcontainers');
      PostgreSqlContainer = containerModule.PostgreSqlContainer;
    } catch (err) {
      console.error('Could not import PostgreSqlContainer:', err);
      process.exit(1);
    }
  }
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

    console.log('Container started...');

    dataSource = new DataSource(dbConfig);
    await dataSource.initialize();
    console.log('Database connection initialized successfully');

    console.log('Running migrations...');
    await dataSource.runMigrations();

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

let tenantId:string

  describe('Create Tenant', () => {
    it('should return basic tenant 201 Created', async () => {      
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
      expect(response.body.data.tenant).toMatchObject({ name: "Test Tenant" });
      expect(response.body.data.tenant.users[0].ssoUser).toMatchObject({ ssoUserId: "fd33f1cef7ca4b19a71104d4ecf7066b" });
      tenantId = response.body.data.tenant.id;
    });
  });

  describe( 'Get Tenant', () => {
    it('should return a basic tenant with 200', async () => {
      const response = await request(testApp).get(`/v1/tenants/${tenantId}`);
      expect(response.status).toBe(200);
      expect(response.body.data.tenant).toMatchObject({ id: tenantId });
    });
  });

  describe('Add user to a tenant', () => {
    it('should return basic user created and added to tenant - 201', async () => {      
      const response = await request(testApp).post(`/v1/tenants/${tenantId}/users`).send({
        "user": {
          "firstName": "Rocket",
          "lastName": "Raccoon",
          "displayName": "Raccoon, Rocket: MIN: EX",
          "userName": "RACCOOR",
          "ssoUserId": "ad43f1cef7ca4b19a71104d4ecf7066d",
          "email": "rocket.raccoon@gov.bc.ca"
        }
      }); 
      expect(response.status).toBe(201);            
      expect(response.body.data.user.ssoUser).toMatchObject({ ssoUserId: "ad43f1cef7ca4b19a71104d4ecf7066d" });      
    });
  });

  describe('Add a role to a tenant', () => {
    it('should return role created and added to tenant - 201', async () => {      
      const response = await request(testApp).post(`/v1/tenants/${tenantId}/roles`).send({
        "role": {
          "name": "LOB.CUSTOM_ROLE",
          "description":"Custom role for LOB"
      }
      }); 
      expect(response.status).toBe(201);            
      expect(response.body.data.role).toMatchObject({ name: "LOB.CUSTOM_ROLE" });      
    });
  });
