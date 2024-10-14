const nthNumber = (number: number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

export const formatDate: (type: 'long'|'short', date: Date) => string = (type, date) => {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    if (type == 'long')
        return `${weekday[date.getDay()]} ${day}${nthNumber(day)} ${month} ${year}`;
    
    return `${day}/${date.getMonth() + 1}/${year}`;

}