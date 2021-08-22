# ELASTIC SEARCH

> 검색에 최적화된 데이터베이스로, 관계형 데이터베이스보다 빠르다.

### Why?

방대한 데이터를 빠르게 검색하기 위해서 사용한다.

프로젝트를 진행 하다보면 DB 설계를 하고 개발에 들어가며 처음에는 큰 문제없이 잘 작동하다 많은 사람들이 사용하게 됨에 따라 서버 성능 , DB 설계의 문제나 혹은 DB 최적화가 되어있지 않아 서비스가 느려지는 현상을 경험하게 되고 그 결과 관계형 데이터 베이스에 최적화를 위해 인덱싱을 하게 되고 이 점은 굉장히 중요한 작업이며 어떻게 인덱싱을 하냐에 따라 퍼포먼스가 다른 것을 경험한 적이 있을 것이다. 

엘라스틱 서치 역시 데이터에 다양한 규칙으로 최적화된 인덱싱을 처리 할 수 있어서 검색에 빠른 성능을 보이는 것이다.



## 장점

오픈소스로 무료로 사용 가능하고, 버그에 빠르게 대응한다.

방대한 양의 데이터를 신속하게 처리가 가능하다.



## 단점

진입장벽이 있다.

Document간의 조인을 수행할 수 없다. (여러번의 쿼리로 해결은 가능하지만 좋은 서비스는 아닐 것이다.)

트랜잭션이 제공되지 않는다.



## 데이터 저장 구조

관계형 데이터베이스는 document 중심이라면, elastic search는 텍스트 중심이다.

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FTFRXc%2FbtqDrkgj2oq%2FU7IL7iqjbp5yMqJtC6BFb0%2Fimg.jpg" alt="엘라스틱 서치와 관계형 DB 구조" width="800px">

유저가 영화감독 봉준호를 검색하는 순간 관계형 데이터는 doc1~ doc3을 하나하나 확인하며 봉준호의 영화 데이터 위치를 찾지만 Elastic search 는 검색하는 순간 데이터를 찾을 수 있다.

관계형 데이터는 말 그대로 관계된 데이터(테이블)를 조합하여 볼 수 있으며 , 데이터의 ACID 원칙에 의해 관리되는 목적이 있다. 엘라스틱서치는 데이터를 다른 table과 조합할 수 없으며 데이터 트렌젝션을 지원하지 않는다. 이러한 점에서 볼 때 엘라스틱서치만으로 서비스를 개발하기에는 무리가 있어 보인다.

가장 좋은 것은 관계형 DB를 베이스로 하고 검색에 필요한 부분만을 엘라스틱서치로 진행하는 것이다.



## Elastic Search 구조

> 사용자의 요청에 따라 디비에 저장되고(RDBMS or NON-RDBMS) 검색 혹은 분석이 필요한 부분만을 데이터를 추출하여 엘라스틱 서치에 자동 저장시켜서 방대한 양의 데이터를 빠르고 다양하게 검색될 수 있도록 처리하게 된다.



<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbzH3cK%2FbtqDsbKbBsO%2FuVxKMbqk1qxK8gmrfnIYNk%2Fimg.png" alt="엘라스틱서치 아키텍처">



## logstash

> 디비에서 필요한 데이터를 추출하여 자동적으로 엘라스틱에 데이터를 넣는 부분을 담당하는 대표적인 라이브러리이다.

![logstash flow](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbL8vaC%2FbtqDsake2b0%2FNFAFusRun8IOy5xKLG5sWK%2Fimg.png)