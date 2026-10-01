export default function HomePage() {
  return (
    <main className="home">
      <div className="home-card">
        <h1>משחק פנטומימה</h1>
        <p>פתחו את שתי התצוגות בלשוניות נפרדות. תצוגת השחקן בוחרת את המונח, ותצוגת הקבוצה מתעדכנת איתה.</p>
        <div className="home-links">
          <a href="/player" target="_blank" rel="noreferrer">
            תצוגת שחקן
          </a>
          <a href="/team" target="_blank" rel="noreferrer">
            תצוגת קבוצה
          </a>
        </div>
      </div>
    </main>
  );
}
