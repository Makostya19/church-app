const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Church App API',
      version: '1.0.0',
      description: 'API documentation for Church Community App',
    },
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register new user',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'User created' }, 409: { description: 'Email exists' } },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login with email and password',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Login successful' }, 401: { description: 'Invalid credentials' } },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Current user' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/events': {
        get: {
          tags: ['Events'],
          summary: 'Get published events',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'List of events' } },
        },
        post: {
          tags: ['Events'],
          summary: 'Create event (Admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    event_date: { type: 'string' },
                    location: { type: 'string' },
                    category: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Event created' }, 403: { description: 'Forbidden' } },
        },
      },
      '/api/events/{id}': {
        get: {
          tags: ['Events'],
          summary: 'Get event by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Event details' }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Events'],
          summary: 'Update event (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Updated' }, 403: { description: 'Forbidden' } },
        },
        delete: {
          tags: ['Events'],
          summary: 'Delete event (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' }, 403: { description: 'Forbidden' } },
        },
      },
      '/api/events/{id}/status': {
        patch: {
          tags: ['Events'],
          summary: 'Change event status (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { type: 'object', properties: { status: { type: 'string' } } },
              },
            },
          },
          responses: { 200: { description: 'Status updated' } },
        },
      },
      '/api/announcements': {
        get: {
          tags: ['Announcements'],
          summary: 'Get published announcements',
          responses: { 200: { description: 'List of announcements' } },
        },
        post: {
          tags: ['Announcements'],
          summary: 'Create announcement (Admin)',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/favorites': {
        get: {
          tags: ['Favorites'],
          summary: 'Get my favorites',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of favorites' } },
        },
        post: {
          tags: ['Favorites'],
          summary: 'Add to favorites',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    targetType: { type: 'string' },
                    targetId: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Added' }, 409: { description: 'Already exists' } },
        },
        delete: {
          tags: ['Favorites'],
          summary: 'Remove from favorites',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Removed' } },
        },
      },
      '/api/reviews': {
        get: {
          tags: ['Reviews'],
          summary: 'Get reviews for target',
          parameters: [
            { name: 'targetType', in: 'query', schema: { type: 'string' } },
            { name: 'targetId', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'List of reviews' } },
        },
        post: {
          tags: ['Reviews'],
          summary: 'Create review',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    targetType: { type: 'string' },
                    targetId: { type: 'integer' },
                    rating: { type: 'integer' },
                    comment: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/prayer-requests': {
        get: {
          tags: ['Prayer Requests'],
          summary: 'Get prayer requests',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of prayer requests' } },
        },
        post: {
          tags: ['Prayer Requests'],
          summary: 'Create prayer request',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    isPrivate: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/ministries': {
        get: {
          tags: ['Ministries'],
          summary: 'Get all ministries',
          responses: { 200: { description: 'List of ministries' } },
        },
        post: {
          tags: ['Ministries'],
          summary: 'Create ministry (Admin)',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/resources': {
        get: {
          tags: ['Resources'],
          summary: 'Get published resources',
          responses: { 200: { description: 'List of resources' } },
        },
        post: {
          tags: ['Resources'],
          summary: 'Create resource (Admin)',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/admin/dashboard': {
        get: {
          tags: ['Admin'],
          summary: 'Get dashboard statistics',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Dashboard stats' } },
        },
      },
      '/api/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'Get all users',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of users' } },
        },
      },
      '/api/ai/images': {
        post: {
          tags: ['AI'],
          summary: 'Generate AI image (Admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { prompt: { type: 'string' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Generated image' } },
        },
      },
    },
  },
  apis: [],
};

const specs = swaggerJsdoc(options);
module.exports = specs;