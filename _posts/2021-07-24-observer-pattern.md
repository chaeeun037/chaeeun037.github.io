# OBSERVER PATTERN

> 어떤 객체의 상태가 변할 때 그와 연관된 객체들에게 알림을 보내는 디자인패턴이다.

### Why?

객체지향 프로그래밍에서 생성, 구조, 행동패턴 중 행동 패턴에 해당한다. 일대 다 관계에서 어떤 객체의 상태가 변할 때 의존성을 가진 다른 객체들이 변화를 통지받고 자동으로 갱신될 수 있게 만들기 위해서 사용한다.

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fc1TAMT%2FbtqyRMIENOT%2FmTHk0bRon5hA576NUfS0n0%2Fimg.png" width="400px" />



## Subject

observer를 알고있는 주체이다. 감시할 수 있다. observer를 subscribe하거나 unsubscribe하고 notify하는데 필요한 인터페이스를 정의한다.



## Observer

subject에 생긴 변화에 관심이 있는 객체를 update하는데 필요한 인터페이스를 정의한다.

![](https://1.bp.blogspot.com/--sjOmAj8nZ4/WZCh9Dib8sI/AAAAAAAAAi0/5WTaiNK2KywzgB9-KnJtG4zgbZdf141cgCLcBGAs/s1600/Subject.png)

## 장점

* 실시간으로 한 객체의 변경사항을 다른 객체에 전파할 수 있다.
* 느슨한 결합으로 시스템이 유연하고 객체간의 의존성을 제거할 수 있다.

 

## 단점

* 너무 많이 사용하게 되면, 상태 관리가 힘들 수 있다.
* 데이터 배분에 문제가 생기면 큰 문제로 이어질 수 있다.

