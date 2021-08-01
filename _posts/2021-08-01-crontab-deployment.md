# CRONTAB DEPLOYMENT

### Why?

cron은 리눅스 스케줄러이다. crontab은 cron 설정을 위한 옵션이고, 이를 이용하면 자동 배포를 할 수 있다.

## crontab 기본

### 크론탭 설정하기

```shell
$ crontab -e
```

각종 크론탭 명령어를 입력후 크론탭을 갱신시킵시다.

### 크론탭 설정 내용 보기

```shell
$ crontab -l
```

### 크론탭 삭제

```shell
$ crontab -r
```

## 주기 결정

```sh
*　　　　　　	*　　　　　　	*					*					*
분(0-59)　　시(0-23)　　일(1-31)		월(1-12)	 요일(0-7)
```

각 별 위치에 따라 주기를 다르게 설정 할 수 있다. 괄호 안의 숫자 범위 내로 별 대신 입력 할 수 있다. 

요일에서 0과 7은 일요일이다. 1부터 월요일이고 6이 토요일이다.

[예시]

```shell
# 매 분 실행
* * * * * ls -al

# 특정 시간 실행
# 매주 금요일 오전 5시 45분에 test.sh 를 실행
45 5 * * 5 /home/script/test.sh

# 반복 실행
# 매일 매시간 0분, 20분, 40분에 test.sh 를 실행
0,20,40 * * * * /home/script/test.sh

# 간격 실행
# 매 10분마다 test.sh 를 실행
*/10 * * * * /home/script/test.sh
```

## 크론 로깅

```sh
* * * * * /home/script/test.sh > /home/script/test.sh.log 2>&1
```

## 적용

> ec2 서버에서 자동 배포를 해볼 것이다. 
>
> 배포는 5분 간격으로 실행된다. 커밋 해시값이 다를때만 진행한다.

### crontab 등록

```sh
crontab -e

*/5 * * * * /home/ubuntu/deploy.sh >> /home/ubuntu/deploy.sh.log 2>&1
```

### shell script 작성

```sh
#!/bin/bash
echo '---cron 실행---'
cd /home/ubuntu/cashbook-8
git pull

lastCommit=$(cat /home/ubuntu/last-commit.info)
current=$(git rev-parse main)

if [[ $current != $lastCommit ]];
then
  echo '---변경된 커밋에 대한 배포 진행---'
  echo '---frontend build---'
  cd ./frontend
  yarn install
  yarn run build

  echo '---backend build---'
  cd ../backend
  yarn install
  yarn run build

  echo '---pm2 reload account---'
  pm2 reload ./dist/server.js
  
  # 라스트 커밋 해시값 업데이트
  echo '---update lastCommit.info---'
  echo $current > /home/ubuntu/last-commit.info
fi
```

