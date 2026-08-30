import './editorial.css';

export default function Hero({
  groomName,
  brideName,
  weddingDate,
  coverImageUrl,
  venue,
}) {
  const date = new Date(weddingDate);
  const day = date.getDate();
  const month = date
    .toLocaleDateString('tr-TR', { month: 'long' })
    .toUpperCase();
  const weekday = date
    .toLocaleDateString('tr-TR', { weekday: 'long' })
    .toUpperCase();
  const fullDate = date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const bgStyle = coverImageUrl
    ? { backgroundImage: `url(${coverImageUrl})` }
    : {};

  return (
    <div className="editorial-theme">
      <main className="canvas">
        <div className="grain" />
        <div className="photo photo-main" style={bgStyle} />
        <div className="photo photo-detail" style={bgStyle} />
        <div className="sun" />

        <div className="ribbon ribbon-one">
          {fullDate} · {venue?.address?.split(',').pop()?.trim() || ''} ·
        </div>
        <div className="ribbon ribbon-two">BİRLİKTE · DAİMA ·</div>

        <header className="masthead">
          <span>DÜĞÜN DAVETİYESİ</span>
          <span className="mini-mark">
            {brideName?.[0]} × {groomName?.[0]}
          </span>
          <span>{fullDate}</span>
        </header>

        <section className="title-block">
          <p className="kicker">HİKÂYEMİZİN EN GÜZEL GÜNÜNE</p>
          <h1>
            <span>{brideName}</span>
            <b>&</b>
            <span>{groomName}</span>
          </h1>
          <p className="invite">
            Sizi de yanımızda görmek,
            <br />
            mutluluğumuzu birlikte kutlamak isteriz.
          </p>
        </section>

        <section className="date-stamp">
          <span>{month}</span>
          <strong>{day}</strong>
          <span>{weekday}</span>
        </section>

        <section className="details-panel">
          <div className="panel-tag">BÜYÜK GÜN</div>
          {venue?.time && (
            <div className="detail">
              <span>01</span>
              <div>
                <small>SAAT</small>
                <strong>{venue.time}</strong>
              </div>
            </div>
          )}
          {venue?.name && (
            <div className="detail">
              <span>02</span>
              <div>
                <small>MEKÂN</small>
                <strong>{venue.name}</strong>
                <p>{venue.address}</p>
              </div>
            </div>
          )}
          <p className="closing">
            Birlikte başlayan yeni bir bölüm.
            <br />
            <i>
              {brideName} & {groomName}
            </i>
          </p>
        </section>

        <footer>
          <span>LOVE IS IN THE AIR</span>
          <i>✦</i>
          <span>
            {venue?.address?.split(',').pop()?.trim() || ''} ·{' '}
            {date.getFullYear()}
          </span>
        </footer>
      </main>
    </div>
  );
}
