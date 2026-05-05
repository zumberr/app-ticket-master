const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Ticket = require('../src/models/ticket.model');
const Category = require('../src/models/category.model');

describe('Ticket Endpoints', () => {
  let token;
  let userId;
  let categoryId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_tickets_test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany();
    await Ticket.deleteMany();
    await Category.deleteMany();

    // Crear categoría de prueba
    const category = await Category.create({
      name: 'Soporte Técnico',
      description: 'Problemas técnicos',
      color: '#3B82F6'
    });
    categoryId = category._id;

    // Registrar usuario de prueba
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'student@university.edu',
        password: 'Test123!',
        firstName: 'Ana',
        lastName: 'García',
        studentId: 'STU-2024-002'
      });

    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  describe('POST /api/v1/tickets', () => {
    it('should create a new ticket', async () => {
      const res = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Problema con WiFi',
          description: 'No puedo conectarme a la red WiFi del campus',
          category: categoryId,
          priority: 'high'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ticket).toHaveProperty('ticketNumber');
    });
  });

  describe('GET /api/v1/tickets', () => {
    it('should get list of tickets', async () => {
      const res = await request(app)
        .get('/api/v1/tickets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('tickets');
      expect(res.body.data).toHaveProperty('pagination');
    });
  });
});
