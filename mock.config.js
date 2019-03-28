module.exports = (app) => {
  app
    .get('/api/fdactivity/activity/caprisuncouponput', (req, res) => {
      // res.status(404).send('Not Found');
      res.json(require('./mocks/demo/coupon.json'));
    })
    .get('/api/activity/vip/thanksgiving', (req, res) => {
      res.json(require('./mocks/thanksgiving/index.json'));
    })
    .get('/api/napi/activity/answergamehome', (req, res) => {
      res.json(require('./mocks/sevenChallenge/index.json'));
    })
    .get('/api/napi/ajax/fudaoschoolinfo', (req, res) => {
      res.json(require('./mocks/answerTeam/address.json'));
    })
    .get('/api/napi/activity/answercommunityhomepage', (req, res) => {
      res.json(require('./mocks/answerTeam/getHome.json'));
    })
    .get('/api/activity/vip/christmas2018', (req, res) => {
      res.json(require('./mocks/christmas2018/index.json'));
    })
    .get('/api/activity/vip/chinatelecom2019', (req, res) => {
      res.json(require('./mocks/chinatelecom2019/index.json'));
    })
    .get('/api/activity/vip/chinatelecomwelfare', (req, res) => {
      res.json(require('./mocks/chinatelecom2019/welfare.json'));
    })
    .get('/api/support/pay/ajaxstatus', (req, res) => {
      res.json(require('./mocks/chinatelecom2019/paystatus.json'));
    })
    .post('/api/support/pay/h5api', (req, res) => {
      res.json(require('./mocks/chinatelecom2019/h5pay.json'));
    })
    .get('/api/napi/activity/answercommunityinfopage', (req, res) => {
      res.json(require('./mocks/answerTeam/teamPage.json'));
    })
    .post('/api/activity/vip/vipfiveyears', (req, res) => {
      res.json(require('./mocks/anniBranch/vipfiveyears.json'));
    })
    .get('/api/activity/write/finalarticle', (req, res) => {
      res.json(require('./mocks/writeResult/res.json'));
    })
    // termbegin
    .get('/api/activity/vip/activity', (req, res) => {
      res.json(require('./mocks/termBegin/activity.json'));
    })
    .get('/api/activity/vip/activityluckhistory', (req, res) => {
      res.json(require('./mocks/termBegin/activityluckhistory.json'));
    })
    .get('/api/activity/vip/activityluckuser', (req, res) => {
      res.json(require('./mocks/termBegin/activityluckuser.json'));
    })
    .get('/api/activity/vip/activityshare', (req, res) => {
      res.json(require('./mocks/termBegin/activityshare.json'));
    })
    .post('/api/activity/vip/activityluckdraw', (req, res) => {
      res.json(require('./mocks/termBegin/activityluckdraw.json'));
    })
    .post('/api/activity/vip/activityisbuy', (req, res) => {
      res.json(require('./mocks/termBegin/activityisbuy.json'));
    })
    .post('/api/activity/vip/activityaddress', (req, res) => {
      res.json(require('./mocks/termBegin/activityaddress.json'));
    })
    .get('/api/activity/activity/papercollect/getschoollist', (req, res) => {
      const type = req.query.type;
      if (!type) {
        res.json(require('./mocks/paperCollect/province.json'));
      } else if(type == 1) {
        res.json(require('./mocks/paperCollect/city.json'));
      } else if(type == 2) {
        res.json(require('./mocks/paperCollect/area.json'));
      } else if(type == 3) {
        res.json(require('./mocks/paperCollect/school.json'));
      }
    })

    // 阅读世界学习礼
    .post('/api/macan/activity/PurchaseBookCardPrizeDrawUpdateUserAddress', (req, res) => {
      res.json(require('./mocks/readWorldLucky/PurchaseBookCardPrizeDrawUpdateUserAddress.json'));
    })
    .get('/api/macan/activity/PurchaseBookCardPrizeDraw', (req, res) => {
      res.json(require('./mocks/readWorldLucky/PurchaseBookCardPrizeDraw.json'));
    })
    .get('/api/macan/activity/PurchaseBookCardPrizeDrawRandomRecord', (req, res) => {
      res.json(require('./mocks/readWorldLucky/PurchaseBookCardPrizeDrawRandomRecord.json'));
    })
    .get('/api/macan/activity/PurchaseBookCardPrizeDrawMyPrizes', (req, res) => {
      res.json(require('./mocks/readWorldLucky/PurchaseBookCardPrizeDrawMyPrizes.json'));
    })
    .get('/api/macan/activity/purchasebookcardprizedrawrecivebookcard', (req, res) => {
      res.json(require('./mocks/readWorldLucky/purchasebookcardprizedrawrecivebookcard.json'));
    })
    .get('/api/macan/activity/PurchaseBookCardPrizeDrawUserAddress', (req, res) => {
      res.json(require('./mocks/readWorldLucky/PurchaseBookCardPrizeDrawUserAddress.json'));
    })
    .get('/api/macan/activity/PurchaseBookCardPrizeDrawStart', (req, res) => {
      res.json(require('./mocks/readWorldLucky/PurchaseBookCardPrizeDrawStart.json'));
    });

  // action 模拟
  app.get('/hybridaction/*', (req, res) => {
    try {
        res.json(require(`./mocks/actions/${path.basename(req.path)}.json`)); // eslint-disable-line
    } catch (e) {
      res.json(require('./mocks/actions/common.json'));
    }
  });
};
