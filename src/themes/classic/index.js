import Envelope from './Envelope';
import Hero from './Hero';
import Venues from './Venues';
import Gallery from './Gallery';
import RsvpForm from './RsvpForm';
import Countdown from './Countdown';

export default {
  id: 'classic',
  name: 'Klasik',
  defaultColors: { primary: '#d4a04a', text: '#2c3e50', bg: '#f7f3eb' },
  components: { Envelope, Hero, Venues, Gallery, RsvpForm, Countdown },
};
