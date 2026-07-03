import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { AppDataSource } from "../app";
import { User } from "../entities/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

const userRepo = () => AppDataSource.getRepository(User);

export async function register(data: {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
}) {
  const existing = await userRepo().findOne({
    where: [{ username: data.username }, { email: data.email }],
  });
  if (existing) throw new Error("Username or email already exists");

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = userRepo().create({
    username: data.username,
    email: data.email,
    passwordHash,
    fullName: data.fullName,
    role: data.role || "viewer",
  });

  const saved = await userRepo().save(user);
  return { id: saved.id, username: saved.username, email: saved.email, fullName: saved.fullName, role: saved.role };
}

export async function login(username: string, password: string) {
  const user = await userRepo().findOne({ where: { username } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    options
  );

  return {
    accessToken: token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role, fullName: user.fullName },
  };
}

export async function findAll() {
  const users = await userRepo().find();
  return users.map(({ passwordHash, ...u }) => u as any);
}

export async function findOne(id: string) {
  const user = await userRepo().findOne({ where: { id } });
  if (!user) throw new Error("User not found");
  const { passwordHash, ...u } = user;
  return u as any;
}

export async function update(id: string, data: {
  email?: string;
  fullName?: string;
  role?: string;
  walletAddress?: string;
  isActive?: boolean;
}) {
  const user = await userRepo().findOne({ where: { id } });
  if (!user) throw new Error("User not found");

  if (data.email && data.email !== user.email) {
    const existing = await userRepo().findOne({ where: { email: data.email } });
    if (existing) throw new Error("Email already in use");
  }

  Object.assign(user, data);
  const saved = await userRepo().save(user);
  const { passwordHash, ...u } = saved;
  return u as any;
}

export async function deactivate(id: string) {
  const user = await userRepo().findOne({ where: { id } });
  if (!user) throw new Error("User not found");
  if (user.username === "admin") throw new Error("Cannot deactivate admin user");

  user.isActive = false;
  const saved = await userRepo().save(user);
  const { passwordHash, ...u } = saved;
  return u as any;
}

export async function seedAdmin() {
  const admin = await userRepo().findOne({ where: { username: "admin" } });
  if (!admin) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await userRepo().save(
      userRepo().create({
        username: "admin",
        email: "admin@banco.local",
        passwordHash,
        fullName: "Administrador",
        role: "admin",
        walletAddress: "0xf39Fd6e51aad88F6F4ce6aB882a7279cffFb9226",
      })
    );
    console.log("Admin user seeded (username: admin, password: admin123)");
  }
}
