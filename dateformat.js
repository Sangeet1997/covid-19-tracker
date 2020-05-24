let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

function datef(str)
{
    let month = months[Number(str.substring(5,7))-1];
    let day = Number(str.substring(8,10));

    return month+" "+day;
}