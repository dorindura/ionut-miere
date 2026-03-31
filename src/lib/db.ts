import { createPrisma } from "@/lib/prisma";
import { getCloudflareEnv } from "@/lib/cloudflare";

export function getPrisma() {
    const env = getCloudflareEnv();
    return createPrisma(env.DB);
}