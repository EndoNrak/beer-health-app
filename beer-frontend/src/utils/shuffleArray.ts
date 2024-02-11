export const shuffleArray = (array: any[]): any[] => {
    const cloneArray = [...array];
  
    const result = cloneArray.reduce((_,cur,idx) => {
      let rand = Math.floor(Math.random() * (idx + 1));
      cloneArray[idx] = cloneArray[rand]
      cloneArray[rand] = cur;
      return cloneArray
    })
  
    return result;
  }
