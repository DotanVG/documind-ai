// __tests__/server.test.js
const request = require('supertest');
const { app, closeServer, createUploadMiddleware } = require('../server');
const db = require('../db');
const { analyzeDocument } = require('../services/aiService');

jest.mock('../db', () => ({
    query: jest.fn(),
}));

jest.mock('../services/aiService', () => ({
    analyzeDocument: jest.fn(),
}));

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn().mockResolvedValue('mock file content'),
        unlink: jest.fn().mockResolvedValue(),
    },
}));

jest.mock('multer', () => {
    const multer = jest.fn(() => ({
        single: () => (req, res, next) => {
            req.file = {
                buffer: Buffer.from('mock file content'),
                originalname: 'test.txt',
            };
            next();
        },
    }));
    multer.diskStorage = jest.fn();
    return multer;
});

describe('DocuMind AI Server', () => {
    afterAll(async () => {
        await closeServer();
    });

    describe('Wake-up Route', () => {
        it('should return a 200 status and a ready message', async () => {
            const response = await request(app).get('/api/wakeUp');

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe(
                'Backend server is awake and ready!'
            );
        });
    });

    describe('Database Test Route', () => {
        it('should return the current timestamp on successful database query', async () => {
            const mockTimestamp = new Date().toISOString();
            db.query.mockResolvedValue({ rows: [{ now: mockTimestamp }] });

            const response = await request(app).get('/api/test-db');

            expect(response.statusCode).toBe(200);
            expect(response.body.result.now).toBe(mockTimestamp);
            expect(db.query).toHaveBeenCalledWith('SELECT NOW()');
        });

        it('should return a 500 error on database query failure', async () => {
            db.query.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/test-db');

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Database connection failed');
        });
    });

    describe('Analyze Route', () => {
        it('should return a 400 error if no query is provided', async () => {
            const response = await request(app)
                .post('/api/analyze')
                .attach('file', Buffer.from('test file content'), 'test.txt');

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('No query provided');
        });

        // TODO: Implement document analysis for this test
        // it('should analyze a document and return the result', async () => {
        //     const mockResult = 'Mock analysis result';
        //     analyzeDocument.mockResolvedValue(mockResult);

        //     const response = await request(app)
        //         .post('/api/analyze')
        //         .field('query', 'test query')
        //         .attach('file', Buffer.from('test file content'), 'test.txt');

        //     expect(response.statusCode).toBe(200);
        //     expect(response.body.result).toBe(mockResult);
        //     expect(analyzeDocument).toHaveBeenCalledWith(
        //         'mock file content',
        //         'test query'
        //     );
        // });
    });
});
