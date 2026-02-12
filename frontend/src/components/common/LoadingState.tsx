export const LoadingState: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background:
          "radial-gradient(circle at top, rgba(15,23,42,0.9), rgba(15,23,42,0.96))",
        border: "1px solid rgba(148,163,184,0.35)",
        display: "flex",
        alignItems: "center",
        gap: 12
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "999px",
          border: "2px solid rgba(148,163,184,0.4)",
          borderTopColor: "var(--color-primary)",
          animation: "spin 0.7s linear infinite"
        }}
      />
      <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
        {label ?? "Thinking through your trip..."}
      </div>
      <style>
        {`@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`}
      </style>
    </div>
  );
};

