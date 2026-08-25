function mapsSearchUrl(venue) {
  if (venue.lat && venue.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`;
}

function mapsDirectionsUrl(venue) {
  if (venue.lat && venue.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.address)}`;
}

function VenueCard({ venue }) {
  return (
    <div
      className="max-w-md mx-auto text-center py-12 px-8 border"
      style={{ borderColor: 'var(--color-primary)' }}
    >
      <p className="text-xs tracking-[0.4em] uppercase mb-4 text-[var(--color-primary)]">
        {venue.label ?? venue.type}
      </p>
      <h3 className="text-3xl md:text-4xl font-serif italic mb-4 text-[var(--color-text)]">
        {venue.name}
      </h3>
      {venue.time && (
        <p className="text-xl font-serif mb-4 text-[var(--color-text)]/70">
          {venue.time}
        </p>
      )}
      <div
        className="w-8 h-px mx-auto mb-4"
        style={{ backgroundColor: 'var(--color-primary)' }}
      />
      <p className="text-sm mb-8 text-[var(--color-text)]/60">
        {venue.address}
      </p>

      <a
        href={mapsSearchUrl(venue)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-2 w-full h-40 border mb-6 text-[var(--color-text)]/50 text-sm"
        style={{ borderColor: 'var(--color-primary)' }}
      >
        Haritayı Görüntüle
      </a>

      <a
        href={mapsDirectionsUrl(venue)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-2 text-sm border-2 tracking-wide uppercase text-xs"
        style={{
          borderColor: 'var(--color-primary)',
          color: 'var(--color-primary)',
        }}
      >
        Yol Tarifi Al
      </a>
    </div>
  );
}

export default function Venues({ venues }) {
  if (!venues || venues.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-[var(--color-bg)] space-y-10">
      {venues.map((venue, i) => (
        <VenueCard key={venue.type ?? i} venue={venue} />
      ))}
    </section>
  );
}
