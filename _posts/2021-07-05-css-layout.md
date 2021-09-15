---
search: true
comments: true
categories: [Frontend]
---

# CSS LAYOUT

## Why?

화면을 배치하는것을 보통 레이아웃 작업이라고 말한다.

배치하는 방법은 꽤 다양한데, 주요하게 쓰이는 속성을 이해하면서 원하는 대로 배치하는 능력을 길러야 한다.

CSS에서 가장 중요한 부분이 (디자인 요구사항에 맞는 가지런한) 배치작업이다.

------

## 학습 목표

- CSS 레이아웃을 깨닫고, 원하는 위치에 배치할 수 있다.

------

## 배경 지식

#### 강의영상

```video
https://youtu.be/g76_1ET_VXo
```

------

#### 엘리먼트가 배치되는 방식

엘리먼트를 화면에 배치하는 것을 layout 작업이라고도하고,
Rendering과정이라고도 합니다.
편의상 우리는 배치라고 할겁니다.

엘리먼트는 위에서 아래로 순서대로 블럭을 이루며 배치되는 것이 기본입니다.
하지만 웹사이트의 배치는 다양하게 표현 가능해야 하기때문에, 이를 다양한 방식으로 배치할 수 있도록 css에는 추가적인 속성을 제공합니다.

중요하게 이해해야 할 속성은 다음과 같습니다.

- display(block, inline, inline-block)
- position(static, absolute, relative, fixed)
- float(left, right)

이 속성을 중심으로 엘리먼트의 배치를 이해하는 것이 중요합니다.

------

#### 블록으로 쌓이는 엘리먼트 (display:block)

display속성이 block이거나 inline-block인 경우 그 엘리먼트는 벽돌을 쌓든 블록을 가지고 쌓임.

```html
<div>block1</div>
<p>block2</p>
<div>block3</div>
코드복사
```

이렇게 구현한 코드는 화면에 위에서 아래로 쌓이듯이 채워집니다.
높이값을 더 주면 더 높은 크기로 엘리먼트가 쌓입니다.

------

#### 옆으로 흐르는 엘리먼트 (display:inline)

display속성이 inline인 경우는 우측으로, 그리고 아래쪽으로 빈자리를 차지하며 흐릅니다.
참고로, inline속성의 엘리먼트는 높이와 넓이를 지정해도 반영이 되지 않습니다.

```html
<div>
  <span>나는 어떻게 배치되나요?</span>
  <span>좌우로 배치되는군요</span>
  <a>링크는요?</a>
  <strong>링크도 강조도 모두 좌우로 흐르는군요</strong>
</div>
코드복사
```

> code: http://jsbin.com/wacukuf/edit?html,output

------

#### 좀 다르게 배치시키기 (position속성)

엘리먼트 배치가 순서대로만 위아래로 또는 좌우로 흐르면서 쌓이기만 하면, 다양한 배치를 하기 어렵습니다.
position속성을 사용면 상대적/절대적으로 어떤 위치에 엘리먼트를 배치하는 것이 수월합니다.

1. position속성으로 특별한 배치를 할 수도 있습니다.
   position속성은 기본 static이다. 그냥 순서대로 배치됩니다.
2. absolute는 기준점에 따라서 특별한 위치에 위치합니다.
   top/left/right/bottom으로 설정합니다.
   기준점을 상위엘리먼트로 단계적으로 찾아가는데 static이 아닌 position이 기준점입니다.
   absolute속성을 가진 엘리먼트는 배치흐름(normal flow라고 함)에서 제외됨으로, 아래 다른 엘리먼트가 그 공간을 차지할 수 있습니다.
3. relative는 원래 자신이 위치해야 할 곳을 기준으로 이동합니다.
   top/left/right/bottom로 설정합니다.
   relative속성을 가진 엘리먼트는 배치흐름(normal flow라고 함)에서 계속 포함됨으로, 아래 다른 엘리먼트가 그 공간을 차지할 수 없습니다.
4. fixed는 viewport(전체화면)좌측,맨위를 기준으로 동작합니다.

> code : http://jsbin.com/vegowut/edit?html,css,output

------

#### 간격을 다르게해서 배치하기 (margin:10px)

margin으로 배치가 달라질 수 있다. margin은 위/아래/좌/우 엘리먼트와 본인간의
간격이다. 따라서 그 간격만큼 내 위치가 달라집니다.

------

#### 강의영상2

```video
https://youtu.be/jw5zPa3bk_o
```

#### 기본 배치에서 벗어나서 떠있기 (float:left)

float 속성으로 원래 flow에서 벗어날 수 있고 둥둥 떠다닐 수 있습니다.
일반적인 배치에 따라서 배치된 상태에서 float는 벗어난 형태로 특별히 배치됩니다. 따라서
뒤에 block엘리먼트가 float된 엘리먼트를 의식하지 못하고 중첩되서 배치됩니다.

> code : http://jsbin.com/cutivij/2/edit?html,css,output

float의 속성은 이런 독특함 때문에 웹사이트 레이아웃 배치에서 유용하게 활용됩니다.

------

#### 하나의 블록엘리먼트는 box형태임. (box-model)

블록엘리먼트의 경우 box의 크기와 간격에 관한 속성으로 배치를 추가 결정합니다.
margin, padding, border, outline으로 생성되는 것입니다.

> code : https://www.w3schools.com/css/css_boxmodel.asp

box-shadow속성도 box-model에 포함지어 설명할 수 있습니다.
box-shadow는 border 밖에 테두리를 그릴 수 있는 속성입니다.

------

#### 엘리먼트의 크기는 부모의 크기가 기본.

block엘리먼트의 크기는 기본적으로는 부모의 크기만큼을 가집니다.
예를들어 width:100%는 부모의 크기만큼을 다 갖는 것과 같습니다.

------

#### box-sizing과 padding

padding속성을 늘리면 엘리먼트의 크기가 달라질 수 있습니다.
box-sizing속성으로 이를 컨트롤 할 수 있다. box-sizing속성을 border-box로 설정하면
엘리먼트의 크기를 고정하면서 padding값만 늘릴 수 있습니다.

> code : http://jsbin.com/wosuwop/edit?html,css,output

------

#### 그래서, layout 구현 방법은?

- 전체 레이아웃은 float를 잘 사용해서 2단, 3단 컬럼 배치를 구현합니다. 최근에는 css-grid나 **flex속성**등 layout을 위한 속성을 사용하기 시작했으며 브라우저 지원범위를 확인해서 사용하도록 합니다.
- 특별한 위치에 배치하기 위해서는 position absolute를 사용하고, 기준점을 relative로 설정합니다.
- 네비게이션과 같은 엘리먼트는 block 엘리먼트를 inline-block으로 변경해서 가로로 배치하기도 합니다.
- 엘리먼트안의 텍스트의 간격과, 다른엘리먼트간의 간격은 padding과 margin속성을 잘 활용해서 위치시킵니다.

------

## 정리

레이아웃의 방법은 여러가지가 있다. 어떤 방법을 선택할지 고민하는 습관을 들이자.
가급적 최신의 방법을 사용해서 직관적인 레이아웃 코드를 만들어서 유지보수하는 것이 좋다.
다만 브라우저 호환성 이슈가 없는지도 검토가 필요하다.