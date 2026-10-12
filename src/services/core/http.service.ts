const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
    public status: number;
    public path: string;
    public body: unknown;

    constructor(status: number, path: string, message: string, body?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.path = path;
        this.body = body;
    }

    get isUnauthorized() { return this.status === 401; }
    get isForbidden() { return this.status === 403; }
    get isNotFound() { return this.status === 404; }
    get isRateLimited() { return this.status === 429; }
}

export interface HttpOptions extends Omit<RequestInit, "body"> {
    json?: unknown;
    timeout?: number;
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
    const { json, timeout = 15_000, method = "GET", headers, ...rest } = options;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const res = await fetch(`${API_URL}${path}`, {
            ...rest,
            method,
            signal: controller.signal,
            credentials: "include", // ⚠️ CRITIQUE pour les cookies httpOnly
            headers: {
                Accept: "application/json",
                ...(json !== undefined && { "Content-Type": "application/json" }),
                ...headers,
            },
            ...(json !== undefined && { body: JSON.stringify(json) }),
        });

        clearTimeout(timer);

        let body: unknown;
        const ct = res.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) {
            body = await res.json().catch(() => undefined);
        } else {
            body = await res.text().catch(() => undefined);
        }

        if (!res.ok) {
            const message =
                typeof body === "object" && body !== null && "message" in body
                    ? String((body as { message: unknown }).message)
                    : `API error ${res.status}`;

            throw new ApiError(res.status, path, message, body);
        }

        return body as T;
    } catch (err) {
        clearTimeout(timer);
        if (err instanceof ApiError) throw err;
        if (err instanceof Error && err.name === "AbortError") {
            throw new ApiError(408, path, `Timeout après ${timeout} ms`);
        }
        throw new ApiError(0, path, `Erreur réseau`);
    }
}

export const httpClient = {
    get: <T>(path: string, options?: HttpOptions) => http<T>(path, { ...options, method: "GET" }),
    post: <T>(path: string, json?: unknown, options?: HttpOptions) => http<T>(path, { ...options, method: "POST", json }),
    patch: <T>(path: string, json?: unknown, options?: HttpOptions) => http<T>(path, { ...options, method: "PATCH", json }),
    put: <T>(path: string, json?: unknown, options?: HttpOptions) => http<T>(path, { ...options, method: "PUT", json }),
    delete: <T>(path: string, options?: HttpOptions) => http<T>(path, { ...options, method: "DELETE" }),
};