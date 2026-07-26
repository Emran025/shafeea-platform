import './bootstrap';
import { createRoot } from 'react-dom/client';
import App from './renderer/App';
import ErrorBoundary from './renderer/orchestration/ErrorBoundary';

const container = document.getElementById('app');
if (container) {
    createRoot(container).render(
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
}
