#!/bin/bash
MOD_NAME="activity-vue"
TAR="$MOD_NAME.tar.gz"

username=`whoami`
source /home/${username}/.bash_profile

#rm -rf node_modules
rm -rf output

npm set registry http://ued.zuoyebang.cc/npm/

if [ $1 ]; then  # 线上环境
rm -rf ./webroot/plat
npm install
mkdir -p ./webroot/plat/${MOD_NAME}

npm run build
npm run upload:bos # 静态资源上传 BOS
mv -f dist/*.html ./webroot/plat/${MOD_NAME}
mv -f dist/service-worker.js ./webroot/plat/${MOD_NAME}
else   # 测试环境

rm -rf ./webroot/plat
npm install
mkdir -p ./webroot/plat/${MOD_NAME}

npm run build:staging
mv -f dist/* ./webroot/plat/${MOD_NAME}
fi

# 整理目录结构
rm -rf ./dist

# 进行打包
tar zcf $TAR ./webroot/*

mkdir output

mv $TAR output/

echo "build end"
