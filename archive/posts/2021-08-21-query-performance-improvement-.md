---
search: true
comments: true
categories: [Database]
---

# QUERY PERFORMANCE IMPROVEMENT

### Why?

쿼리의 성능을 향상시키기 위함이다.



## 일단 돌아가는 쿼리 만들기

모델 / 콘트롤러 등에서 필요한 데이터를 가져오기 위해 DB 쿼리 실행

하나의 쿼리가 빠르게 실행될 수 있다면 최고지만 어렵다면 복잡하고 긴 쿼리 작성하거나 짧은 여러 개의 쿼리의 조합으로 로직 구현한다.

인덱스를 적극적으로 사용해 보자.



## 성능 검증

* 단일 쿼리 성능 분석

* 유닛 테스트를 통한 성능 분석

* 충분한 사용자와 데이터가 갖춰진 상황에서 통합 테스트를 통한 성능 분석

이후에 원하는 성능이 나오지 않는다면 쿼리 튜닝이 필요하다.



## 쿼리 튜닝 전 해볼 것들

* 커넥션 수 조정

* 네트워크 상태 확인
* 서버 모니터링 / DBMS 모니터링 도구 사용
* 하드웨어 수직 확장



## 원인 분석

MySQL에서 쿼리 플랜을 보려면 [EXPLAIN](https://dev.mysql.com/doc/refman/5.7/en/usingexplain.html )명령을 사용한다.  이전에는 SELECT 문장에만 사용할 수 있었는데, 지금은 여러 문에서 사용 가능하다. 

‘\G’ 를 사용하면 더 보기 좋게 나온다. 

```mysql
mysql> EXPLAIN SELECT … \G 
```

결과는 하나 이상의 레코드 한 행이 하나의 동작이고 대체로 위에서 아래로 실행된다. 



## 분석 결과

> index를 타지 않고 full scan하기 때문에 가능하면 지양해야 한다.

### ID

SELECT당 하나씩 부여된다.

````mysql
mysql> EXPLAIN SELECT * FROM USER; 
mysql> EXPLAIN SELECT * FROM USER JOIN TRADE ON USER.ID = TRADE.SELLER; 
mysql> EXPLAIN SELECT * FROM (SELECT COUNT(*) FROM USER UNION SELECT COUNT(*) FROM TRADE ) AS  T;
````



### SELECT_TYPE 

SIMPLE, PRIMARY : 가장 바깥 쿼리 

SUBQUERY : 일반 서브쿼리 

```mysql
mysql> EXPLAIN SELECT * FROM USER WHERE ID IN (SELECT SELLER FROM TRADE GROUP BY SELLER HAVING COUNT(*) > 3); 
```

DERIVED : FROM절의 서브 쿼리

```mysql
mysql> EXPLAIN SELECT * FROM ( SELECT * FROM user u) as u2; 
```

DEPENDANT SUBQUERY : 바깥 테이블과 연관된 서브 쿼리

```mysql
mysql> EXPLAIN SELECT * FROM user u WHERE money > ANY ( SELECT price FROM trade t WHERE u.id = t.seller ); 
```



### TABLE 

테이블의 이름 또는 종류(쿼리 플랜의 ID)



### TYPE 

실제 데이터를 읽는 방법이다.

SYSTEM, CONST, REF, RANGE, INDEX, ALL 등이 있음 SYSTEM이 가장 빠르고 ALL 이 가장 느리다. INDEX는 INDEX FULL SCAN, 빠르지 않다. ALL 사용을 지양해야 한다.

```mysql
mysql> EXPLAIN SELECT * FROM USER WHERE LAST_VISIT > '2014-06-10'; 
mysql> CREATE INDEX TEST_IDX ON USER(LAST_VISIT); 
mysql> EXPLAIN SELECT * FROM USER WHERE LAST_VISIT > '2014-06-1'; 
```



### POSSIBLE KEYS 

쓸모없는 컬럼, 가볍게 무시하자! 



### KEY 

실제 데이터를 읽기 위해 사용되는 인덱스의 이름이다.

필요에 의해 생성한 인덱스가 잘 사용되는지 확인한다.

```mysql
mysql> DROP INDEX TEST_IDX ON USER; 
mysql> CREATE INDEX POPI ON USER(LAST_VISIT,MONEY); 
mysql> EXPLAIN SELECT * FROM USER WHERE LAST_VISIT > '2014-06-01'; 
mysqL> EXPLAIN SELECT * FROM USER WHERE LAST_VISIT = '2014-06-01' AND MONEY > 1000; 
mysql> EXPLAIN SELECT * FROM USER WHERE MONEY < 5000; 
```



### KEY_LEN 

인덱스 중 사용할 수 있는 크기를 나타낸다. 복합 인덱스에서 매우 중요하다. 



### ROWS 

예상 레코드 개수, 이를 위해 통계정보를 저장한다.



### EXTRA

중요한 정보가 저장된다.



## 요약

1. 쿼리가 원하는 성능이 안 나올 경우 튜닝을 실시한다.
2. explain명령으로 원인 분석(쿼리 플랜 분석)을 한다.
3. select type은 dependant subquery, derived가 나오지 않게 한다.
4. 되도록 쿼리 플랜의 type이 all 이 나오지 않도록 한다.

