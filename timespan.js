/*
 * TimeSpan(milliseconds);
 * TimeSpan(days, hours, minutes, seconds);
 * TimeSpan(days, hours, minutes, seconds, milliseconds);
 */
var TimeSpan = function (days, hours, minutes, seconds, milliseconds) {
    var attrs = "days hours minutes seconds milliseconds".split(/\s+/);

    var gFn = function (attr) {
        return function () {
            return this[attr];
        };
    };

    var sFn = function (attr) {
        return function (val) {
            this[attr] = val;
            return this;
        };
    };

    for (var i = 0; i < attrs.length ; i++) {
        var $a = attrs[i], $b = $a.slice(0, 1).toUpperCase() + $a.slice(1);
        TimeSpan.prototype[$a] = 0;
        TimeSpan.prototype["get" + $b] = gFn($a);
        TimeSpan.prototype["set" + $b] = sFn($a);
    }

    if (arguments.length == 4) {
        this.setDays(days);
        this.setHours(hours);
        this.setMinutes(minutes);
        this.setSeconds(seconds);
    } else if (arguments.length == 5) {
        this.setDays(days);
        this.setHours(hours);
        this.setMinutes(minutes);
        this.setSeconds(seconds);
        this.setMilliseconds(milliseconds);
    } else if (arguments.length == 1 && typeof days == "number") {
        var orient = (days < 0) ? -1 : +1;
        this.setMilliseconds(Math.abs(days));

        this.setDays(Math.floor(this.getMilliseconds() / 86400000) * orient);
        this.setMilliseconds(this.getMilliseconds() % 86400000);

        this.setHours(Math.floor(this.getMilliseconds() / 3600000) * orient);
        this.setMilliseconds(this.getMilliseconds() % 3600000);

        this.setMinutes(Math.floor(this.getMilliseconds() / 60000) * orient);
        this.setMilliseconds(this.getMilliseconds() % 60000);

        this.setSeconds(Math.floor(this.getMilliseconds() / 1000) * orient);
        this.setMilliseconds(this.getMilliseconds() % 1000);

        this.setMilliseconds(this.getMilliseconds() * orient);
    }

    this.getTotalMilliseconds = function () {
        return (this.getDays() * 86400000) + (this.getHours() * 3600000) + (this.getMinutes() * 60000) + (this.getSeconds() * 1000);
    };

    this.compareTo = function (time) {
        var t1 = new Date(1970, 1, 1, this.getHours(), this.getMinutes(), this.getSeconds()), t2;
        if (time === null) {
            t2 = new Date(1970, 1, 1, 0, 0, 0);
        }
        else {
            t2 = new Date(1970, 1, 1, time.getHours(), time.getMinutes(), time.getSeconds());
        }
        return (t1 < t2) ? -1 : (t1 > t2) ? 1 : 0;
    };

    this.equals = function (time) {
        return (this.compareTo(time) === 0);
    };

    this.add = function (time) {
        return (time === null) ? this : this.addSeconds(time.getTotalMilliseconds() / 1000);
    };

    this.subtract = function (time) {
        return (time === null) ? this : this.addSeconds(-time.getTotalMilliseconds() / 1000);
    };

    this.addDays = function (n) {
        return new TimeSpan(this.getTotalMilliseconds() + (n * 86400000));
    };

    this.addHours = function (n) {
        return new TimeSpan(this.getTotalMilliseconds() + (n * 3600000));
    };

    this.addMinutes = function (n) {
        return new TimeSpan(this.getTotalMilliseconds() + (n * 60000));
    };

    this.addSeconds = function (n) {
        return new TimeSpan(this.getTotalMilliseconds() + (n * 1000));
    };

    this.addMilliseconds = function (n) {
        return new TimeSpan(this.getTotalMilliseconds() + n);
    };

    this.get12HourHour = function () {
        return (this.getHours() > 12) ? this.getHours() - 12 : (this.getHours() === 0) ? 12 : this.getHours();
    };

    this.getDesignator = function () {
        return (this.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
    };

    this.toString = function (format) {
        this._toString = function () {
            if (this.getDays() !== null && this.getDays() > 0) {
                return this.getDays() + "." + this.getHours() + ":" + this.p(this.getMinutes()) + ":" + this.p(this.getSeconds());
            }
            else {
                return this.getHours() + ":" + this.p(this.getMinutes()) + ":" + this.p(this.getSeconds());
            }
        };

        this.p = function (s) {
            return (s.toString().length < 2) ? "0" + s : s;
        };

        var me = this;

        return format ? format.replace(/dd?|HH?|hh?|mm?|ss?|tt?/g,
        function (format) {
            switch (format) {
            case "d":
                return me.getDays();
            case "dd":
                return me.p(me.getDays());
            case "H":
                return me.getHours();
            case "HH":
                return me.p(me.getHours());
            case "h":
                return me.get12HourHour();
            case "hh":
                return me.p(me.get12HourHour());
            case "m":
                return me.getMinutes();
            case "mm":
                return me.p(me.getMinutes());
            case "s":
                return me.getSeconds();
            case "ss":
                return me.p(me.getSeconds());
            case "t":
                return ((me.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator).substring(0, 1);
            case "tt":
                return (me.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
            }
        }
        ) : this._toString();
    };
    return this;
};
