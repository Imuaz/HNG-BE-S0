import getCatFact from '../services/catFactService.js';
import ApiError from '../utils/ApiError.js';


const getProfile = async (req, res, next) => {
  try {
    // Fetch cat fact from external API
    const catFact = await getCatFact();

    // Get current UTC timestamp in ISO 8601 format
    const timestamp = new Date().toISOString();

    // Build response according to specification
    const response = {
      status: 'success',
      user: {
        email: process.env.USER_EMAIL || 'your.email@example.com',
        name: process.env.USER_NAME || 'Your Full Name',
        stack: process.env.USER_STACK || 'Node.js/Express'
      },
      timestamp: timestamp,
      fact: catFact
    };

    // Set Content-Type header explicitly (though Express does this by default)
    res.setHeader('Content-Type', 'application/json');
    
    // Return successful response
    return res.status(200).json(response);

  } catch (error) {
    // Log error server-side for diagnostics, then transform into a profile-level ApiError
    console.error('Error in /me endpoint (service error):', {
      message: error.message,
      stack: error.stack
    });

    // Wrap upstream error into a profile-level ApiError so middleware can map it
    const httpStatus = (error && error.httpStatus) ? error.httpStatus : 500;
    const profileError = new ApiError('PROFILE_FETCH_FAILED', 'Failed to fetch profile data', httpStatus);
    // preserve the upstream message for debug (not sent to production clients)
    profileError.causeMessage = error.message;

    return next(profileError);
  }
};

export { getProfile };