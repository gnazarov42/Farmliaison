import UrlPattern from 'url-pattern';
import { getServerSession } from '#auth';

// Define endpoints with authentication requirements
const endpoints = [
  { path: '/api/:locale/user/:id', methods: { GET: false, PUT: true } },
  { path: '/api/:locale/languages', methods: { GET: false } },
  { path: '/api/:locale/specialties', methods: { GET: false } },
  { path: '/api/:locale/specialties/new', methods: { POST: true } },
  { path: '/api/:locale/event/:id', methods: { GET: false, PUT: true } }, // Handles GET without auth
  { path: '/api/:locale/event/new', methods: { PUT: true } },
  { path: '/api/:locale/farm/:id', methods: { GET: false, PUT: true } }, // Handles GET without auth
  { path: '/api/:locale/farm/new', methods: { PUT: true } },
  { path: '/api/:locale/farm/:farmSlug/product/new', methods: { POST: true } },
  { path: '/api/:locale/farm/:farmSlug/product', methods: { GET: false } },
  {
    path: '/api/:locale/farm/:farmSlug/product/:productId',
    methods: { PUT: true },
  },
  {
    path: '/api/:locale/farm/:farmSlug/products/:productId',
    methods: { DELETE: true },
  },
  {
    path: '/api/:locale/media/:mediaId',
    methods: { DELETE: true },
  },
  { path: '/api/:locale/farm/:farmSlug/job/new', methods: { POST: true } },
  { path: '/api/:locale/farm/:farmSlug/job', methods: { GET: false } },
  {
    path: '/api/:locale/farm/:farmSlug/job/:jobId',
    methods: { PUT: true, DELETE: true },
  },
  { path: '/api/favorites/add', methods: { POST: true } },
  { path: '/api/favorites/remove', methods: { POST: true } },
  { path: '/api/favorites/get', methods: { GET: true } },
  { path: '/api/:locale/ffarm', methods: { GET: true } },
  { path: '/api/:locale/fevent', methods: { GET: true } },

  // Review-related endpoints
  { path: '/api/:locale/review', methods: { POST: true, GET: false } }, // Create and fetch reviews
  { path: '/api/:locale/review/:id', methods: { PUT: true, DELETE: true } }, // Update and delete a specific review
  {
    path: '/api/:locale/review/:id/response',
    methods: { POST: true, PUT: true },
  }, // Add/update response
  { path: '/api/:locale/review/:id/report', methods: { POST: true } }, // Report a review
  { path: '/api/:locale/contact-farmer', methods: { POST: true } }, // Contact Farmer by email
];

export default defineEventHandler(async (event) => {
  let isHandledByThisMiddleware = false;
  let requiresAuth = true;

  // Extract URL path without query parameters
  const urlPath = event.node.req.url?.split('?')[0];

  // Loop through defined endpoints to find a match
  for (const endpoint of endpoints) {
    const pattern = new UrlPattern(endpoint.path);
    const match = pattern.match(urlPath);

    if (match) {
      // Determine if the method requires authentication
      requiresAuth = endpoint.methods[event.node.req.method] ?? true;
      isHandledByThisMiddleware = true;
      break;
    }
  }

  if (!isHandledByThisMiddleware) {
    return; // Not handled by this middleware, just pass through
  }

  if (!requiresAuth) {
    return; // Proceed without authorization if not required for this method
  }

  // Check authorization for methods that require it
  const session = await getServerSession(event);
  if (!session) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Unauthorized' }),
    );
  }

  try {
    // Attach the user to the context if session exists
    event.context.currentUser = session.user;
  } catch (error) {
    console.error(
      '🚀 ~ Error in authorization middleware:',
      error instanceof Error ? error.message : error,
    );
  }
});
