import Envelope from './Envelope';
import Hero from './Hero';
import Venues from './Venues';
import Gallery from './Gallery';
import RsvpForm from './RsvpForm';
import Countdown from './Countdown';

export default {
  id: 'classic',
  name: 'Klasik',
  thumbnail: '', // şimdilik gerçek görsel yoksa boş bırakılabilir
  components: {
    Envelope,
    Hero,
    Venues,
    Gallery,
    RsvpForm,
    Countdown,
  },
};
