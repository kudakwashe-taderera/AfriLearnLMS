import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

declare global {
  namespace Express {
    // Define the User interface for Express without circular reference
    interface User {
      id: number;
      username: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
      profileImage: string | null;
      phone?: string;
      dateOfBirth?: Date;
      address?: string;
      city?: string;
      country?: string;
      bio?: string;
      currentEducationLevel?: string;
      joinDate: Date;
      lastActive?: Date;
      verified: boolean;
      employerId?: number;
      universityId?: number;
      ministryDepartment?: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Token generation for verification and password reset
const generateToken = (payload: any, expiresIn: string = '24h') => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn });
};

// Send verification email
const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email - AfriLearnHub',
    html: `
      <h1>Welcome to AfriLearnHub!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset your password - AfriLearnHub',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });
};

export function setupAuth(app: Express) {
  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "afrilearn-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure authentication strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        
        if (!(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Incorrect password." });
        }
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword as User);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialization and deserialization for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword as User);
    } catch (error) {
      done(error, null);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(req.body.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingUserByEmail = await storage.getUserByEmail(req.body.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create user with hashed password
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
        profileImage: null,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Log in the user automatically after registration
      req.login(userWithoutPassword, (err: any) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          message: info?.message || "Authentication failed",
        });
      }
      req.login(user, (err: any) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err: any) => {
      if (err) return next(err);
      req.session.destroy((err: any) => {
        if (err) return next(err);
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logged out successfully" });
      });
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  // Email verification endpoint
  app.post("/api/verify-email", async (req, res) => {
    try {
      const { token } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
      
      // Update user's verified status
      await storage.updateUser(decoded.userId, { verified: true });
      
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired verification token" });
    }
  });

  // Forgot password endpoint
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (user) {
        const token = generateToken({ userId: user.id }, '1h');
        await sendPasswordResetEmail(email, token);
      }
      
      // Always return success to prevent email enumeration
      res.json({ message: "If the email exists, a reset link has been sent" });
    } catch (error) {
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Reset password endpoint
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
      
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(decoded.userId, { password: hashedPassword });
      
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired reset token" });
    }
  });

  // Middleware to check if the user is authenticated
  app.use("/api/protected/*", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  });
}