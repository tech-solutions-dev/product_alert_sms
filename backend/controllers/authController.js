const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");

class AuthService {
  constructor() {
    this.SALT_ROUNDS = 12;
    this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
  }

  // Register a new user
  async register(email, password, additionalFields = {}) {
    try {
      const existingUser = await User.findOne({
        where: {
          email: {
            [Op.iLike]: email, // Case-insensitive comparison
          },
        },
      });

      if (existingUser) {
        throw new Error("Email already in use");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

      const newUser = await User.create({
        email: email.toLowerCase(), // Store email in lowercase
        password: hashedPassword,
        ...additionalFields,
      });

      // Omit password from the returned user object
      const userData = newUser.get({ plain: true });
      delete userData.password;

      return userData;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed");
    }
  }

  // Login a user
  async login(email, password) {
    try {
      const user = await User.findOne({
        where: {
          email: {
            [Op.iLike]: email, // Case-insensitive comparison
          },
        },
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check if account is locked or disabled
      if (user.isLocked) {
        throw new Error("Account is locked. Please contact support.");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Optional: Implement failed login attempts tracking
        throw new Error("Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role, // Include any relevant user roles/permissions
        },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      );

      const userData = user.get({ plain: true });
      delete userData.password;

      return {
        token,
        expiresIn: this.JWT_EXPIRES_IN,
        user: userData,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  }

  // Validate JWT token
  async validateToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      console.error("Token validation error:", error);
      throw new Error("Invalid or expired token");
    }
  }

  //Change password for a user
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }

      if (currentPassword === newPassword) {
        throw new Error("New password must be different from current password");
      }

      const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
      await user.update({ password: hashedPassword });

      return true;
    } catch (error) {
      console.error("Password change error:", error);
      throw new Error(error.message || "Password change failed");
    }
  }
}

module.exports = AuthService;
