import app from '../../src/app.js';
import request from 'supertest';
import { expect } from 'chai';

describe('Logger Routes - Integration Test', () => {
	it('loggerTest -> should log at all levels and respond with success', async () => {
		const response = await request(app).get('/api/loggerTest');
		expect(response.status).to.equal(200);
		expect(response.body.status).to.equal('success');
	});

	it('failPromiseTest -> should catch promise rejection and respond with 500', async () => {
		const response = await request(app).get('/api/loggerTest/fail');
		expect(response.status).to.equal(500);
		expect(response.body.error).to.be.true;
		expect(response.body.message).to.equal(
			'Unexpected server error - Try later or contact your administrator'
		);
	});

	it('boomTest -> should throw error and respond with 500', async () => {
		const response = await request(app).get('/api/loggerTest/boom');
		expect(response.status).to.equal(500);
		expect(response.body.error).to.be.true;
		expect(response.body.message).to.equal(
			'Unexpected server error - Try later or contact your administrator'
		);
	});
});
