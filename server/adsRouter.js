/**
 * Created by ash on 22/05/2017.
 */
const express = require('express');
const router = express.Router();
const moment = require('moment');
const SimpleNodeLogger = require('simple-node-logger');
const UglifyJS = require("uglify-js");

const fs = require('fs');

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
  fs.readdir(`${__dirname}/../public/adsFiles`, (err, files) => {
    res.status(200).json({ result: 0, files: files || [], });
  });
});

router.post('/newAds', (req, res) => {
  const str = `
    window.onload = function() {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'http://web-site-files.ashshen.cc/ads/cpAd.min.js';
      script.id = 'no-use-11';
      script.onload = function() {
        var bodyDom = document.getElementsByTagName('body')[0];
        var copyObj = new CpAd(bodyDom, {
          text: function() {
            return 'test string';
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
  fs.readdir(`${__dirname}/../public/adsFiles`, (err, files) => {
    if (err) {
      res.status(400).json({ result: 1, error: err });
    } else {
      const result = UglifyJS.minify(str, options);
      fs.writeFile(`${__dirname}/../public/adsFiles/ads-v1.${files.length}.0.js`, result.code, (err1) => {
        if (err1) {
          res.status(400).json({ result: 1, error: err1 });
        } else {
          res.status(200).json({ result: 0, path: `http://localhost:1788/adsFiles/ads-v1.${files.length}.0.js`, });
        }
      });
    }
  });
});

module.exports = router;
