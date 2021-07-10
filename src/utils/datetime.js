import dayjs from 'dayjs';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'
import isLeapYear from 'dayjs/plugin/isLeapYear' // dependent on isLeapYear plugin
require('dayjs/locale/vi')
dayjs.extend(isoWeeksInYear)
dayjs.extend(isLeapYear)

export const formatTime = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
}

export function getStartOfDayUnixTime (e) {
    if (!e) e = new Date()

    return new Date(e.getFullYear(), e.getMonth(), e.getDate(), 0, 0, 0).getTime()
}

export function getEndOfDayUnixTime (e) {
    if (!e) e = new Date()
    
    return new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59).getTime()
}

export function getSameDayLastWeek (e) {
    const sameDayLastWeek = e.getDate() - 7

    e.setDate(sameDayLastWeek)
    return getStartOfDayUnixTime(e)
}

export function getDateRangeOfWeek(weekNo, yearNo, locale = 'vi') {
    const year = yearNo || dayjs().year()   
    const startOfYear = dayjs().clone().set('y', year).startOf("y").add(-6, "day"),
    endOfYear = dayjs().clone().set('y', year).endOf("y")
    let data = {}
    for (let i = startOfYear.clone(); i.unix() < endOfYear.unix(); i = i.clone().add(7, 'day')) {
        if (i.week() === weekNo) {
            const from = i.clone().startOf("week"),
            to = i.clone().endOf("week")
            
            const diffYear = from.clone().diff(to.clone(), 'year')
            const diffMonth = from.get("month") - to.get("month")

            let fromFormat = from.locale(locale).format("DD")  
            if (diffMonth !== 0) {
                fromFormat = diffYear !== 0 
                ? from.locale(locale).format("DD MMM, YYYY")
                : from.locale(locale).format("DD MMM")
            }

            data = {
                week: i.week(),
                range: [from.format(), to.format()],
                label: `${fromFormat} - ${to.locale(locale).format("DD MMM, YYYY")}`
            }
        }        
    }
    return data
}