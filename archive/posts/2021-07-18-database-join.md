---
search: true
comments: true
categories: [Database]
---

# DATABASE JOIN

### Why?

정규화가 진행된 테이블에서 원하는 결과를 다시 도출하기 위해 여러 테이블을 조합하는 연산을 진행한다.



## LEFT JOIN

실무에서 많이 볼 수 있는 형태이다.

주로 보고싶은 테이블을 왼쪽에 두고, 추가적인 정보를 더하기 위한 JOIN이다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbOpvgy%2FbtqHQGLNhCP%2FpKTJ06O1GLFb0TKqtrylTK%2Fimg.png)

~~~sql
SELECT * FROM 고객 A 
LEFT JOIN 주문 B
ON A.ID = B.ID_USER
~~~



## INNER JOIN

두 테이블에서 모두 해당하는 경우를 도출할 때 사용한다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FWTcZ1%2FbtqHBRVVHpP%2F38ykWZFyVwOs6pUuuMFgZK%2Fimg.png)

~~~sql
SELECT * FROM 인스타그램 A
INNER JOIN 페이스북 B
ON A.ID_SEQ = B.ID_SEQ
~~~

