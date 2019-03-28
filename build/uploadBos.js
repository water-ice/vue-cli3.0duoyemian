const { BosClient } = require('bce-sdk-js');
const glob = require('glob');
const { keyPrefix } = require('./config');

const config = {
  // https://cdnjtzy.bj.bcebos.com/plat/activity
  endpoint: 'https://cdnjtzy.bj.bcebos.com',
  credentials: {
    ak: '4fb4ca4e87644023a6405cf10f547a76',
    sk: '43275fa4163f436bb9db543a02978bdd',
  },
};
const client = new BosClient(config);

const bucket = ''; // bucket需要设为空

const upload = (() => {
  const uploadFile = (item) => {
    const { file, key } = item;
    return client
      .putObjectFromFile(bucket, key, file)
      .then(() => {
        console.log(`${file}上传成功`);
      })
      .catch((error) => {
        console.log(`${file}上传失败`);
        console.error(error);
      });
  };
  return (files) => {
    files
      .map(e => ({ file: e, key: e.replace('./dist', keyPrefix) }))
      .forEach((e) => {
        uploadFile(e);
      });
  };
})();

// 匹配 dist 里 所有非 html 文件
const files = glob.sync('./dist/**/*.*', {
  ignore: ['./**/*.html', './dist/workbox-v3.6.3'],
});
if (files.length) {
  upload(files);
} else {
  console.error('[error] 请先运行 npm run build');
}
