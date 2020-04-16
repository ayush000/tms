import moment from 'moment';

export const durationRegExp = /^(-?)P(?=\d|T\d)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)([DW]))?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

export const durationFormRegExp = /^(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/;

export const durationToMinutes = (duration) =>
  moment.duration('PT' + duration).asMinutes();

export const humanizeDuration = (duration) => {
  if (isNaN(duration)) {
    return 'Invalid entry';
  }
  const hours = Math.floor(moment.duration(duration, 'minutes').asHours());
  const minutes = duration - hours * 60;
  const humanized = `${hours ? `${hours}h ` : ''}${
    minutes ? `${minutes}m` : ''
  }`;

  return humanized;
};

export const getDuration = (duration) =>
  moment.duration(duration, 'minutes').toJSON().split('PT')[1];

export const getFormattedTime = (time, format = 'YYYY.MM.DD') =>
  moment(time).format(format);

export const isValidDuration = (duration) => {
  return !!duration.match(durationRegExp);
};
