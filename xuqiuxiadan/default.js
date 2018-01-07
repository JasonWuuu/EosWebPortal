var pm = "DT";
var _pl, _gg, _ph, _pm, _dz, _xl, _price, _dj; //品类，规格，批号，品名, 锭重, 系列, 单价，等级
var ligerDialog;
var ligerGrid;
var current_column; //级别
var current_value; //单价
var bool = true;
var isSearch = false;
var _ye = ""; //余额
$(function () {
    $('#p').window('close');
    $('#ywy_stockinfo').window('close');
    $('#ordlist').window('close');
    ComboxInit();
    GridInit();

})

function GridInit() {
    ligerGrid = $('#tab_list').datagrid({
        columns: [
            [{
                field: 'WPXL',
                title: '系列',
                width: 150,
                rowspan: 2,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'GG',
                title: '规格',
                width: 150,
                rowspan: 2,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'PH',
                title: '批号',
                width: 150,
                rowspan: 2,
                halign: 'center',
                align: 'center'
            },
            {
                title: '价格(注:下表中均为现金价)   单位：元/千克',
                colspan: 7,
                halign: 'center'
            }
            ],
            [{
                field: 'AA',
                title: 'AA',
                width: 85,
                halign: 'center',
                formatter: function (value, row, index) {
                    return '<span style="cursor:pointer">' + value + '</span>';
                },
                align: 'right'
            },
            {
                field: 'A',
                title: 'A',
                width: 85,
                halign: 'center',
                formatter: function (value, row, index) {
                    return '<span style="cursor:pointer">' + value + '</span>';
                },
                align: 'right'
            },
            {
                field: 'LA',
                title: 'A-',
                width: 85,
                halign: 'center',
                formatter: function (value, row, index) {
                    return '<span style="cursor:pointer">' + value + '</span>';
                },
                align: 'right'
            },
            {
                field: 'B',
                title: 'B',
                width: 85,
                halign: 'center',
                formatter: function (value, row, index) {
                    return '<span style="cursor:pointer">' + value + '</span>';
                },
                align: 'right'
            },
            {
                field: 'C',
                title: 'C',
                width: 85,
                halign: 'center',
                formatter: function (value, row, index) {
                    return '<span style="cursor:pointer">' + value + '</span>';
                },
                align: 'right'
            },
            {
                field: 'D',
                title: 'D',
                width: 85,
                halign: 'center',
                formatter: function (value, row, index) {
                    return '<span style="cursor:pointer">' + value + '</span>';
                },
                align: 'right'
            }
            ]
        ],

        height: 'auto',
        nowrap: false,
        striped: false,
        border: true,
        collapsible: false, //是否可折叠的 
        fit: true, //自动大小 
        url: 'BiddDmdOrderNew.ashx?type=goodslist',
        method: 'POST',
        queryParams: {
            'pm': pm
        },
        sortName: 'WPLX',
        //sortOrder: 'desc', 
        remoteSort: true,
        idField: 'itemid',
        pageSize: 15,
        // showHeader:false,
        singleSelect: true, //是否单选 
        pagination: true, //分页控件 
        rownumbers: true, //行号 

        onLoadSuccess: function () {
            if (isSearch) {
                var rowinfo = $('#tab_list').datagrid('getRows');
                pm = rowinfo[0].WPLX;
                $("input[value='" + rowinfo[0].WPLX + "']").removeClass("btn-gray").siblings().addClass(
                    "btn-gray");
                isSearch = false;
            }

        },

        //单元格点击事件
        onClickCell: function (index, field, value) {
            $("#TBox_Up").val("");
            $("#tab_SumPrice").text("");
            $("#tab_XQXS").val("");
            $("#tab_XQSL").val("");
            $("#DropList_CPLX").val("0");
            if (field == "WPXL" || field == "PH" || field == "GG") {
                return;
            } else {
                if (value != "") {
                    _price = (parseFloat(value)).toFixed(3); //单价
                    _dj = field; //等级
                    //var _pl, _gg, _ph, _pm, _dz, _xl; //品类，规格，批号，品名, 锭重, 系列
                    var row = $('#tab_list').datagrid('getRows');
                    _pl = row[index].CPFLMCC;
                    _xl = row[index].WPXL;
                    _gg = row[index].GG;
                    _ph = row[index].PH;
                    _pm = pm;

                    $.ajax({
                        url: "GoodsList.ashx?type=GetDZ",
                        type: "POST",
                        cache: false,
                        data: "ph=" + _ph,
                        dataType: "json",
                        success: function (option) {
                            if (option.statu == "ok") {
                                _dz = option.data.DZ[0].dz;
                            }
                        }
                    })

                    $.ajax({
                        url: "GoodsList.ashx?type=IsReady",
                        type: "POST",
                        cache: false,
                        data: "ph=" + _ph,
                        dataType: "json",
                        success: function (option) {
                            if (option.statu == "ok") {
                                GetStockInfo(_pm, _dj, _ph);
                            } else {
                                $.messager.defaults.ok = '确定';
                                $.messager.alert('提醒', option.msg, 'info');
                                return;
                            }
                        }
                    })
                }
            }
        }
    });

    var p = $('#tab_list').datagrid('getPager');
    $(p).pagination({
        pageSize: 10, //每页显示的记录条数,默认为10 
        pageList: [5, 10, 15, 20, 25], //可以设置每页记录条数的列表 
        beforePageText: '第', //页数文本框前显示的汉字 
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
    });
}
//获取库存信息
function GetStockInfo(wpmc, dj, ph) {
    $.ajax({
        url: "BiddDmdOrderNew.ashx?type=stock",
        type: "POST",
        cache: false,
        data: "wpmc=" + wpmc + "&dj=" + dj + "&ph=" + ph,
        dataType: "json",
        success: function (option) {
            if (option.statu == "ok") {
                if (option.data.stocks.length > 0) {
                    if (option.data.stocks[0].kfxs == 0) {
                        $.messager.defaults.ok = '确定';
                        $.messager.alert('提醒', '暂无库存，无法提交需求!', 'info');
                        return;
                    } else {
                        //_dz = "12.5"; //测试锭重
                        $("#tab_PL").html(_pl);
                        $("#tab_PM").html(_pm);
                        $("#tab_XL").html(_xl);
                        $("#tab_GG").html(_gg);
                        $("#tab_PH").html(_ph);
                        $("#tab_DJ").html(_dj);
                        $("#tab_Price").html(_price + "元/千克");
                        $("#tab_DZ").html(_dz);
                        $("#tab_ye").html(_ye);
                        $("#tab_KFXS").html(option.data.stocks[0].kfxs);
                        $("#tab_KFSL").html(option.data.stocks[0].kfsl + "千克");
                        $('#p').window('center');
                        $('#p').window('open');
                    }
                } else {
                    $("#tab_KFXS").html("0");
                    $("#tab_KFSL").html("0");
                    $.messager.defaults.ok = '确定';
                    $.messager.alert('提醒', '暂无库存，无法提交需求!', 'info');
                    return;
                }
            }
        },
        complete: function (XHR, TS) {
            XHR = null
        }
    });

}

//分货参考详解
function YWYStockInfo(wpmc, dj, ph) {
    $('#tab_stockinfo').datagrid({
        columns: [
            [{
                field: 'CPFLMCC',
                title: '品类',
                width: 100,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'WPMC',
                title: '物品名称',
                width: 80,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'GG',
                title: '规格',
                width: 150,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'PH',
                title: '批号',
                width: 100,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'DJ',
                title: '等级',
                width: 80,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'ZCCP',
                title: '正常产品(千克)',
                width: 90,
                halign: 'center',
                align: 'right'
            },
            {
                field: 'CCCP',
                title: '超存产品(千克)',
                width: 90,
                halign: 'center',
                align: 'right'
            },
            {
                field: 'DYCP',
                title: '打样产品(千克)',
                width: 90,
                halign: 'center',
                align: 'right'
            },
            {
                field: 'HJ',
                title: '合计(千克)',
                width: 120,
                halign: 'center',
                align: 'right'
            }
            ]
        ],
        height: 'auto',
        nowrap: false,
        striped: false,
        border: true,
        collapsible: false, //是否可折叠的 
        fit: true, //自动大小 
        url: 'BiddDmdOrderNew.ashx?type=ywystock&wpmc=' + wpmc + '&dj=' + dj + '&ph=' + ph,
        sortName: 'WPLX',
        //sortOrder: 'desc', 
        remoteSort: true,
        idField: 'itemid',
        // showHeader:false,
        singleSelect: true, //是否单选 
        pagination: false, //分页控件 
        rownumbers: true //行号 
    });
}


//需求列表
function MyOrderListInit() {
    $('#tab_ordlist').datagrid({
        columns: [
            [{
                field: 'CUSTOMER',
                title: '客户',
                width: 150,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'WPPL',
                title: '品类',
                width: 100,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'WPMC',
                title: '品名',
                width: 50,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'WPXL',
                title: '系列',
                width: 100,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'GG',
                title: '规格',
                width: 150,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'PH',
                title: '批号',
                width: 100,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'CPLX',
                title: '产品类型',
                width: 80,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'DJ',
                title: '等级',
                width: 50,
                halign: 'center',
                align: 'center'
            },
            {
                field: 'XQPRICE',
                title: '单价(元/千克)',
                width: 80,
                halign: 'center',
                align: 'right'
            },
            {
                field: 'UPPRICE',
                title: '加价(元/吨)',
                width: 80,
                halign: 'center',
                align: 'right'
            },
            {
                field: 'UPSUMPRICE',
                title: '合计单价(元/吨)',
                width: 80,
                halign: 'center',
                align: 'right'
            },
            {
                field: 'DZ',
                title: '锭重',
                width: 70,
                halign: 'center',
                align: 'right'
            },
            {
                field: 'XQBOXNUM',
                title: '需求箱数',
                width: 70,
                halign: 'center',
                align: 'right'
            },
            {
                field: 'XQNUM',
                title: '需求数量(千克)',
                width: 85,
                halign: 'center',
                align: 'right'
            }
            ]
        ],
        height: 'auto',
        nowrap: false,
        striped: false,
        border: true,
        collapsible: false, //是否可折叠的 
        url: 'BiddDmdOrderNew.ashx?type=myordlist',
        type: "POST",
        // sortName: 'WPLX',
        //sortOrder: 'desc', 
        remoteSort: true,
        idField: 'ORDLNO',
        showHeader: true,
        pagination: false, //分页控件 
        rownumbers: false, //行号 
        singleSelect: false, //是否单选 
        selectOnCheck: true,
        checkOnSelect: true
    })
}

//添加需求按钮事件
function addDemand() {
    if (!Validator()) {
        return;
    }
    //客户为空提醒
    if ($("#Customer").combobox('getText') == "") {
        $.messager.defaults.ok = '确       定';
        $.messager.alert('提醒', '请选择客户!', 'info');

        return;
    }
    //需求箱数为空
    else if ($("#tab_XQXS").val() == "") {
        $.messager.defaults.ok = '确定';
        $.messager.alert('提醒', '请输入需求箱数!', 'info');
        return;
    }
    //需求数量为空
    else if ($("#tab_XQSL").val() == "") {
        $.messager.defaults.ok = '确定';
        $.messager.alert('提醒', '请输入需求数量!', 'info');
        return;
    } else {
        $.ajax({
            url: "BiddDmdOrderNew.ashx?type=insert",
            type: "POST",
            cache: false,
            data: "custom=" + $("#Customer").combobox('getText') + "&customId=" + $("#Customer").combobox(
                'getValue') +
                "&pl=" + _pl + "&pm=" + _pm + "&xl=" + _xl +
                "&gg=" + _gg + "&ph=" + _ph + "&dj=" + _dj + "&price=" + _price +
                "&dz=" + _dz + "&cplx=" + $("#DropList_CPLX").children("option:selected").text() +
                "&xqxs=" + $("#tab_XQXS").val() + "&xqsl=" + $("#tab_XQSL").val() +
                "&GSH=" + $("#Dp_Gf").combobox('getValue') + "&upprice=" + $("#TBox_Up").val(),
            dataType: "json",
            success: function (option) {
                if (option.statu == "ok") {
                    $.messager.defaults.ok = '确定';
                    $.messager.alert('需求添加提醒', '需求添加成功!', 'info');
                } else {
                    $.messager.defaults.ok = '确定';
                    $.messager.alert('需求添加提醒', option.msg, 'info');
                }


                $('#p').window('center');
                $('#p').window('close');
            }
        })
    }
}

function Search() {
    isSearch = true;
    $('#tab_list').datagrid('load', {
        txtsearch: $("#txtsearch").val(),
        pm: pm
    });
}

//库存明细
function stocksdetail() {
    $('#ywy_stockinfo').window('center');
    $('#ywy_stockinfo').window('open');
    YWYStockInfo(_pm, _dj, _ph);
}

//品名切换
function TabGrid(e) {
    pm = $(e).val();
    $('#tab_list').datagrid('load', {
        txtsearch: "",
        pm: pm
    });
    $("#txtsearch").val("");
    $(e).removeClass("btn-gray").siblings().addClass("btn-gray");
}


function myOrderList() {
    $('#ordlist').window('center');
    $('#ordlist').window('open');
    MyOrderListInit();
}

function ComboxInit() {
    $('#Customer').combobox({
        url: 'GoodsList.ashx?type=custom&gfid=' + "11",
        method: 'post',
        valueField: 'id',
        textField: 'text',
        width: 250,
        panelHeight: 120,
        onSelect: function (rec) {
            Get_YE();
        },
        onChange: function (rec) {
            Get_YE();
        }
    })
}



//供方改变的时候更新客户下拉
function Gf_Onchange(e) {
    var _gfname = e.text;
    var _gfid = e.value;
    $('#Customer').combobox("clear");
    var url = "GoodsList.ashx?type=custom&gfid=" + _gfid;
    $("#Customer").combobox("reload", url);
    Get_YE();
}


function Get_YE() {
    var t_customid = $("#Customer").combobox('getValue');
    var t_gfidid = $("#Dp_Gf").combobox('getValue');
    if (t_customid != "" && t_gfidid != "") {
        $.ajax({
            url: "GoodsList.ashx?type=GetYE",
            type: "POST",
            cache: false,
            data: "gfid=" + t_gfidid + "&customid=" + t_customid,
            dataType: "json",
            success: function (option) {
                if (option.statu == "ok") {
                    _ye = option.data.YE[0].txhxjye;
                    $("#tab_ye").html(_ye);
                }
            }
        })
    } else {
        _ye = "";
    }
}


function SetSumPrice() {
    var _upprice = $("#TBox_Up").val();
    if (!isNaN(_upprice)) {
        //加价只能是50的
        if (parseFloat(_upprice) % 50 != 0 && parseFloat(_upprice) > 0) {
            $.messager.defaults.ok = '确定';
            $.messager.alert('警告', '加价只能为50的整数倍!', 'info');
            $("#TBox_Up").val("");
            $("#tab_SumPrice").text(parseFloat(_price));
            return;
        }
        $("#tab_SumPrice").text((parseFloat(_price) + parseFloat(_upprice / 1000)).toFixed(3));
    }

}

function Validator() {

    //如果为DTY以箱数进行判断。。需大于100
    if (_pm == "DTY") {
        var _kfxs = $("#tab_KFXS").val();
        var _xqxs = $("#tab_XQXS").val();
        if (!isNaN(_kfxs) && parseFloat(_kfxs) > 100) {
            if (!isNaN(_xqxs) && parseFloat(_xqxs) <= 100) {
                $.messager.defaults.ok = '确定';
                $.messager.alert('警告', '需求箱数不能少于100!', 'info');
                return false;
            }
        }
        //优先判断库存值是否比界限值小，如果小则竞价数量只能等于库存数量
        else if (!isNaN(_kfxs) && parseFloat(_kfxs) <= 100) {
            if (!isNaN(_xqxs) && parseFloat(_xqxs) != parseFloat(_kfxs)) {
                $.messager.defaults.ok = '确定';
                $.messager.alert('警告', '需求箱数只能为库存箱数!', 'info');
                return false;
            }
        }
    }

    //如果为FDY以数量进行判断。。需大于5吨
    if (_pm == "FDY") {
        var _kfsl = $("#tab_KFSL").val();
        var _xqsl = $("#tab_XQSL").val();
        if (!isNaN(_kfsl) && parseFloat(_kfsl) > 5) {
            if (!isNaN(_xqsl) && parseFloat(_xqsl) <= 5) {
                $.messager.defaults.ok = '确定';
                $.messager.alert('警告', '需求数量不能少于5吨!', 'info');
                return false;
            }
        } else if (!isNaN(_kfsl) && parseFloat(_kfsl) <= 5) {
            if (!isNaN(_xqsl) && parseFloat(_xqsl) != parseFloat(_kfsl)) {
                $.messager.defaults.ok = '确定';
                $.messager.alert('警告', '需求数量只能为库存数量!', 'info');
                return false;
            }
        }
    }


    //如果为POY以数量进行判断。。需大于10吨
    if (_pm == "POY") {

        var _kfsl = $("#tab_KFSL").html();
        var _xqsl = $("#tab_XQSL").val();
        if (!isNaN(_kfsl) && parseFloat(_kfsl) > 10) {
            if (!isNaN(_xqsl) && parseFloat(_xqsl) <= 10) {
                $.messager.defaults.ok = '确定';
                $.messager.alert('警告', '需求数量不能少于10吨!', 'info');
                return false;
            }
        } else if (!isNaN(_kfsl) && parseFloat(_kfsl) <= 10) {
            if (!isNaN(_xqsl) && parseFloat(_xqsl) != parseFloat(_kfsl)) {
                $.messager.defaults.ok = '确定';
                $.messager.alert('警告', '需求数量只能为库存数量!', 'info');
                return false;
            }
        }
    }
    return true;
}