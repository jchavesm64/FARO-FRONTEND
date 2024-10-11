export function getElapsedTime(startTime) {
    if (!(startTime instanceof Date) || isNaN(startTime)) {
        throw new Error('Invalid start time');
    }

    const endTime = new Date();
    let timeDiff = endTime.getTime() - startTime.getTime();

    timeDiff /= 1000; // convert time difference from milliseconds to seconds 
    const seconds = Math.trunc(timeDiff % 60);
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    timeDiff = Math.trunc(timeDiff / 60); // convert time difference from seconds to minutes
    const minutes = timeDiff % 60;
    const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

    timeDiff = Math.trunc(timeDiff / 60); // convert time difference from minutes to hours
    const hours = timeDiff % 24;

    timeDiff = Math.trunc(timeDiff / 24); // convert time difference from hours to days
    const days = timeDiff;

    const totalHours = hours + (days * 24); // add days to hours
    const hoursString = totalHours < 10 ? `0${totalHours}` : `${totalHours}`;

    return totalHours === 0 ? `${minutesString}:${secondsString}` : `${hoursString}:${minutesString}:${secondsString}`;
}