function mapsSearchUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

function mapsDirectionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

// Tek bir mekan kartı
function VenueCard({ venue }) {
  return (
    <div className="max-w-md mx-auto text-center py-10">
      <p className="text-xs tracking-[0.4em] uppercase mb-3 text-[var(--color-text)]/60">
        {venue.label ?? venue.type}
      </p>
      <h3 className="text-3xl md:text-4xl font-medium mb-4 font-serif text-[var(--color-text)]">
        {venue.name}
      </h3>
      {venue.time && (
        <p className="text-2xl font-light mb-4 text-[var(--color-primary)]">{venue.time}</p>
      )}
      <div className="flex items-center justify-center gap-2 mb-6 text-[var(--color-text)]/60 text-sm">
        <span>{venue.address}</span>
      </div>

      <a
        href={mapsSearchUrl(venue.address)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-2 w-full rounded-xl h-48 border border-[var(--color-text)]/10 bg-white text-[var(--color-text)]/60 mb-6"
      >
        <span className="text-sm">Haritayı Görüntüle</span>
      </a>

      <a
        href={mapsDirectionsUrl(venue.address)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm text-white transition-transform hover:scale-105"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Yol Tarifi Al
      </a>
    </div>
  )
}

// venues: [{ type: 'nikah', label: 'Nikah Töreni', name: 'Hotel Caruso', address: '...', time: '15:30' }, ...]
export default function Venues({ venues }) {
  if (!venues || venues.length === 0) return null

  return (
    <section className="py-12 px-4 bg-[var(--color-bg)]">
      {venues.map((venue, i) => (
        <VenueCard key={venue.type ?? i} venue={venue} />
      ))}
    </section>
  )
}
