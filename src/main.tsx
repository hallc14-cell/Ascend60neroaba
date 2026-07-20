import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initOneSignal } from './lib/push';
import { validateEnv } from './config/env';

// Surface any missing/malformed environment configuration early (dev warning only).
validateEnv();

// Boot OneSignal immediately so the SDK is ready before the user
// taps anything — this is required for iOS push to work reliably.
if (typeof window !== 'undefined') {
  initOneSignal().catch(() => {});
}

createRoot(document.getElementById('root')!).render(<App />);
