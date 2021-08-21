# STORED PROCEDURE

### Why?

SQL의 기본 명령은 선언적 명령이다.

데이터베이스에서 절차적 명령을 수행하기 위해서 스토어드 프로그램을 사용해야 한다. 



## Stored Program 종류

* 스토어드 함수
* 스토어드 프로시저
* 트리거
* 이벤트 핸들러



## 장점

데이터베이스에서 로직을 처리하기 때문에 응용 프로그램의 성능이 향상된다.

네트워크 트래픽이 감소한다.

보안성이 향상된다.

개발 업무를 구분할 수 있다. (DBA와 개발자)



## 단점

유지 보수가 매우 어렵다.

Git에서 관리가 쉽지 않다.

문제가 생겼을 때 rollback을 하기가 어렵다.

명령 자체의 성능이 감소될 수 있다.



## 사용되는 곳

게임 분야에서는 많이 사용된다.

웹 분야에서는 점점 사용이 줄어들고 있다.



## Stored Function vs Stroed Procedure

함수는 반환값이 있기 때문에 쿼리 내에서 사용할 수 있다. (프로시저는 불가능)

대신에 함수는 제약 사항이 많다.



## 별찍기

```mysql
drop procedure if exists sp_star;
delimiter $$
create procedure sp_star(in n int)
	begin
		declare i int default 1;
        declare str varchar(100) default "*";
		
        delete from star;
        while i <= n DO
			insert into star (LNO, LINE) values(i, str);
			set str = concat(str, "*");
			set i = i + 1;
		end while;
        
        select * from star order by LNO;
	end $$
delimiter ;

call sp_star(20);
```

