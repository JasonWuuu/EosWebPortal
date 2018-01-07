//时间相减
function countTimeLength(interval, date1, date2) {
    var objInterval = { 'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1 };
    interval = interval.toUpperCase();
    var dt1 = Date.parse(StringToDate(date1));
    var dt2 = Date.parse(StringToDate(date2));
    try {
        return ((((dt2 - dt1) / objInterval[interval]).toFixed(0))); //保留两位小数点   
    } catch (e) {
        return e.message;
    }
}
//字符串转化为时间
function StringToDate(string) {
    return new Date(Date.parse(string.replace(/-/g, "/")));
}  