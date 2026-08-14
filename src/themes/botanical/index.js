import Envelope from './Envelope';
import Hero from './Hero';
import Venues from './Venues';
import Gallery from '../classic/Gallery';
import RsvpForm from './RsvpForm';
import Countdown from './Countdown';

export default {
  id: 'botanical',
  name: 'Botanik',
  defaultColors: { primary: '#5b7553', text: '#2f3b2a', bg: '#f4f6f0' },
  components: { Envelope, Hero, Venues, Gallery, RsvpForm, Countdown },
};
