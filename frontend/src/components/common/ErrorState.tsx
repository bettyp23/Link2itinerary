export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ title, message, onRetry }) => {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background:
          "linear-gradient(135deg, rgba(127,29,29,0.95), rgba(15,23,42,0.98))",
        border: "1px solid rgba(248,113,113,0.7)",
        color: "#fecaca"
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
        {title ?? "Something went wrong"}
      </div>
      <div style={{ fontSize: 13, opacity: 0.9, marginBottom: onRetry ? 10 : 0 }}>
        {message ?? "We couldn&apos;t complete this step. Please try again."}
      </div>
      {onRetry ? (
        <button
          className="btn-secondary"
          type="button"
          onClick={onRetry}
          style={{ fontSize: 12, padding: "5px 10px", marginTop: 2 }}
        >
          Try again
        </button>
      ) : null}
    </div>
  );
};

