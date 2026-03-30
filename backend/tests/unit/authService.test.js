const User = require('../../src/models/User');
const Session = require('../../src/models/Session');

// Mock mongoose
jest.mock('../../src/models/User');
jest.mock('../../src/models/Session');
jest.mock('../../src/utils/tokenUtils', () => ({
  generateToken: jest.fn(() => 'mock-jwt-token'),
}));

const authService = require('../../src/services/authService');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        save: jest.fn().mockResolvedValue({}),
      };

      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => mockUser);
      Session.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({}),
      }));

      const result = await authService.register(
        'John Doe',
        'john@example.com',
        'Str0ng!Pass123'
      );

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.token).toBeDefined();
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const existingUser = {
        _id: 'user123',
        email: 'john@example.com',
      };

      User.findOne.mockResolvedValue(existingUser);

      await expect(
        authService.register('John Doe', 'john@example.com', 'Str0ng!Pass123')
      ).rejects.toThrow('User already exists with this email');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$xyz', // hashed password
        isAccountLocked: jest.fn().mockReturnValue(false),
        matchPassword: jest.fn().mockResolvedValue(true),
        recordSuccessfulLogin: jest.fn().mockResolvedValue({}),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      Session.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({}),
      }));

      const result = await authService.login(
        'john@example.com',
        'Str0ng!Pass123'
      );

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.token).toBeDefined();
    });

    it('should throw error for invalid credentials', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(
        authService.login('john@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      User.findById.mockResolvedValue(mockUser);

      const result = await authService.getUserById('user123');

      expect(result.name).toBe('John Doe');
      expect(User.findById).toHaveBeenCalledWith('user123');
    });

    it('should throw error if user not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(authService.getUserById('invalidId')).rejects.toThrow(
        'User not found'
      );
    });
  });
});
