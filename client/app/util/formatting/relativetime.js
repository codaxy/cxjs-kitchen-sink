import { Format } from 'cx/ui';

const relative = new Intl.RelativeTimeFormat('en', { style: 'long', numeric: 'auto' });

let formats = {
   year: 365 * 86400,
   month: 30 * 86400,
   day: 86400,
   hour: 3600,
   minute: 60,
};

Format.register('relativetime', (value) => {
   let v = new Date(value).valueOf();
   let dist = (v - Date.now()) / 1000;
   let abs = Math.abs(dist);
   for (let unit in formats) if (abs >= formats[unit]) return relative.format(Math.round(dist / formats[unit]), unit);
   return relative.format(Math.round(dist), 'second');
});
