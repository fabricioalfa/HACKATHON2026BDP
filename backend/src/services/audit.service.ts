import { AppDataSource } from "../app";
import { AuditLog } from "../entities/AuditLog";

const auditRepo = () => AppDataSource.getRepository(AuditLog);

export async function findAll(userId?: string, action?: string) {
  const qb = auditRepo().createQueryBuilder("audit");

  if (userId) qb.andWhere("audit.userId = :userId", { userId });
  if (action) qb.andWhere("audit.action = :action", { action });

  return qb.orderBy("audit.createdAt", "DESC").getMany();
}
