export interface ApiError {
    status: number;
    code: string;
    message: string;
}

interface ErrorBody {
    error?: string;
    message?: string;
}

const FALLBACK_MESSAGE = 'Request failed. Please try again.';

export async function parseApiError(res: Response): Promise<ApiError> {
    let body: ErrorBody = {};
    try {
        body = await res.clone().json();
    } catch {
        // Non-JSON response (HTML error page, network glitch, etc.)
    }
    return {
        status: res.status,
        code: body.error ?? `http_${res.status}`,
        message: body.message ?? body.error ?? res.statusText ?? FALLBACK_MESSAGE,
    };
}

export function isApiError(value: unknown): value is ApiError {
    return (
        !!value &&
        typeof value === 'object' &&
        'status' in value &&
        'code' in value &&
        'message' in value
    );
}
