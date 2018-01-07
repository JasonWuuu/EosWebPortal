//数组求最大值
function array_max() {
    var i,
    max = this[0];
    for (i = 0; i < this.length; i++) {
        if (max < this[i])
            max = this[i];
    }
    return max;
}
//JSON求最大值
function json_max(field) {

    if (this != undefined && this.length > 0) {
        var i, max, temp;
        if (isNum(this[0][field])) {
            max = this[0][field];
        }
        for (i = 0; i < this.length; i++) {
            if (isNum(this[i][field])) {
                temp = parseFloat(this[i][field]);
                if (temp > max) {
                    max = temp;
                }
            }
        }
        return max;
    }
    return 0;
}
//JSON求和
function json_sum(field) {
    var i,
    sum = 0;
    if (this != undefined && this.length > 0) {
        for (i = 0; i < this.length; i++) {
            if (isNum(this[i][field])) {
                sum = sum + parseFloat(this[i][field]);
            }
        }
    }
    return sum;
}
//是否为数字
function isNum(num) {
    if (num != undefined) {
        return !isNaN(parseFloat(num, 10));
    }
    return false;
}

Array.prototype.max = json_max;
Array.prototype.sum = json_sum;

var Convert2FloatRst;

function Convert2Float(num) {
    
    if (isNum(num)) {
        Convert2FloatRst = 1;
        return parseFloat(num);
    }
    Convert2FloatRst = -1;
}



