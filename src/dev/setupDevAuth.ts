// Development helper: seed localStorage with a dev user and token
// This file only runs in Vite dev mode (import.meta.env.DEV)
if (import.meta.env && import.meta.env.DEV) {
  try {
    if (!localStorage.getItem('user')) {
      const devUser = { id: 1, user_type_id: 1, name: 'Dev User' };
      localStorage.setItem('user', JSON.stringify(devUser));
      console.info('[dev] seeded localStorage.user');
    }
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'dev-token');
      console.info('[dev] seeded localStorage.token');
    }
  } catch (err) {
    // ignore (e.g., SSR or restricted env)
  }
}
