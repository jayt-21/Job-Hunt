const authController = require('../../src/controllers/authController');
const authService = require('../../src/services/authService');

jest.mock('../../src/services/authService');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      userId: 'user123',
      headers: {
        'user-agent': 'Jest Test Agent',
      },
      ip: '127.0.0.1',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Str0ng!Pass123',
        confirmPassword: 'Str0ng!Pass123',
      };

      const mockUser = {
        userId: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        token: 'jwt_token',
      };

      authService.register.mockResolvedValue(mockUser);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: mockUser,
      });
    });

    it('should return error if passwords do not match', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Str0ng!Pass123',
        confirmPassword: 'Diff3rent!Pass123',
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Passwords do not match',
      });
    });

    it('should return error if password is too short', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'pass',
        confirmPassword: 'pass',
      };

      authService.register.mockRejectedValue(
        Object.assign(new Error('Password does not meet security requirements'), {
          errors: [
            'Password must be at least 8 characters long',
            'Password must contain at least one uppercase letter',
            'Password must contain at least one number',
            'Password must contain at least one special character (!@#$%^&*)',
          ],
        })
      );

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Password does not meet security requirements',
        errors: [
          'Password must be at least 8 characters long',
          'Password must contain at least one uppercase letter',
          'Password must contain at least one number',
          'Password must contain at least one special character (!@#$%^&*)',
        ],
      });
    });

    it('should return error if required fields are missing', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'All fields are required',
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      req.body = {
        email: 'john@example.com',
        password: 'Str0ng!Pass123',
      };

      const mockUser = {
        userId: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        token: 'jwt_token',
      };

      authService.login.mockResolvedValue(mockUser);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: mockUser,
      });
    });

    it('should return error for invalid credentials', async () => {
      req.body = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      authService.login.mockRejectedValue(
        new Error('Invalid email or password')
      );

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      authService.getUserById.mockResolvedValue(mockUser);

      await authController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });

    it('should return error if user not found', async () => {
      authService.getUserById.mockRejectedValue(
        new Error('User not found')
      );

      await authController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
    });
  });
});
