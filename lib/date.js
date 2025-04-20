export const formatMyDate = (date) => {
  if (!date) return null; // Handle null/undefined
  
  // Ensure the date is a Date object
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(parsedDate.getTime())) return null; // Check for Invalid Date

  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
};


export const formatDuration = (duration) => {
  if (!duration) return null;

  var hour = Math.floor(duration / 3600);
  var min = Math.floor(duration % 3600 / 60);
  var sec = Math.floor(duration % 3600 % 60);

  const durationString = `${hour}:${min}:${sec}`;

  console.log(durationString);

  return durationString;
}