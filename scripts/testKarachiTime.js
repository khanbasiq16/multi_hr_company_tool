// Quick script to show the Karachi times used by the API (dailyCheck route)
// Run with: node scripts/testKarachiTime.js

function fetchKarachiTime() {
  try {
    const karachiDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
    return new Date(karachiDate);
  } catch (err) {
    console.error('Failed to get Karachi time:', err);
    return new Date();
  }
}

function isoTo12Hour(date) {
  const d = (date instanceof Date) ? date : new Date(date);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const modifier = hours >= 12 ? 'PM' : 'AM';

  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;

  return `${hours}:${minutes} ${modifier}`;
}

const karachiNow = fetchKarachiTime();
const karachiYesterday = new Date(karachiNow);
karachiYesterday.setDate(karachiNow.getDate() - 1);
const karachiYesterdayEnd = new Date(karachiYesterday);
karachiYesterdayEnd.setHours(23, 59, 59, 999);

console.log('Karachi now (locale):', karachiNow.toString());
console.log('Karachi now (ISO):', karachiNow.toISOString());
console.log('Karachi now (12-hour):', isoTo12Hour(karachiNow));
console.log('Karachi now (ms since epoch):', karachiNow.getTime());

console.log('\nKarachi yesterday (locale):', karachiYesterday.toString());
console.log('Karachi yesterday (date string en-GB):', karachiYesterday.toLocaleDateString('en-GB'));
console.log('Karachi yesterday end (ISO):', karachiYesterdayEnd.toISOString());
console.log('Karachi yesterday end (12-hour):', isoTo12Hour(karachiYesterdayEnd));
console.log('Karachi yesterday end (ms):', karachiYesterdayEnd.getTime());

console.log('\nLocal system now (ISO):', new Date().toISOString());
console.log('Local system timezone offset (minutes):', new Date().getTimezoneOffset());

console.log('\nHow the API formats times:');
console.log('- The dailyCheck route uses:');
console.log("  - current Karachi time computed by new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })");
console.log("  - the API then converts that Date to a 12-hour string like: `HH:MM AM/PM` using isoTo12Hour()\n");

console.log('Example formatted time used by API for checkout:', isoTo12Hour(karachiYesterdayEnd));
