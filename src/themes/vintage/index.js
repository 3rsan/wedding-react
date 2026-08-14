import Envelope from './Envelope';
import Hero from './Hero';
import Venues from './Venues';
import Gallery from '../classic/Gallery';
import RsvpForm from './RsvpForm';
import Countdown from './Countdown';

export default {
  id: 'vintage',
  name: 'Zarif Vintage',
  defaultColors: { primary: '#a67c52', text: '#3d2b1f', bg: '#f5efe6' },
  components: { Envelope, Hero, Venues, Gallery, RsvpForm, Countdown },
};
