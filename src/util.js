import moment from 'moment';
import 'moment-duration-format';

export const formatSeconds = (seconds) => {
  return moment.duration(seconds, 'seconds').format('h:mm', { trim: false });
};
