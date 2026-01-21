import type { Request, Response } from "express";
import type { RefreshCookie } from "./types";

/**
 * Get refresh token safely from cookie
 */
export function getRefreshTokenFromRequest(
	req: Request,
	cookieName: string,
): string | undefined {
	const cookies = req.cookies as Record<string, unknown> | undefined;

	if (!cookies) return undefined;

	const value = cookies[cookieName];
	return typeof value === "string" ? value : undefined;
}

/**
 * Set refresh cookie
 */
export function setRefreshCookie(res: Response, cookie: RefreshCookie): void {
	res.cookie(cookie.name, cookie.value, cookie.options);
}

/**
 * Clear refresh cookie
 */
export function clearRefreshCookie(res: Response, cookieName: string): void {
	res.clearCookie(cookieName, { path: "/auth/refresh" });
}
