const request = require('supertest')
const app = require('../src/app')

describe('Express API Tests', () => {
  // Test root endpoint
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/')
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('version')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body.message).toContain('Welcome')
    })
  })

  // Test health endpoint
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health')
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status', 'healthy')
      expect(response.body).toHaveProperty('uptime')
      expect(response.body).toHaveProperty('timestamp')
    })
  })

  // Test users endpoint
  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request(app).get('/api/users')
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('users')
      expect(Array.isArray(response.body.users)).toBe(true)
      expect(response.body.users.length).toBeGreaterThan(0)
    })
  })

  // Test single user endpoint
  describe('GET /api/users/:id', () => {
    it('should return a single user', async () => {
      const response = await request(app).get('/api/users/1')
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('user')
      expect(response.body.user).toHaveProperty('id', 1)
      expect(response.body.user).toHaveProperty('name')
      expect(response.body.user).toHaveProperty('email')
    })

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/999')
      
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'User not found')
    })
  })

  // Test create user endpoint
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com'
      }
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
      
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('message', 'User created successfully')
      expect(response.body.user).toHaveProperty('name', newUser.name)
      expect(response.body.user).toHaveProperty('email', newUser.email)
    })

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' })
      
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error', 'Name and email are required')
    })

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Test User' })
      
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error', 'Name and email are required')
    })
  })

  // Test 404 handler
  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route')
      
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'Route not found')
    })
  })
})
