! function() {
    var a = {
        includes: {},
        globals: {},
        delimiter: ">",
        compact: !1,
        _copy: function(a, b) {
            b = b || [];
            for (var c in a) b[c] = a[c];
            return b
        },
        _size: function(a) {
            return a instanceof Array ? a.length : a || 0
        },
        _iter: function(a, b) {
            this.idx = a, this.size = b, this.length = b, this.sign = "#", this.toString = function() {
                return this.idx + this.sign.length - 1
            }
        },
        _pipe: function(b, c) {
            var d, e, f, g;
            if (d = c.shift()) {
                e = d.split(this.delimiter), f = e.shift().trim();
                try {
                    g = a.pipes[f].apply(null, [b].concat(e)), b = this._pipe(g, c)
                } catch (h) {}
            }
            return b
        },
        _eval: function(b, c, d) {
            var e, f, g = this._pipe(b, c),
                h = g,
                i = -1;
            if (g instanceof Array)
                for (g = "", e = h.length; ++i < e;) f = {
                    iter: new this._iter(i, e)
                }, g += d ? a.up(d, h[i], f) : h[i];
            else g instanceof Object && (g = a.up(d, h));
            return g
        },
        _test: function(b, c, d, e) {
            var f = a.up(c, d, e).split(/\{\{\s*else\s*\}\}/);
            return (b === !1 ? f[1] : f[0]) || ""
        },
        _bridge: function(a, b) {
            b = "." == b ? "\\." : b.replace(/\$/g, "\\$");
            var c, d, e = "{{\\s*" + b + "([^/}]+\\w*)?}}|{{/" + b + "\\s*}}",
                f = new RegExp(e, "g"),
                g = a.match(f) || [],
                h = 0,
                i = 0,
                j = -1,
                k = 0;
            for (d = 0; d < g.length && (c = d, j = a.indexOf(g[c], j + 1), g[c].indexOf("{{/") > -1 ? i++ : h++, h !== i); d++);
            return h = a.indexOf(g[0]), i = h + g[0].length, k = j + g[c].length, [a.substring(h, k), a.substring(i, j)]
        }
    };
    a.up = function(b, c, d) {
        c = c || {}, d = d || {};
        var e, f, g, h, i, j, k, l, m, n, o = /\{\{(.+?)\}\}/g,
            p = b.match(o) || [],
            q = [],
            r = 0,
            s = 0;
        for (d.pipes && this._copy(d.pipes, this.pipes), d.includes && this._copy(d.includes, this.includes), d.globals && this._copy(d.globals, this.globals), d.delimiter && (this.delimiter = d.delimiter), void 0 !== d.compact && (this.compact = d.compact); e = p[r++];)
            if (k = void 0, j = "", h = e.indexOf("/}}") > -1, f = e.substr(2, e.length - (h ? 5 : 4)), f = f.replace(/`(.+?)`/g, function(b, d) {
                return a.up("{{" + d + "}}", c)
            }), i = 0 === f.trim().indexOf("if "), q = f.split("|"), q.shift(), f = f.replace(/^\s*if/, "").split("|").shift().trim(), g = i ? "if" : f.split("|")[0], n = c[f], i && !q.length && (q = ["notempty"]), !h && b.indexOf("{{/" + g) > -1 && (k = this._bridge(b, g), e = k[0], j = k[1], r += e.match(o).length - 1), !/^\{\{\s*else\s*\}\}$/.test(e)) {
                if (void 0 !== (l = this.globals[f])) k = this._eval(l, q, j);
                else if (m = this.includes[f]) m instanceof Function && (m = m()), k = this._pipe(a.up(m, c, d), q);
                else if (f.indexOf("#") > -1) d.iter.sign = f, k = this._pipe(d.iter, q);
                else if ("." === f) k = this._pipe(c, q);
                else if (f.indexOf(".") > -1) {
                    for (f = f.split("."), n = a.globals[f[0]], n ? s = 1 : (s = 0, n = c); n && s < f.length;) n = n[f[s++]];
                    k = this._eval(n, q, j)
                } else i ? k = this._pipe(n, q) : n instanceof Array ? k = this._eval(n, q, j) : j ? k = n ? a.up(j, n) : void 0 : c.hasOwnProperty(f) && (k = this._pipe(n, q));
                k instanceof Array && (k = this._eval(k, q, j)), i && (k = this._test(k, j, c, d)), b = b.replace(e, void 0 === k ? "???" : k)
            }
        return this.compact ? b.replace(/>\s+</g, "><") : b
    }, a.pipes = {
        empty: function(a) {
            return a && 0 !== (a + "").trim().length ? !1 : a
        },
        notempty: function(a) {
            return a && (a + "").trim().length ? a : !1
        },
        blank: function(a, b) {
            return a || 0 === a ? a : b
        },
        more: function(b, c) {
            return a._size(b) > c ? b : !1
        },
        less: function(b, c) {
            return a._size(b) < c ? b : !1
        },
        ormore: function(b, c) {
            return a._size(b) >= c ? b : !1
        },
        orless: function(b, c) {
            return a._size(b) <= c ? b : !1
        },
        between: function(b, c, d) {
            return b = a._size(b), b >= c && d >= b ? b : !1
        },
        equals: function(a, b) {
            return a == b ? a : !1
        },
        notequals: function(a, b) {
            return a != b ? a : !1
        },
        like: function(a, b) {
            return new RegExp(b, "i").test(a) ? a : !1
        },
        notlike: function(b, c) {
            return a.pipes.like(b, c) ? !1 : b
        },
        upcase: function(a) {
            return String(a).toUpperCase()
        },
        downcase: function(a) {
            return String(a).toLowerCase()
        },
        capcase: function(a) {
            return a.replace(/(?:^|\s)\S/g, function(a) {
                return a.toUpperCase()
            })
        },
        chop: function(a, b) {
            return a.length > b ? a.substr(0, b) + "..." : a
        },
        tease: function(a, b) {
            var c = a.split(/\s+/);
            return c.slice(0, b).join(" ") + (c.length > b ? "..." : "")
        },
        trim: function(a) {
            return a.trim()
        },
        pack: function(a) {
            return a.trim().replace(/\s{2,}/g, " ")
        },
        round: function(a) {
            return Math.round(+a)
        },
        clean: function(a) {
            return String(a).replace(/<\/?[^>]+>/gi, "")
        },
        size: function(a) {
            return a.length
        },
        length: function(a) {
            return a.length
        },
        reverse: function(a) {
            return [].concat(a).reverse()
        },
        join: function(a, b) {
            return a.join(b)
        },
        limit: function(a, b, c) {
            return a.slice(+c || 0, +b + (+c || 0))
        },
        split: function(a, b) {
            return a.split(b || ",")
        },
        choose: function(a, b, c) {
            return a ? b : c || ""
        },
        toggle: function(a, b, c, d) {
            return c.split(",")[b.match(/\w+/g).indexOf(a + "")] || d
        },
        sort: function(a, b) {
            var c = function(a, c) {
                return a[b] > c[b] ? 1 : -1
            };
            return [].concat(a).sort(b ? c : void 0)
        },
        fix: function(a, b) {
            return (+a).toFixed(b)
        },
        mod: function(a, b) {
            return +a % +b
        },
        divisible: function(a, b) {
            return a && 0 === +a % b ? a : !1
        },
        even: function(a) {
            return a && 0 === (1 & +a) ? a : !1
        },
        odd: function(a) {
            return a && 1 === (1 & +a) ? a : !1
        },
        number: function(a) {
            return parseFloat(a.replace(/[^\-\d\.]/g, ""))
        },
        url: function(a) {
            return encodeURI(a)
        },
        bool: function(a) {
            return !!a
        },
        falsy: function(a) {
            return !a
        },
        first: function(a) {
            return 0 === a.idx
        },
        last: function(a) {
            return a.idx === a.size - 1
        },
        call: function(a, b) {
            return a[b].apply(a, [].slice.call(arguments, 2))
        },
        set: function(b, c) {
            return a.globals[c] = b, ""
        },
        log: function(a) {
            return console.log(a), a
        }
    }, "function" != typeof String.prototype.trim && (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "")
    }), "undefined" != typeof module && module.exports ? module.exports = a : "function" == typeof define && define.amd && define(function() {
        return a
    });
    var b = null,
        c = 5e3,
        d = function(a) {
            var b = new XMLHttpRequest,
                d = a.cache ? a.url + "?" + (new Date).getTime() : a.url,
                e = setTimeout(function() {
                    b.abort(), a.error && a.error(), a.complete && a.complete()
                }, c);
            b.open(a.type, d), b.onreadystatechange = function() {
                4 === b.readyState && (clearTimeout(e), 200 === b.status || 0 === b.status ? (a.success && a.success(b.responseText), a.complete && a.complete()) : (a.error && a.error(b.responseText), a.complete && a.complete()))
            }, a.beforeSend && a.beforeSend(b), b.send()
        }, e = function(a) {
            d({
                type: "get",
                url: a.url,
                beforeSend: function(a) {
                    a.setRequestHeader("Accept", "application/json, text/javascript")
                },
                success: function(b) {
                    a.success && a.success(JSON.parse(b))
                },
                error: a.error,
                complete: a.complete,
                cache: !1
            })
        };
    this._fi = function(a,e) {
    	e = e || 7;
        var b = /^.*((facebook\.com\/)(.*)((video|photo|story)\.php|embed))\?(v=|video_id=|story_fbid=|.*&story_fbid=|.*&v=|.*&video_id=)(\d+).*/,
        	d = /^.*(facebook\.com\/)(.*)\/(\d+).*/,r,l,k;
        	if(e!=7) {
        		r = d;
        	}else {
        		r = b;
        	}
        	l = a.match(r);
       		if(l && l[e]){
       			return l[e];
       		} else if(e==3) {
       			return !1;
       		} else {
       			return this._fi(a,3);
       		}
    }, this._fs = function(a) {
        var b = new Date(0, 0, 0);
        return b.setSeconds(+a), (b.getHours() ? b.getHours() + ":" : "") + b.getMinutes() + ":" + b.getSeconds()
    }, this._ct = function(a) {
        var b, c = new Date(1e3 * a),
            d = c.getFullYear(),
            e = ("0" + (c.getMonth() + 1)).slice(-2),
            f = ("0" + c.getDate()).slice(-2),
            g = c.getHours(),
            h = g,
            i = ("0" + c.getMinutes()).slice(-2),
            j = "AM";
        return g > 12 ? (h = g - 12, j = "PM") : 12 === g ? (h = 12, j = "PM") : 0 == g && (h = 12), b = d + "-" + e + "-" + f + ", " + h + ":" + i + " " + j
    }, this.extend = function(a) {
        a = a || {};
        for (var b = 1; b < arguments.length; b++)
            if (arguments[b])
                for (var c in arguments[b]) arguments[b].hasOwnProperty(c) && (a[c] = arguments[b][c]);
        return a
    }, this._u = function(a) {
        if (!a) return "";
        var b = a.length;
        if (void 0 == b) return a.checked ? a.value : "";
        for (var c = 0; b > c; c++)
            if (a[c].checked) return a[c].value;
        return ""
    }, this.setCheckedValue = function(a, b) {
        if (a) {
            var c = a.length;
            if (void 0 == c) return a.checked = a.value == b.toString(), void 0;
            for (var d = 0; c > d; d++) a[d].checked = !1, a[d].value == b.toString() && (a[d].checked = !0)
        }
    }, this._f = function(a, b) {
        var c = _i("_vs"),
            d = c.parentNode,
            e = "has-" + b;
        c.innerHTML = a, d.className = d.className.replace(/\b(has-\w+)\b/g, "").trim(), d.className += " " + e
    }, this._gfv = function(c) {
        var d = _fi(c);
        if (d !== b) {
            if (!d) return _f("Error!!!", "error"), void 0;
            var f = '<div class="row"><div class="col-md-6">{{if title|notempty}}<h3>{{title}}</h3>{{/if}}<div class="download_link">{{if src|notempty}}<a class="btn btn-default" target="_blank" href="{{src}}" role="button"><span class="glyphicon glyphicon-save" aria-hidden="true"></span> Download SD (360p)</a>{{/if}}{{if src_hq|notempty}}<a class="btn btn-info" target="_blank" href="{{src_hq}}" role="button"><span class="glyphicon glyphicon-save" aria-hidden="true"></span> Download HD (720p/960p/1080p)</a>{{/if}}<p class="dl_g"><small>(Right click the download link button and choose "Save link as...")</small></p></div><p>Duration: <em>{{length}}</em></p><p>Created time: <em>{{created_time}}</em></p><p id="bit_link"></p>{{embed}}</div><div class="col-md-6"><h5>Preview (Click thumbnail to play)</h5><div class="thumbnail"><div id="embed-preview" class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://www.facebook.com/video/embed?video_id={{vid}}" allowfullscreen></iframe></div></div></div></div>';
            e({
                url: "https://graph.facebook.com/fql?q=select vid, created_time, title, thumbnail_link, src_hq, src , embed_html, length from video where vid=" + d,
                cache: !1,
                success: function(c) {
                    var e = c.data[0];
                    return "undefined" == typeof e.vid ? _f("Error!", "error") : (_f("Done!!", "success"), ga("send", "event", {
                        eventCategory: "Facebook",
                        eventAction: "Download",
                        eventLabel: d,
                        eventValue: d
                    }), e.length = _fs(e.length), e.created_time = _ct(e.created_time), e.embed = _e({
                        vid: e.vid
                    }), _i("result_container").innerHTML = a.up(f, e), e = c = null, b = d, bitLink(d), void 0)
                },
                error: function() {
                    _f("Error!!!", "error")
                }
            })
        }
    }, this._e = function(b) {
        if (b.vid) {
            var c = {
                width: 640,
                ratio: "16:9"
            }, d = extend({}, c, b),
                e = '<div class="form-group"><label for="embed_code_rs">Embed code</label><textarea class="form-control" id="_ehc" onclick="_s(\'_ehc\');" rows="2" readonly>{{f_m}}</textarea></div><div id="custom_embed_btn" onclick="_t(\'custom_embed_tog\', \'toggle\');">Custom embed size <span class="caret"></span></div><div id="custom_embed_tog" class="toggle"><div class="video-embed"><form class="form-horizontal" id="e_f" name="e_f" method="get" action="" onsubmit="return false;"><div class="form-group radio_buttons"><label class="radio_buttons optional col-sm-3 control-label">Aspect Ratio</label><div class="col-sm-9"><label class="radio-inline"><input class="radio_buttons optional" id="video_ratio169" name="v_r" onclick="_k()" type="radio" {{if ratio|equals>16:9}}checked="checked"{{/if}} value="16:9">16:9</label><label class="radio-inline"><input class="radio_buttons optional" id="video_ratio43" name="v_r" onclick="_k()" type="radio" {{if ratio|equals>4:3}}checked="checked"{{/if}} value="4:3">4:3</label></div></div><div class="form-group"><label class="col-sm-3 control-label" for="_ew">Width</label><div class="col-sm-3"><input class="string form-control" id="_ew" name="_ew" value="{{width}}" placeholder="Width" onkeyup="_k();" type="number"></div></div><div class="form-group"><label class="col-sm-3 control-label" for="embed_height">Height</label><div class="col-sm-3"><input class="string  form-control" id="embed_height" readonly name="embed_height" value="{{height}}" placeholder="Height" type="number"></div></div></form></div></div>';
            return d.height = _v(d.width, d.ratio), d.f_m = f_m(d.vid, d.width, d.height), a.up(e, d)
        }
    }, this._v = function(a, b) {
        var c = null;
        return a *= 1, "16:9" == b ? c = Math.round(9 * (a / 16)) : "4:3" == b && (c = Math.round(3 * (a / 4))), c
    }, this.f_m = function(a, b, c) {
        return '<iframe src="https://www.facebook.com/video/embed?video_id=' + a + '" width="' + b + '" height="' + c + '" frameborder="0"></iframe>'
    }, this._k = function() {
        var a = _i("_ew").value,
            c = "embed-preview",
            d = _u(document.forms.e_f.elements.v_r),
            e = _v(a, d);
        _i("embed_height").value = e, _i("_ehc").innerHTML = f_m(b, a, e), "16:9" == d ? (_r(c, "embed-responsive-4by3"), _l(c, "embed-responsive-16by9")) : (_r(c, "embed-responsive-16by9"), _l(c, "embed-responsive-4by3"))
    }, this._fdf = function() {
        var a = _i("_vl"),
            b = a.value;
        return "" !== b.trim() ? _gfv(b) : (_f("Hi!", "hi"), void 0)
    }, this._fgc = function() {
        var a = _i("_vl"),
            b = a.value,
            c = _fi(b);
        if (!c) return _f("Error!!!", "error"), void 0;
        var d = '<div class="row"><div class="col-md-6">' + _e({
            vid: c
        }) + "</div>" + '<div class="col-md-6"><h5>Preview (Click thumbnail to play)</h5>' + '<div class="thumbnail">' + '<div id="embed-preview" class="embed-responsive embed-responsive-16by9">' + '<iframe class="embed-responsive-item" src="https://www.facebook.com/video/embed?video_id=' + c + '" allowfullscreen></iframe>' + "</div>" + "</div>" + "</div>" + "</div>";
        _i("result_container").innerHTML = d, _f("Done!!", "success"), ga("send", "event", {
            eventCategory: "Facebook",
            eventAction: "Embed",
            eventLabel: c,
            eventValue: c
        })
    }, this._s = function(a) {
        _i(a).focus(), _i(a).select()
    }, this._t = function(a, b) {
        var c = _i(a),
            d = " " + c.className.replace(/[\t\r\n]/g, " ") + " ";
        if (_hc(a, b)) {
            for (; d.indexOf(" " + b + " ") >= 0;) d = d.replace(" " + b + " ", " ");
            c.className = d.replace(/^\s+|\s+$/g, "")
        } else c.className += " " + b
    }, this._hc = function(a, b) {
        var c = _i(a);
        return c.classList ? c.classList.contains(b) : new RegExp("(^| )" + b + "( |$)", "gi").test(c.className)
    }, this._l = function(a, b) {
        var c = _i(a);
        _hc(a, b) || (c.classList ? c.classList.add(b) : c.className += " " + b)
    }, this._r = function(a, b) {
        var c = _i(a);
        _hc(a, b) && (c.classList ? c.classList.remove(b) : c.className = c.className.replace(new RegExp("(^|\\b)" + b.split(" ").join("|") + "(\\b|$)", "gi"), " "))
    }, this._i = function(a) {
        return document.getElementById(a)
    }, this.ready = function(a) {
        "loading" != document.readyState ? a() : document.addEventListener ? document.addEventListener("DOMContentLoaded", a) : document.attachEvent("onreadystatechange", function() {
            "loading" != document.readyState && a()
        })
    }, this.gfHash = function() {
        var a = window.location.hash;
        if (a) {
            a = a.split("#g!");
            var b = a && a[1] ? decodeURIComponent(a[1]) : !1;
            if (_fi(b)) return _i("_vl").value = b, _gfv(b)
        }
    }, this.bitLink = function(a) {
        var c = a ? a : b,
            d = "bit_link",
            f = encodeURIComponent("http://getfb.net/#g!https://www.facebook.com/video.php?v=" + c);
        e({
            url: "http://api.bitly.com/v3/shorten?format=json&apiKey=R_03725ad0e6404d5ea891de9e2827b1fb&login=getfb&longUrl=" + f,
            cache: !1,
            success: function(a) {
                200 == a.status_code && "OK" == a.status_txt && (_i(d).innerHTML = 'Share link: <a target="_blank" href="http://j.mp/' + a.data.hash + '">http://j.mp/' + a.data.hash + "</a>")
            },
            error: function() {}
        })
    }
}();