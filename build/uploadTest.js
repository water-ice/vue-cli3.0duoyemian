const request = require('request');
const fs = require('fs');
const read = require('fs-readdir-recursive');
const program = require('commander');

const moduleName = 'activity-vue';

const deployTargets = {
  test4: { host: '192.168.240.88' },
  test5: { host: '192.168.240.89' },
  test13: { host: '192.168.240.90' },
  test30: { host: '192.168.240.91' },
  test110: { host: '192.168.240.149' },
  test188: { host: '192.168.240.233' },
  test193: { host: '192.168.240.239' },
  test311: { host: '192.168.241.131' },
  qatest9: { host: '192.168.240.34' },
  qatest12: { host: '192.168.240.110' },
  qatest18: { host: '192.168.240.132' },
  qatest17: { host: '192.168.240.115' },
  qatest19: { host: '192.168.240.133' },
  qatest14: { host: '192.168.240.112' },
  qatest28: { host: '192.168.240.188' },
  qatest32: { host: '192.168.240.190' },
  qatest39: { host: '192.168.241.29' },
};

program
  .arguments('<cmd>')
  .action((cmd) => {
    const fileList = read('./dist');
    fileList.forEach((item) => {
      const file = item.replace(/\\/g, '/'); // 兼容 windows
      const formData = {
        to: `/home/homework/webroot/plat/${moduleName}/${file}`,
        file: {
          value: fs.createReadStream(`./dist/${file}`),
          options: {
            filename: '',
            contentType: '',
          },
        },
      };
      request.post({ url: `http://${deployTargets[cmd].host}:8020/fisreceiver.php`, formData }, (err, httpResponse, body) => {
        if (err) {
          return console.error('upload failed:', err);
        }
        console.log(`${file} 上传${body === 1 ? '失败' : '成功'}`);
        return true;
      });
    });
  });

program.parse(process.argv);
