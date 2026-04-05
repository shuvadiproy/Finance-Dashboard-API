// Auto-authorize: intercept login/register responses and set the JWT token automatically
const _origFetch = window.fetch;
window.fetch = async function (...args) {
  const response = await _origFetch.apply(this, args);
  const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';

  if (url.includes('/api/auth/login') || url.includes('/api/auth/register')) {
    try {
      const clone = response.clone();
      const data = await clone.json();
      if (data.success && data.data && data.data.token) {
        window.ui.preauthorizeApiKey('bearerAuth', data.data.token);
        console.log('🔓 Auto-authorized! Token set from', url.split('/').pop());
      }
    } catch (e) { /* ignore parse errors */ }
  }
  return response;
};
