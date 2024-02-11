export const AreDatesEqual = (date1: Date, date2: Date): boolean => {
    return (
      // eslint-disable-next-line eqeqeq
      date1.getFullYear() == date2.getFullYear() &&
      // eslint-disable-next-line eqeqeq
      date1.getMonth() == date2.getMonth() &&
      // eslint-disable-next-line eqeqeq
      date1.getDate() == date2.getDate()
    );
  }