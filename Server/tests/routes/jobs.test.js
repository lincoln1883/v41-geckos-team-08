const request = require('supertest');
// const baseUrl = require('../../test-config');
const baseUrl = require('../../app');
const client = require('../../src/config/db');
const { initializeDB } = require('../common/initializeDB');
const createUser = require('../common/create-user');
const createTrade = require('../common/create-trade');

const endpoint = '/jobs';
let supplier, customer, trade, city;

describe('Test jobs', () => {
	beforeAll(async () => {
		await initializeDB(client);

		supplier = await (
			await createUser('supplier@mail.com', 'Pas$W0rd123', true)
		).body.data;

		customer = await (
			await createUser('customer@mail.com', 'Pas$W0rd123', false)
		).body.data;

		trade = await (await createTrade('new trade')).body.data;

		const countries = await (
			await request(baseUrl).get('/locations')
		).body.data;

		const country = countries.find((pais) => pais.name === 'Ecuador');

		const cities = await (
			await request(baseUrl).get(`/locations/${country.uuid}`)
		).body.data;

		city = cities.find((ciudad) => ciudad.name === 'Quito');
	});
	afterAll(async () => {
		await client.end();
	});
	describe('Create a job', () => {
		describe('Given the json is incomplete', () => {
			it('should return 400 if there is no trade_uuid', async () => {
				const response = await request(baseUrl).post(endpoint).send({});
				expect(response.statusCode).toBe(400);
			});
			it('should return 400 if there is no customer_uuid', async () => {
				const response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
				});
				expect(response.statusCode).toBe(400);
			});
			it('should return 400 if there is no city_uuid', async () => {
				const response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
				});
				expect(response.statusCode).toBe(400);
			});
			it('should reurn 400 if there is no description', async () => {
				const response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
				});
				expect(response.statusCode).toBe(400);
			});
		});
		describe('Given the json is complete', () => {
			it('should return 400 if trade_uuid is invalid', async () => {
				const response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'thisanin-vali-duui-dsoi-treturn404nf',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					description: 'asdfghjklñdgdghdghd',
					low_price: 0,
					high_price: 0,
					expiration_date: '2022-12-15',
				});
				expect(response.statusCode).toBe(400);
			});
			it('should return 400 if customer_uuid is invalid', async () => {
				const response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'thisanin-vali-duui-dsoi-treturn404nf',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					description: 'asdfghjklñdgdghdghd',
					low_price: 0,
					high_price: 0,
					expiration_date: '2022-12-15',
				});
				expect(response.statusCode).toBe(400);
			});
			it('should return 400 if city_uuid is invalid', async () => {
				const response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'thisanin-vali-duui-dsoi-treturn404nf',
					description: 'asdfghjklñdgdghdghd',
					low_price: 0,
					high_price: 0,
					expiration_date: '2022-12-15',
				});
				expect(response.statusCode).toBe(400);
			});
			it("should reurn 400 if there is no description doesn't have at least 10 characters", async () => {
				const response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					description: 'asdfgh',
					low_price: 0,
					high_price: 0,
					expiration_date: '2022-12-15',
				});
				expect(response.statusCode).toBe(400);
			});
			it('should return 422 if the low price is not a number', async () => {
				const response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					description: 'asdfghjklñdgdghdghd',
					low_price: 'ldalñjf',
					high_price: 0,
					expiration_date: '2022-12-15',
				});
				expect(response.statusCode).toBe(422);
			});
			it('should return 422 if the high price is not a number', async () => {
				const response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					description: 'asdfghjklñdgdghdghd',
					high_price: 'ldalñjf',
					low_price: 0,
					expiration_date: '2022-12-15',
				});
				expect(response.statusCode).toBe(422);
			});
			it('should return 422 if the user sends an invalid date', async () => {
				let response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					description: 'asdfghjklñdgdghdghd',
					high_price: 0,
					low_price: 0,
					expiration_date: '2022-13-15',
				});
				expect(response.statusCode).toBe(422);

				response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					description: 'asdfghjklñdgdghdghd',
					high_price: 0,
					low_price: 0,
					expiration_date: '2022-12-50',
				});
				expect(response.statusCode).toBe(422);
				response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					description: 'asdfghjklñdgdghdghd',
					high_price: 0,
					low_price: 0,
					expiration_date: '123456-12-15',
				});
				expect(response.statusCode).toBe(422);
			});
			it('should return 406 if the expiration date is in the past', async () => {
				response = await request(baseUrl).post(endpoint).send({
					trade_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					customer_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					city_uuid: 'a1bcdef2-1adc-d551-d701-74bacde40433',
					description: 'asdfghjklñdgdghdghd',
					high_price: 0,
					low_price: 0,
					expiration_date: '2020-12-15',
				});
				expect(response.statusCode).toBe(406);
			});
			it('should return 201 if the job is created', async () => {
				response = await request(baseUrl).post(endpoint).send({
					trade_uuid: trade.uuid,
					customer_uuid: customer.uuid,
					city_uuid: city.uuid,
					description: 'asdfghjklñdgdghdghd',
					high_price: 0,
					low_price: 0,
					expiration_date: '2023-12-15',
				});
				expect(response.statusCode).toBe(201);

				const job = response.body.data;
				expect(typeof job).toBe('object');
				expect(job).toHaveProperty('supplier');
				expect(job.supplier).toBe(null);
				expect(job).toHaveProperty('uuid');
				expect(job).toHaveProperty('description');
				expect(job).toHaveProperty('low_price');
				expect(job).toHaveProperty('high_price');
				expect(job).toHaveProperty('expiration_date');
				expect(job).toHaveProperty('is_taken');
				expect(job).toHaveProperty('is_completed');
			});
		});
	});
	describe('Getting all of the jobs', () => {
		describe('Given the city query parameter', () => {
			it('should return 406 when it does not exist', async () => {
				const response = await request(baseUrl).get(endpoint);

				expect(response.statusCode).toBe(406);
			});
			it('should return 200 if it exists', async () => {
				const url = `${endpoint}?city=quito`;
				const response = await request(baseUrl).get(url);

				expect(response.statusCode).toBe(200);
				expect(typeof response.body.data).toBe('object');

				const jobs = response.body.data;

				jobs.forEach((job) => {
					expect(job).toHaveProperty('uuid');
					expect(job).toHaveProperty('description');
					expect(job).toHaveProperty('low_price');
					expect(job).toHaveProperty('high_price');
					expect(job).toHaveProperty('expiration_date');
					expect(job).toHaveProperty('is_taken');
					expect(job).toHaveProperty('is_completed');
					expect(job).toHaveProperty('trade');
					expect(job.trade).toHaveProperty('uuid');
					expect(job.trade).toHaveProperty('description');
					expect(job).toHaveProperty('customer');
					expect(job.customer).toHaveProperty('uuid');
					expect(job.customer).toHaveProperty('email');
					expect(job.customer).toHaveProperty('name');
					expect(job.customer).toHaveProperty('phone');
					expect(job).toHaveProperty('city');
					expect(job.city).toHaveProperty('uuid');
					expect(job.city).toHaveProperty('name');
					expect(job).toHaveProperty('supplier');
					expect(job.supplier).toBe(null);
				});
			});
		});
	});
	describe('Getting one job by its uuid', () => {
		let queryJob;
		beforeAll(async () => {
			queryJob = await (
				await request(baseUrl).get(`${endpoint}?city=quito`)
			).body.data[0];
		});
		describe('Given they pass an invalid uuid', () => {
			it('should return 400', async () => {
				const url = `${endpoint}/thisanin-vali-duui-dsoi-treturn404nf`;
				const response = await request(baseUrl).get(url);
				expect(response.statusCode).toBe(400);
			});
			it('should return 404 if no trade is found', async () => {
				const badUUID = 'a1bcdef2-1adc-d551-d701-74bacde40433';
				const url = `${endpoint}/${badUUID}`;
				const response = await request(baseUrl).get(url);
				expect(response.statusCode).toBe(404);
			});
		});
		describe('Given they pass a valid uuid', () => {
			it('should return 200', async () => {
				const url = `${endpoint}/${queryJob.uuid}`;

				const response = await request(baseUrl).get(url);
				expect(response.statusCode).toBe(200);

				const job = response.body.data;

				expect(job).toHaveProperty('uuid');
				expect(job).toHaveProperty('description');
				expect(job).toHaveProperty('low_price');
				expect(job).toHaveProperty('high_price');
				expect(job).toHaveProperty('expiration_date');
				expect(job).toHaveProperty('is_taken');
				expect(job).toHaveProperty('is_completed');
				expect(job).toHaveProperty('trade');
				expect(job.trade).toHaveProperty('uuid');
				expect(job.trade).toHaveProperty('description');
				expect(job).toHaveProperty('customer');
				expect(job.customer).toHaveProperty('uuid');
				expect(job.customer).toHaveProperty('email');
				expect(job.customer).toHaveProperty('name');
				expect(job.customer).toHaveProperty('phone');
				expect(job).toHaveProperty('city');
				expect(job.city).toHaveProperty('uuid');
				expect(job.city).toHaveProperty('name');
				expect(job).toHaveProperty('supplier');
				expect(job.supplier).toBe(null);
			});
		});
	});
});
