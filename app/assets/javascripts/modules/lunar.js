angular.module('local.globals', [])
    .factory('Lunar', function(){
        'use strict';
        var MINUTE_MS = 60 * 1000,
            HOUR_MS = MINUTE_MS * 60,
            DAY_MS  = HOUR_MS * 24,
            MONTH_MS = DAY_MS * 30,
            YEAR_MS = DAY_MS * 365,
            HE_START_YEAR = 1864, //干支计算起始年 甲子年
            HE_START_DAY = new Date(1899, 11, 22), //干支计算起始日，甲子日
            MIN_YEAR = 1900,
            MAX_YEAR = 2050,
            BASE_DATE = new Date(MIN_YEAR, 0, 30),
            heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
            earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],
            solarTerms = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
                "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"],
            solarTermInfos = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072,
                240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758],
            monthNames = [ "正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"],
            dayNames = ["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十", "十一","十二","十三",
                "十四","十五","十六","十七","十八","十九","二十", "廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"],
            lunarFestivals = {
                "1-1": '春节',
                "1-15": "元宵节",
                "5-5": "端午节",
                "7-7": "七夕",
                "7-15": "中元节",
                "8-15": "中秋节",
                "9-9": "重阳节",
                "12-8": "腊八节",
                "12-14": "小年"
            },
            /**
             * 年基础数据表(1901 ~ 2050)
             *
             * 前4位，即0在这一年是润年时才有意义，它代表这年润月的大小月，为1则润大月，为0则润小月。
             * 中间12位，即4bd，每位代表一个月，为1则为大月，为0则为小月。
             * 最后4位，即8，代表这一年的润月月份，为0则不润。首4位要与末4位搭配使用。
             */
            lunarInfo = [
                0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,    // 1910
                0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,    // 1920
                0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,    // 1930
                0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,    // 1940
                0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,    // 1950
                0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,    // 1960
                0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,    // 1970
                0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,    // 1980
                0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,    // 1990
                0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,    // 2000
                0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,    // 2010
                0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,    // 2020
                0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,    // 2030
                0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,    // 2040
                0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,    // 2050
                0x14B63
            ];

        /**
         * 传回农历y年的总天数
         * @param y
         * @returns {number}
         */
        function lunarYearDays(year) {
            var i,
                days = 348, //29天 * 12个月
            //0x04BD8 & 0x0FFFF 中间12位，即4BD，每位代表一个月，为1则为大月，为0则为小月
                info = lunarInfo[year - MIN_YEAR] & 0x0FFFF;
            for (i = 0x8000; i > 0x8; i >>= 1) { //右移12位
                days += (info & i) == 0 ? 0 : 1;   // 0x04BD8 & 0x0FFFF & 0x8000[1000 0000 0000 0000]
            }
            return days + lunarLeapMonthDays(year);
        }



        /**
         * 传回农历y年闰月的天数
         * @param y
         * @returns {number}
         */
        function lunarLeapMonthDays(year) {
            if (lunarLeapMonth(year) > 0) {
                //前4位，即0在这一年是润年时才有意义，它代表这年润月的大小月。
                return (lunarInfo[year - MIN_YEAR] & 0x10000) ? 30 : 29;
            } else {
                return 0;
            }
        }

        /**
         * ^private
         * 传回农历year润哪个月（1~12），没有则返回0
         */
        function lunarLeapMonth(year) {
            //最后4位，代表这一年的润月月份，为0则不润。首4位要与末4位搭配使用
            return lunarInfo[year - MIN_YEAR] & 0xf;
        }

        /**
         * 传回农历y年m月的总天數
         * @param y
         * @param m
         * @returns {number}
         */
        function lunarMonthDays(year, month) {
            return (lunarInfo[year - MIN_YEAR] & (0x10000 >> month)) ? 30 : 29;
        }

        function lunarFestival(year, month, day){
            if (month == 12 && day == lunarMonthDays(year, month)) {
                return '除夕';
            } else {
                return lunarFestivals[month + "-" + day];
            }
        }

        /**
         *  定气法计算二十四节气,二十四节气是按地球公转来计算的，并非是阴历计算的
         *  节气的定法有两种。古代历法采用的称为"恒气"，即按时间把一年等分为24份，
         *
         *  每一节气平均得15天有余，所以又称"平气"。现代农历采用的称为"定气"，即
         *  按地球在轨道上的位置为标准，一周360°，两节气之间相隔15°。由于冬至时地
         *  球位于近日点附近，运动速度较快，因而太阳在黄道上移动15°的时间不到15天。
         *  夏至前后的情况正好相反，太阳在黄道上移动较慢，一个节气达16天之多。采用
         *  定气时可以保证春、秋两分必然在昼夜平分的那两天。
         */
        function solarTerm(date) {
            var baseDate = new Date(MIN_YEAR, 0, 6, 2, 5, 0), //#1/6/1900 2:05:00 AM#
                year = date.getFullYear(),
                num, i, newDate;
            for (i = 1; i <= 24; i++) {
                num = 525948.76 * (year - MIN_YEAR) + solarTermInfos[i - 1];
                newDate = new Date(baseDate.getTime() + num * MINUTE_MS);//按分钟计算
                if (Math.floor(newDate.getTime() / DAY_MS) == Math.ceil(date.getTime() / DAY_MS)) {
                    return solarTerms[i - 1];
                }
            }
            return null;
        }

        function lunar(date) {
            var i, leapMonth, tmp, offset, _year, _month, _day, _isLeapYear, _isLeapMonth;
            if (date < MIN_YEAR && date > MAX_YEAR) {
                throw new Error("Overflow, " + date + " not in [" + MIN_YEAR + ", " + MAX_YEAR + "]");
            }
            offset = Math.floor((date - BASE_DATE) / DAY_MS);  //距离最早日期的天数
            for (i = MIN_YEAR; i < MAX_YEAR; i++) {
                tmp = lunarYearDays(i);
                if (offset - tmp < 1) {
                    break;
                } else {
                    offset -= tmp;
                }
            }
            _year = i;
            leapMonth = lunarLeapMonth(_year); //计算该年闰哪个月
            _isLeapYear = leapMonth > 0;
            _isLeapMonth = false;
            for (i = 1; i <= 12; i++) {
                if (leapMonth > 0 && i == leapMonth + 1 && !_isLeapMonth) {
                    _isLeapMonth = true;
                    --i;
                    tmp = lunarLeapMonthDays(_year); //计算闰月天数
                } else {
                    _isLeapMonth = false;
                    tmp = lunarMonthDays(_year, i); //计算非闰月天数
                }
                if (offset - tmp <= 0) {
                    break;
                }
                offset -= tmp;
            }
            _month = i;
            _day = offset;
            return {
                year: _year,
                month: _month,
                day: _day,
                isLeapYear: _isLeapYear,
                isLeapMonth: _isLeapMonth,
                toLunarYear: function(){
                    return toLunarYear(_year);
                },
                toLunarMonth: function(){
                    //每个月的地支总是固定的,而且总是从寅月开始
                    var i, j, earthlyBranche;
                    i = _month > 10 ? _month - 10 : _month + 2;
                    earthlyBranche = earthlyBranches[i - 1];
                    //根据当年的干支年的干来计算月干的第一个
                    i = (_year - HE_START_YEAR) % 60;
                    switch (i % 10){
                        case 0: //甲
                            j = 3;
                            break;
                        case 1: //乙
                            j = 5;
                            break;
                        case 2: //丙
                            j = 7;
                            break;
                        case 3: //丁
                            j = 9;
                            break;
                        case 4: //戊
                            j = 1;
                            break;
                        case 5: //己
                            j = 3;
                            break;
                        case 6: //庚
                            j = 5;
                            break;
                        case 7: //辛
                            j = 7;
                            break;
                        case 8: //壬
                            j = 9;
                            break;
                        case 9: //癸
                            j = 1;
                            break;
                    }
                    return heavenlyStems[(j + _month - 2) % 10] + earthlyBranche + '月';
                },
                toLunarDay: function(){
                    var offset = Math.floor((date - HE_START_DAY) / DAY_MS);
                    return toHE(offset, '日');
                },
                toLunarString: function(){
                    return this.toLunarYear() + (_isLeapMonth ? '闰' : '') + this.toLunarMonth() + this.toLunarDay();
                },
                toString: function(){
                    return lunarFestival(_year, _month, _day)
                        || this.toSolarTerm()
                        || (_isLeapMonth ? '闰' : '') + this.toMonth() + this.toDay();
                },
                toMonth: function(){
                    return monthNames[_month - 1] + '月';
                },
                toDay: function(){
                    return dayNames[_day - 1];
                },
                toSolarTerm: function(){
                    return solarTerm(date);
                }
            }
        }

        function toHE(offset, unit){
            var i = offset % 60;
            return heavenlyStems[i % 10] + earthlyBranches[i % 12] + unit;
        }

        function toLunarYear(year){
            var offset = year - HE_START_YEAR;
            return toHE(offset, '年');
        }

        function isSolarLeapYear(year){
            return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        }

        return {
            t: lunar,
            toLunarYear: toLunarYear
        };
    });