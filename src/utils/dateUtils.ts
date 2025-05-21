export const dateToString = (date: Date) => {
    console.log(date);
    
    return date.toISOString().split('T')[0];
}
   