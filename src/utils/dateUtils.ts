export const dateToString = (date: Date) => {
    console.log(date);
    
    return date.toISOString().split('T')[0];
}
   

// export const javaLocalDateTimeToStringDate = (dateStr: string) => {
//     // const dateStr = "2024-11-30T10:30:00";
//     const [year, month, day] = dateStr.split('T')[0].split('-');
//     const formatted = `${day}.${month}.${year}`;
//     return formatted;
// }
   