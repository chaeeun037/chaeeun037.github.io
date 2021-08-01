# OBSERVER PATTERN

> 어떤 객체의 상태가 변할 때 그와 연관된 객체들에게 알림을 보내는 웹 프론트엔드 개발에서 자주 사용되는 디자인 패턴이다.

### Why?

객체지향 프로그래밍에서 생성, 구조, 행동패턴 중 행동 패턴에 해당한다. 일대 다 관계에서 어떤 객체의 상태가 변할 때 의존성을 가진 다른 객체들이 변화를 통지받고 자동으로 갱신될 수 있게 만들기 위해서 사용한다.



FE 에서 개발에서, 어떠한 인터랙션 흐름은 이렇다고 정의하자.

**이벤트 -> 상태변경 -> 화면의변화**

MVC를 어떻게 적용해야할까? Model과 View의 역할이 각각 필요하고, 이들의 의존성은 Controller라는 중간 계층을 만들어서 Model,View사이를 약하게 할 수 있을 수 있다.

하지만 MVC는 Controller가 비대해지는 문제뿐 아니라, 복잡한 모듈간의 관계 매핑이 Controller에 마구 섞여 있어서 프로그램의 흐름이 자연스럽게 드러나지 못한다.

모듈들의 역할이 명확하고, 코드의 의도도 잘 보이면서, 흐름이 매끄러운 상태를 만들 수 있을 지 고민해볼 필요가 있다.

이를 해결하는데, **Observer pattern**은 괜찮은 선택지이다.

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fc1TAMT%2FbtqyRMIENOT%2FmTHk0bRon5hA576NUfS0n0%2Fimg.png" width="400px" />



## Observer pattern 이해

Observer pattern의 목적은 모듈간의 의존성을 낮게 하려는 데 있다. 다시 말해서 결합도를 낮춰준다. 또한 구독자 입장에서 무엇을 구독하는지가 코드에서 자연스럽게 나타난다.

Observer pattern은 '구독' 과 '발행' 개념으로 표현할 수 있다.

실제로 프로그래밍의 모듈을 통해 Observer pattern을 이해해보자.
A,B,C 모듈이 있다고 하자.
A모듈에서는 어떠한 경우에 '데이터추가' 라는 이벤트가 발생한다.
B와 C는 '데이터추가' 이벤트가 발생하면 본인들의 어떤 상태(state)를 변경해줘야 한다. 따라서 B와 C는 '데이터추가' 라는 이벤트를 주시해야 하는 입장이다. 하지만 언제 '데이터추가'이벤트가 발생할지는 모른다. 따라서 B와 C는 '데이터추가' 이벤트를 구독하는 것이 좋은 방법이다.

여기서 주의할 점은, '데이터추가'를 구독하는 것이지 'A의 데이터추가'를 구독하는 것이 아니라는 점이다.
실제로 B와 C의 관심은 누가 발생시킨 이벤트인가?' 가 아니고, '어떤 이벤트가 발생했는가? 이다.



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



## Observer pattern 코드

> Observer pattern을 구현해보자

### 필요한 역할

- **구독 방법**을 포함한다.
- **구독 리스트**를 담아야 한다.
- **이벤트를 발행**하는 방법을 포함한다.

[예시]

```javascript
class Observable {
    constructor() {
        this._observers = new Set();
    }
    subscribe(observer) {
        this._observers.add(observer);
    }
    unsubscribe(observer) {
        this._observers = [...this._observers].filter(subscriber => subscriber !== observer);
    }
    notify(data) {
        this._observers.forEach(observer => observer(data));
    }
}
```

set 자료구조에 구독리스트를 보관했다. 물론 다른 자료구조에 담아도 상관없다.

이벤트를 구독하는 모듈, 즉 구독자(observer)는 **subscribe** 메서드를 통해서 **this._observers** 에 추가된다.
이벤트가 발생하면 **notify** 메서드를 통해서 구독리스트에 있는 내용을 실행(notify)시킨다.

### 활용 예시

> Observable를 활용한 예제를 살펴보자

위에서 정의된 Observable 메서드의 subscribe, notify 메서드를 어떻게 실행할 수 있는지 살펴보자.

```javascript
//observable
const source$ = new Observable();

//구독 (subscribe)
source$.subscribe((data)=> {
  console.log(`movie is ${data}`);
});

//알림 (notify)
document.body.addEventListener("click", () => source$.notify("어벤져스 인피니티워"));
코드복사
```

#### Observable (Subject)

- 상태가 변경될 대상.
- subscribe, unsubscribe, notify 행동을 처리하는 메서드 필요
  (#Observable 이라는 용어는 rxjs 에서도 사용된다)

#### Observer

- 상태 변화를 감지하는 대상
- Observer에 등록할 수 있는 건 함수, 객체 모두 가능.

### 호출관계의 흐름

Observer pattern 은 모듈사이의 관계를 복잡하게 하지 않는다. 이벤트를 중심으로 호출관계의 흐름은 한방향으로 진행된다.

- **unidirectional data flow**이다 . Observable => Observer
- Observer는 얻으려는 데이터를 pull방식이 아니라 push 방식으로 얻을 수 있다. (push 알람)
  - 여러군데에서 호출하지 않고, 등록하고 정보만 받아본다.

![img](https://s3.ap-northeast-2.amazonaws.com/lucas-image.codesquad.kr/1591949940405MVC_6_pub%3Asub%20%2B%20dispatcher%20%E1%84%80%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B7.003.jpeg)

## Observer Pattern 사용

#### M-V 관계에서 Observer 패턴 적용

View는 이벤트를 구독할 수 있지만, 위의 흐름에 따라서 '상태'를 구독할 수 있다.

Model은 발행하고, View는 구독하는 관계임을 알 수 있다. 다시말해 **View**는 **Model**을 구독한다 .

'이벤트' -> **상태변경(Model) -> 화면의변화(View)**

**Model이 Observable이 되고, View가 Observer가 된다.**

------

#### Todo App을 통해 Observer pattern이해하기

View는 여러개 존재할 수 있다. Model도 마찬가지다. 그렇다고 Model에 모든 notify, subscribe 메서드를 구현하는 것은 중복이며, Model의 코드가 지저분해져서 Model 고유한 역할이 잘 드러나지 않을 수 있다.

따라서 Model은 Observable 역할은 하지만, Observable 역할은 **상속을 통해서 담당하게** 할수 있다.

결과적으로 Todo App의 Model의 역할은 다음과 같아야 한다.

- Model이 데이터를 제공하는 입장이라, Observable 역할을 담당.
- Model이 변경될 때 구독자(들)에게 알림을 준다.(notify 메서드 실행)
- 별도의 Observale 객체를 두지 않고, Observable 대상을 찾아, Observable 을 상속.

이를 구현한 TodoModel 일부 코드다.
상속을 했음으로, notify , subscribe, unsubscribe 선언코드는 모두 Observable에 있다.

```javascript
class TodoModel extends Observable{
    constructor(initialUrl) {
        super();
        this.todos = [];
        this.url =  initialUrl;
    }

    addTodo(todo) {
        this.todos = [...this.todos, todo];
        this.notify(this.todos);
    }
    ....
    getInitialData() {
        fetch(this.url)   //data를 가져오는 역할을 Model이 할 수도 있다.
            .then(res => res.json())
            .then(data => this.saveInitTodo(data))
    }
     ....
}
```

View에서는 어떻게 처리할지 고민해보자.

아마도 Model객체를 주입받아서, 구독을 하는등의 적절한 처리를 해줘야 할 것이다.

본인이 진행하는 서비스코드에 이부분을 어디에 적용해야할지 고민해보자.



## Controller 역할이 필요할까?

Observer 패턴과는 별개로 Model과 View를 분리하는 것은 중요하다.
Model 과 View의 관계를 누군가 중재할 수도 있는데, 직접적인 M-V 간의 통신을 막는 데 그 목적이 있다.
따라서 M-C-V 관계가 되어서, 중재자처럼 중간에서 메시지를 받아서 처리하는 등 연결고리 역할을 해준다.
M-V 간의 의존성이 낮아지는 장점이 있다. 반면 복잡한 계층이 하나 더 생기게 된다.
M-V-C 에서도 물론 Observer패턴을 적용하는 것도 가능하다.

![img](https://s3.ap-northeast-2.amazonaws.com/lucas-image.codesquad.kr/1591950927653observer.002.jpeg)

MVC를 실제로 웹FE에서는 잘 사용하지 않지만, Controller역할을 하는 어떠한 것은 많은 프레임워크에서 이미 사용중이다. 그 핵심중에 하나는 M-V간의 관계를 자연스럽게 이어주는 어떠한 역할을 하는 것이다.

따라서 본인이 구현중인 M-V관계에서 중간에 어떤 연결고리 역할이 필요하다면 Controller와 같은 모듈을 만들어서 사용할 수도 있다.

참고로 MVC 구조는 어느 아키텍쳐에서 사용되는가에 따라서 그 역할과 모습이 다르다.
예를들어 Controller가 입력장치를 받는 역할 일수도 있는데, 사용자의 입력을 처리하는 것일 수도 있고, 백엔드에서는 클라이언트의 요청(request)을 받아서 처리하는 것일 수도 있다.
이점을 생각하면 FE에서는 이벤트 핸들로를 주로 Controller에 구현하는 경우도 있을 수 있다.



## 전체 서비스 구조 예시

model과 view를 분리하는 것이 좋다. model은 store라고 지칭하는 경우도 많다.

<img src="https://s3.ap-northeast-2.amazonaws.com/lucas-image.codesquad.kr/1591950082580directory.png" width=300px>

## 주의사항

A B 구독, B C 구독, C A 구독이 된 경우 각각의 구독 관계를 알지 못한다면 의도치 않은 부분까지 변경될 가능성이 있고 예측이 어려워진다.