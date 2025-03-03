var TimeToSeconds = function (date) {
  const Hour = Number(`${date[0]}${date[1]}`);
  const min = Number(`${date[3]}${date[4]}`);
  const sec = Number(`${date[6]}${date[7]}`);
  console.log(min);
  let seconds = 0;
  seconds += Hour * 3600;
  seconds += min * 60;
  seconds += sec;
  if (isNaN(seconds)) {
    return -1;
  }
  return seconds;
};
console.log(TimeToSeconds("22:10:50"));
