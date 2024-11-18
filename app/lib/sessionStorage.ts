import { createCookieSessionStorage } from '@remix-run/node';

export const riderDetailSessions = createCookieSessionStorage({
	cookie: {
		name: 'otp-session',
		secure: process.env.NODE_ENV === 'production',
		secrets: ['MTphA5dKxKWNWSKojQcOUZumvKjRgJyg'],
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 31,
		httpOnly: true,
	},
});
