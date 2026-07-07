---
search: true
comments: true
categories: [Frontend]
---

# CLIENT STATE MANAGEMENT

### Why?

SPAs구조에서는 다양한 화면 렌더링이 필요하다.

화면 렌더링은 다양한 state 변경에 의해서 발생한다.

다수의 state가 있고, state는 변경 가능하며, 서버와 동기화되어야 한다.

![img](https://www.esparkinfo.com/wp-content/uploads/2020/07/Single-Page-Application.jpg)



## 부분적인 상태 변경

> 하나의 컴포넌트 안에서 상태를 변경한다.

지역변수의 변경과 비슷하다.

<img src="https://www.techdiagonal.com/wp-content/uploads/2019/09/react-props-blog-image-design-2.jpg" alt="react component state" width="600px">

**[예제]**

```react
const [data, setData] = useState("");
```



## 컴포넌트 간 state 공유

> 상태를 다른 컴포넌트에 공유한다.

### 자식에게 전달

props로 전달하고, 자식 컴포넌트는 이를 통해서 필요한 상태를 받아서 렌더링한다.



### 자식이 아닌 다른 node 계층에 전달

상위 컴포넌트에 state를 만들어서 컴포넌트간의 공유가 되도록 한다.

공통의 부모 영역에 state를 만들고, 각각 state를 내려받아서 활용할 수 있다.

<img src="https://user.oc-static.com/upload/2021/05/06/16202866148021_P3C3-2.png" alt="state share" width="600px">

### 단점

#### Props drilling

해당 state가 필요하지 않는 중간 영역 컴포넌트에도 props로 전달해 주어야 해서 복잡성이 커지고 불필요한 동작이 생기는 문제가 있다.



#### 해결 방법

flux 기반의 상태 관리 라이브러리를 통해 해결할 수 있다.



## 상태 관리 디자인

### 구성

> 기획서의 인터랙션을 확인한다. (사용자 시나리오 기반)

#### Events

> 이벤트를 정의 (Events)

- Click , mousedown, setTimeout, fetch의 onload 등의 이벤트

#### Actions

> 액션(행동)을 정의 (Actions)

- 'addData', "ADD_DATA" 등의 명확한 메시지형태.
- actions을 함수로 만들어서 사용할 수도 있음

```javascript
const addData = (payload) => {"type":"ADD_DATA", payload}
fire(addData("lorem"));
코드복사
```

#### States

> 상태를 정의 (States)

- UI변경에 영향을 미치게 되는 상태.
- 값일 수도 있고, 객체 형태일 수도 있음.(유사한 상태를 묶어두기)
- 컴포넌트 내부에 필요한 상태는 그 안에서 정의.

#### Transitions

> 상태 변경 과정을 디자인 (Transitions)

- reducer 와 같은 형태로 별도의 상태 변경 과정을 표현.
- immutable 방식으로 새로운 상태를 만들 수도 있음.
- testable 코드인지 확인하면 좋다.



## State Machine

> 상태 관리의 기반이 되는 개념으로 Automata 이론으로 설계되었다.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/DFA-powerset-construction-example.svg/600px-DFA-powerset-construction-example.svg.png" alt="state machine" width=400px />

- finite state machine(FSM) 기반으로 동작한다.
- 상태를 event => action => transition 흐름으로 제어한다.
- Statecharts 형태로 데이터를 정의한다. 
  - JSON포맷을 지원한다.

```json
{
  id: "toggle",
  initial: "inactive",
  context: {
    count: 0
  },
  states: {
    inactive: {
      on: { TOGGLE: "active" }
    },
    active: {
      entry: assign({ count: (ctx) => ctx.count + 1 }),
      on: { TOGGLE: "inactive" }
    }
  }
```

