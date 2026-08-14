import Envelope from './Envelope';
import Hero from './Hero';
import Venues from '../classic/Venues';
import Gallery from '../classic/Gallery';
import RsvpForm from '../classic/RsvpForm';
import Countdown from '../classic/Countdown';

export default {
  id: 'modern-minimal',
  name: 'Modern Minimal',
  defaultColors: { primary: '#111111', text: '#111111', bg: '#ffffff' },
  components: { Envelope, Hero, Venues, Gallery, RsvpForm, Countdown },
};
