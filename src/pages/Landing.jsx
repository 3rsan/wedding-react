import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f7f3eb] text-[#2c3e50]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
        <span className="font-serif text-xl font-medium">Davetiyem</span>
        <Link
          to="/admin/login"
          className="text-sm px-4 py-2 rounded-md border border-[#2c3e50]/20 hover:bg-white transition"
        >
          Giriş Yap
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-24">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4a04a] mb-4">
          Dijital Düğün Davetiyesi
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight mb-6">
          Düğününüzü <span className="text-[#d4a04a]">anlatan</span> bir
          davetiye
        </h1>
        <p className="text-lg text-[#2c3e50]/70 max-w-xl mx-auto mb-10">
          Misafirlerinize özel linkler gönderin, RSVP'lerini toplayın, anılarını
          biriktirin — hepsi tek bir yerden, sizin seçtiğiniz tasarımla.
        </p>
        <a
          href="#iletisim"
          className="inline-block px-8 py-3 rounded-md bg-[#d4a04a] text-white font-medium hover:opacity-90 transition"
        >
          Hemen Başlayın
        </a>
      </section>

      {/* Özellikler */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            title="Kişiye Özel Davetiyeler"
            description="Her misafirinize özel bir link oluşturun, kimin geldiğini kolayca takip edin."
          />
          <Feature
            title="Anlık RSVP Takibi"
            description="Katılım durumlarını, kişi sayılarını tek panelden görün, dışa aktarın."
          />
          <Feature
            title="Kendi Tasarımınız"
            description="Renkleri, kapak görselinizi ve temanızı istediğiniz gibi özelleştirin."
          />
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-center mb-12">
            Nasıl Çalışır
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Bize Ulaşın"
              description="Düğün bilgilerinizi bizimle paylaşın."
            />
            <Step
              number="2"
              title="Davetiyenizi Alın"
              description="Size özel, tasarlanmış davetiye linkiniz hazır olsun."
            />
            <Step
              number="3"
              title="Paylaşın ve Takip Edin"
              description="Misafirlerinize gönderin, RSVP'leri panelden takip edin."
            />
          </div>
        </div>
      </section>

      {/* İletişim / CTA */}
      <section
        id="iletisim"
        className="max-w-2xl mx-auto text-center px-6 py-24"
      >
        <h2 className="font-serif text-3xl mb-4">Başlamaya Hazır mısınız?</h2>
        <p className="text-[#2c3e50]/70 mb-8">
          Bize ulaşın, düğününüze özel davetiyenizi birlikte hazırlayalım.
        </p>
        <a
          href="https://wa.me/905443068603"
          target="_blank"
          rel="noreferrer"
          className="inline-block px-8 py-3 rounded-md bg-[#d4a04a] text-white font-medium hover:opacity-90 transition"
        >
          WhatsApp'tan Ulaşın
        </a>
      </section>

      <footer className="text-center text-sm text-[#2c3e50]/50 py-8">
        © {new Date().getFullYear()} Davetiyem. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="text-center">
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-sm text-[#2c3e50]/60">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-full bg-[#d4a04a] text-white flex items-center justify-center mx-auto mb-4 font-medium">
        {number}
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-[#2c3e50]/60">{description}</p>
    </div>
  );
}
