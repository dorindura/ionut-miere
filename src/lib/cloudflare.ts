export function getCloudflareEnv(): Cloudflare.Env {
    const env = (globalThis as typeof globalThis & { cloudflare?: { env?: Cloudflare.Env } })
        .cloudflare?.env;

    if (!env) {
        throw new Error("Cloudflare env is not available");
    }

    return env;
}