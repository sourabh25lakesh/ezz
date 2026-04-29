import { useToast } from '../context/ToastContext';

function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <style>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        }

        .toast {
          pointer-events: all;
          max-width: 380px;
          padding: 14px 16px;
          border: 1.5px solid;
          background: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.02em;
          border-radius: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOut {
          to {
            opacity: 0;
            transform: translateX(400px);
          }
        }

        .toast.removing {
          animation: slideOut 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        .toast-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .toast-message {
          flex: 1;
        }

        .toast-close {
          font-size: 1.2rem;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          color: inherit;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .toast-close:hover {
          opacity: 1;
        }

        /* Success Toast */
        .toast.success {
          border-color: #22c55e;
          color: #16a34a;
        }

        /* Error Toast */
        .toast.error {
          border-color: #ef4444;
          color: #dc2626;
        }

        /* Info Toast */
        .toast.info {
          border-color: #3b82f6;
          color: #1d4ed8;
        }

        /* Warning Toast */
        .toast.warning {
          border-color: #f97316;
          color: #c2410c;
        }
      `}</style>

      <div className="toast-container">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className={`toast ${toast.type}`}
            style={{
              animation: `slideIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards`,
            }}
          >
            <span className="toast-icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'info' && 'ℹ'}
              {toast.type === 'warning' && '⚠'}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Toaster;
