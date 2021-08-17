# REACT COMPONENT

## React Components 특징

- React는 컴포넌트 주도 개발방식을 따른다.
- View를 의미적으로 구분해서, 각각 독립적인 컴포넌트로 만든다.
- 계층을 이루며 UI 요소별로 여러개의 컴포넌트 단위로 구성된다.
- 컴포넌트 개발하는 단계에서 계속 리팩토링 과정을 거쳐야 한다.

![img](https://cdn.rawgit.com/westeezy/ReactJS-Bootcamp/master/walkthroughs/slides/day2/img/react_component_hierarchy.png)

- Classes 표현방법에서 Function방식으로 개발하도록 변화 중이다.(2019 Hooks API)
- Classes 방식을 먼저 공부하고 개발 단계에서는 Hooks API를 사용하는 것이 적절하다.
- HTML을 구현하듯 rendering 처리를 할 수 있다.
- 직관적으로 Event를 등록할 수 있다.

[예시]

```jsx
import "./styles.css";
import React, { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```



## lifecycle

컴포넌트가 실행되는 동안 다양한 메서드를 제공하는데, 이것을 lifecycle hook이라고 한다.

lifecycle 은 Class 방식의 컴포넌트를 개발할때 알아야할 지식으로, 앞으로는 점점 몰라도 되는 지식이 될 것으로, 참고사항이다.
![img](https://cdn-images-1.medium.com/max/800/1*_drMYY_IEgboMS4RhvC-lQ.png)
**constructor -> comonentWillMount -> render -> comonentDidMount**



아래 메서드는 이제 deprecated될 예정이다.

- componentWillMount
- componentWillRecieveProps
- componentWillUpdate