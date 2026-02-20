export const AppFooter = () => {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(148, 163, 184, 0.2)",
        padding: "10px 16px 16px",
        marginTop: "auto",
        color: "var(--color-text-muted)",
        fontSize: 11
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap"
        }}
      >
        <span>Academic project – Link2Itinerary MVP</span>
        <span>Paste a link → get a plan.</span>
      </div>
    </footer>
  );
};

