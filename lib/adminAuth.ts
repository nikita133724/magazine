const fallbackSessionSecret = 'local-demo-session-secret';

export function getAdminLogin() {
  return process.env.ADMIN_LOGIN || 'admin';
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || fallbackSessionSecret;
}

export function readCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  const target = cookies.find(cookie => cookie.startsWith(`${name}=`));
  return target ? decodeURIComponent(target.slice(name.length + 1)) : null;
}

export function isAdminCookieValid(cookieHeader: string | null) {
  return readCookie(cookieHeader, 'admin_session') === getAdminSessionSecret();
}
