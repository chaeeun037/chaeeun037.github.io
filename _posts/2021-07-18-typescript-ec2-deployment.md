---
search: true
comments: true
categories: [DevOps]
---

# TYPESCRIPT EC2 DEPLOYMENT

> typescript 배포 삽질기

1. node.js 16.x 버전 설치

   * curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

   * sudo apt-get install -y nodejs
2. git clone

   * git clone https://github.com/woowa-techcamp-2021/deal-17
3. npm install → 에러
4. sudo npm install → 서버가 뻗었다...!
5. sudo apt install build-essential sudo npm install -g node-gyp sudo apt install python-dev
6. 해결 1) `sudo npm uninstall -g npm-check-updates`
7. 해결 2) `sudo npm install -g npm-check-updates`
8. npm install
9. mysql 설치



sesrver 실행할때 뻗는다..

default로 힙사이즈 강제로 넓히기

![img](cid:D27E7262-7741-4ECD-806E-F22AF6FA6D0D)

