# REPAINT & REFLOW

> 브라우저가 렌더링 된 후에 HTML, CSS가 업데이트 되면 repain와 reflow가 발생한다.

## Reflow

생성된 DOM 요소의 레이아웃 수치가 변경됐을 때 영향을 받은 모든 요소의 수치를 다시 계산해서 render tree를 재생성하는 과정이다.

reflow는 문서 내의 요소들의 layout, position을 다시 계산해서 뿌려주기 때문에 repaint보다 심각한 성능 저하를 유발한다. 



**대표적인 속성**

| position    | left     | top         | right       | bottom         |
| ----------- | -------- | ----------- | ----------- | -------------- |
| width       | height   | margin      | padding     | border         |
| display     | float    | font-family | font-size   | font-weight    |
| line-height | overflow | text-align  | white-space | vertical-align |
| clear       | ...      |             |             |                |



## Repaint(redraw)

repaint는 스타일 변경이 일어났을 때 DOM 요소를 다시 그리거나, reflow 과정이 끝난 후에 재생성된 renter tree를 다시 그리는 과정이다. 



**대표적인 속성**

| background    | background-image | background-position | background-repeat | background-size |
| ------------- | ---------------- | ------------------- | ----------------- | --------------- |
| Border-radius | Border-style     | box-shadow          | color             | line-style      |
| outline       | outline-color    | outline-style       | outline-width     | text-decoration |
| visibility    | ...              |                     |                   |                 |



## 최적화 방법

#### 1. 사용하지 않는 노드에는 visibilty: invisible 보다 display: none을 사용하기

visibility invisible은 레이아웃 공간을 차지하기 때문에 reflow의 대상이 된다. 

display none은 Layout 공간을 차지하지 않아 Render Tree에서 제외된다.

####  2. Reflow, Repaint 가 발생하는 속성 사용 피하기

Reflow가 일어나면 Repaint는 필연적으로 일어나야 하기 때문에 가능하다면 Reflow가 발생하는 속성보다 Repaint 만 발생하는 속성을 사용하는것이 좋다. 

Reflow Repaint가 일어나지 않는 transform, opacitiy와 같은 속성도 있다. 따라서 left, right, width, height 보다 transform을, visibility/display 보다 opacitiy를 사용하는 것이 성능 개선에 도움이 된다. 

#### 3. 영향을 주는 노드 줄이기

Javascript + Css를 조합하여 애니메이션이 많거나 레이아웃 변화가 많은 요소의 경우 position을 absolute 또는 fixed를 사용하여 영향을 받는 주변 노드들을 줄일 수 있다. fixed와 같이 영향을 받는 노드가 전혀 없는 경우 reflow과정이 전혀 필요가 없어지기 때문에 Repaint 연산비용만 들게 된다. 

또다른 방법은 애니메이션 시작시 요소를 absolute, fixed로 변경 후 애니메이션이 종료되었을 때 원상복구 하는 방법도 Reflow, Repaint 연산을 줄이는데 도움이 된다.

#### 4. 프레임 줄이기

단순히 생각하면 0.1초에 1px씩 이동하는 요소보다 3px씩 이동하는 요소가 Reflow, Repaint 연산비용이 3배가 줄어든다고 볼 수 있다. 따라서 부드러운 효과를 조금 줄여 성능을 개선할 수 있다.