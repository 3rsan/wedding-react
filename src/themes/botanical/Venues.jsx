function mapsSearchUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function mapsDirectionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

function VenueCard({ venue }) {
  return (
    <div
      className="max-w-md mx-auto text-center py-10 px-8 rounded-2xl"
      style={{
        backgroundColor: 'var(--color-primary)',
        backgroundImage: 'none',
        opacity: 1,
      }}
    >
      <div className="bg-[var(--color-bg)] rounded-xl p-8 -m-2">
        <p className="text-xs tracking-[0.3em] uppercase mb-3 text-[var(--color-primary)]">
          🌿 {venue.label ?? venue.type}
        </p>
        <h3 className="text-3xl font-light mb-3 text-[var(--color-text)]">
          {venue.name}
        </h3>
        {venue.time && (
          <p className="text-xl mb-4 text-[var(--color-primary)]">
            {venue.time}
          </p>
        )}
        <p className="text-sm mb-6 text-[var(--color-text)]/60">
          {venue.address}
        </p>

        <a
          href={mapsSearchUrl(venue.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-40 rounded-xl mb-6 text-sm text-[var(--color-text)]/50 border-2 border-dashed"
          style={{ borderColor: 'var(--color-primary)' }}
        >
          Haritayı Görüntüle
        </a>

        <a
          href={mapsDirectionsUrl(venue.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 rounded-full text-sm text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Yol Tarifi Al
        </a>
      </div>
    </div>
  );
}

export default function Venues({ venues }) {
  if (!venues || venues.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-[var(--color-bg)] space-y-8">
      {venues.map((venue, i) => (
        <VenueCard key={venue.type ?? i} venue={venue} />
      ))}
    </section>
  );
}
