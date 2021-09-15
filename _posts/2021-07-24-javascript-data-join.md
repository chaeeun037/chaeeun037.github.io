---
search: true
comments: true
categories: [Backend]
---

# JAVASCRIPT DATA JOIN

> sql join문 없이 javascript 로직만으로 join해본 삽질기를 소개하는 글이다.

### Why?

정규화를 잘해서 9개로 쪼개져버린 테이블을 다시 sql join을 이용해서 7개의 테이블에서 데이터를 찾아와야 한다는 생각에 온몸에 소름이 끼쳤다.

두툼한 join문을 쓰지 않고 데이터를 가져올 수는 없을까?



## 조건

n+1 문제가 발생하지 않아야 한다.

로직의 흐름이 자연스러워야 한다.

디버깅이 편해야 한다.



## 있다!

각각 테이블 가져와서 key값이 되는 column에 매핑해버리기!



## 알고리즘

1. 기준이 되는 table을 조회한다. (product)
2. 조회한 데이터에서 다른 table과 join할 때 필요한 애트리뷰트(여러개)로 튜플들을 중복 제거하여 뽑아온다.
3. join할 테이블을 각각 조회한다.
4. (reduce를 통해서) 애트리뷰트를 key로 하고 기준이 되는 데이터(product)를 value로 하는 map을 만든다.
5. 3번에서 가져온 데이터들을 기준이 되는 table에 join할때 필요한 애트리뷰트로 매핑한다.



## 개선사항, 느낀점

반복되는 코드 줄이기, 모듈화

