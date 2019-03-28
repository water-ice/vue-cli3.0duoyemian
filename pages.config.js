const commonChunks = ['chunk-commons', 'chunk-vendors', 'manifest', 'chunk-async'];
module.exports = {
  miguRead: {
    entry: 'src/pages/miguRead/main.js', // page 入口
    // 模板来源。可选，默认使用 public/index.html。如果默认模板不能满足自己的需求，
    // 可在自己的页面目录下添加 html，template 写添加的 html 的路径
    // template: 'src/pages/miguRead/index.html',
    template: 'public/index.html',
    // 输出文件名。可选，默认为 ${key}.html
    filename: 'miguRead.html',
    title: '咪咕作业帮悦读会',
    chunks: commonChunks.concat('miguRead'),
  },
  outsideGuideTest: {
    entry: 'src/pages/osgTest/main.js',
    title: '微信弹层测试',
    chunks: commonChunks.concat('outsideGuideTest'),
  },
  spellGroup: {
    entry: 'src/pages/spellGroup/main.js',
    title: '作业帮会员拼团',
    chunks: commonChunks.concat('spellGroup'),
  },
  spellDetail: {
    entry: 'src/pages/spellGroup/detail/main.js',
    title: '',
    chunks: commonChunks.concat('spellDetail'),
  },
  paperCollect: {
    entry: 'src/pages/paperCollect/index/main.js',
    title: '试卷共享',
    chunks: commonChunks.concat('paperCollect'),
  },
  paperCollectInfo: {
    entry: 'src/pages/paperCollect/fillInfo/main.js',
    title: '试卷共享',
    chunks: commonChunks.concat('paperCollectInfo'),
  },
  paperCollectRecord: {
    entry: 'src/pages/paperCollect/record/main.js',
    title: '试卷共享',
    chunks: commonChunks.concat('paperCollectRecord'),
  },
  paperCollectInstance: {
    entry: 'src/pages/paperCollect/instance/main.js',
    title: '试卷共享',
    chunks: commonChunks.concat('paperCollectInstance'),
  },
  christmas2018: {
    entry: 'src/pages/christmas2018/main.js',
    title: 'VIP双旦大促',
    chunks: commonChunks.concat('christmas2018'),
  },
  answerIndex: {
    entry: 'src/pages/answerTeam/index/main.js',
    title: '作业问答答题团',
    chunks: commonChunks.concat('answerIndex'),
  },
  answerTeam: {
    entry: 'src/pages/answerTeam/team/main.js',
    title: '作业问答答题团',
    chunks: commonChunks.concat('answerTeam'),
  },
  sevenChallenge: {
    entry: 'src/pages/sevenChallenge/main.js',
    title: '作业问答7天挑战赛',
    chunks: commonChunks.concat('sevenChallenge'),
  },
  chinatelecom2019: {
    entry: 'src/pages/chinatelecom2019/main.js',
    title: '作业帮学子卡',
    chunks: commonChunks.concat('chinatelecom2019'),
  },
  testwxpay: {
    entry: 'src/pages/testwxpay/main.js',
    title: '测试微信支付',
    chunks: commonChunks.concat('testwxpay'),
  },
  // 投稿活动
  // wiki地址 http://wiki.afpai.com/pages/viewpage.action?pageId=19899574
  submitActivity: {
    entry: 'src/pages/submitActivity/home/main.js',
    title: '投稿狂欢周',
    chunks: commonChunks.concat('submitActivity'),
  },
  submitActivityAward: {
    entry: 'src/pages/submitActivity/ownAward/main.js',
    title: '投稿狂欢周',
    chunks: commonChunks.concat('submitActivityAward'),
  },
  submitActivityShare: {
    entry: 'src/pages/submitActivity/share/main.js',
    title: '投稿狂欢周',
    chunks: commonChunks.concat('submitActivityShare'),
  },
  submitActivitySharePage: {
    entry: 'src/pages/submitActivity/sharePage/main.js',
    title: '投稿狂欢周',
    chunks: commonChunks.concat('submitActivitySharePage'),
  },
  writeResult: {
    entry: 'src/pages/write2018Result/main.js',
    title: '第三届作业帮写作大赛获奖名单',
    chunks: commonChunks.concat('writeResult'),
  },
  termBegin: {
    entry: 'src/pages/termBegin/main.js',
    title: 'VIP开学特惠',
    chunks: commonChunks.concat('termBegin'),
  },
  readWorldLucky: {
    entry: 'src/pages/readWorldLucky/main.js',
    title: '阅读世界学习礼',
    chunks: commonChunks.concat('readWorldLucky'),
  },
  readWorldRewards: {
    entry: 'src/pages/readWorldRewards/main.js',
    title: '我的奖品',
    chunks: commonChunks.concat('readWorldRewards'),
  },
};
