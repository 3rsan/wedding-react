import Hero from './Hero';
import Envelope from '../classic/Envelope';
import Venues from '../classic/Venues';
import Gallery from '../classic/Gallery';
import RsvpForm from '../classic/RsvpForm';
import Countdown from '../classic/Countdown';

export default {
  id: 'editorial',
  name: 'Editoryal Kolaj',
  defaultColors: { primary: '#721333', text: '#24161d', bg: '#f7ead8' },
  components: { Envelope, Hero, Venues, Gallery, RsvpForm, Countdown },
};
