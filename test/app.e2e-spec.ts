import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { authRegisterDto } from '../src/testing/auth-register-dto.mock';
import { authLoginDto } from '../src/testing/auth-login-dto.mock';
import { Role } from '../src/enums/role.enum';
import dataSource from '../typeorm/data-source';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('Register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authRegisterDto);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
  });

  it('Login new register user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authLoginDto);
    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');

    accessToken = response.body.accessToken;
  });

  it('Get userData from loggedUser', async () => {
    const response = await await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.id).toEqual('number');
    expect(response.body.role).toEqual(Role.User);

    accessToken = response.body.accessToken;
    userId = response.body.id;
  });

  it('Register another user with Admin Role', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...authRegisterDto,
        role: Role.Admin,
        email: 'newUser@teste.com',
      });

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');

    accessToken = response.body.accessToken;
  });

  it('Get userData from the second loggedUser and verify if second user had Role.User ', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).toEqual(201);
    expect(response.body.id).toEqual(2);
    expect(response.body.role).toEqual(Role.User);

    accessToken = response.body.accessToken;
    userId = response.body.id;
  });

  it('Try List all users with second user and need to return error', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).toEqual(403);
    expect(response.body.error).toEqual('Forbidden');
  });

  it('Manually changing the role of second user', async () => {
    const ds = await dataSource.initialize();

    const queryRunner = ds.createQueryRunner();

    await queryRunner.query(`
      UPDATE users SET role = ${Role.Admin} WHERE id = ${userId};
    `);

    const rows = await queryRunner.query(
      `SELECT * FROM users WHERE id = ${userId};`,
    );

    //close connections
    dataSource.destroy();

    expect(rows.length).toEqual(1);
    expect(rows[0].id).toEqual(userId);
    expect(rows[0].role).toEqual(Role.Admin);
  });

  // it('Try', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/users')
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .send();

  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body.length).toEqual(2);
  // });
});
