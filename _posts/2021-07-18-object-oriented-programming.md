# OBJECT ORIENTED PROGRAMMING

> 실세계에 있는 객체를 추상화를 통해 프로그래밍에 접목하려는 패러다임이다.

### Why?

유연하고 유지보수가 쉬우며 확장성 측면에서 유리하다. 대규모 소프트웨어 개발에 널리 사용되고 있다.

객체 내부의 응집력을 높이고 외부 객체들과의 결합력을 낮추는 방향을 지향한다.



## SOLID

**Single responsibility principle**

하나의 클래스는 하나의 역할만 해야 한다. 

**Open/closed principle**

클래스는 확장에는 열려있고, 수정에는 닫혀있어야 한다. 

**Liskov substitution principle**

자식 타입의 객체로 부모 타입을 대신할 수 있다. 

**Interface segregation principle**

인터페이스가 잘 분리되어서 사용하지 않는 메소드에 의존하지 않아야 한다. 

**Dependency inversion principle**

상위 모듈과 하위 모듈 모두 추상화에만 의존해야 한다. 상위 모듈은 하위 모듈에 의존해서는 안 된다. 



## 객체 생성 방법

1. literal
2. new 생성자 함수
3. Object.create()



## {} Obejct literal

#### 장점

간단하게 작성할 수 있다.

#### 단점

외부에서 내부 속성에 접근할 수 있어 객체의 기능을 임의로 조작할 수 있다.

### 캡슐화

> 실제 구현을 외부에 드러나지 않도록 하는 것이다.

즉시 실행 함수로 객체를 반환하여 노출시키지 않을 데이터를 변수에 담아 scope로 묶어놓고 사용할 수 있다.

[예시]

```js
const headphone = (function () {
  let volume = 0;	// 캡슐화 대상
  
  return {
    volumeUp: function() {
      if (volume < 10) {
        volume++;
      }
    },
    volumeDown: function () {
      if (volume > 0) {
        volume--;
      }
    }
  };
})();
```



## new 생성자 함수

> 객체의 인스턴스를 생성한다.

### 상속

> 자식이 부모 클래스의 특성과 기능을 물려받는 것이다.

캡슐화 없이 생성자 함수를 사용하여 인스턴스를 대량 생산해서 사용할 수 있다.

[예시]

```js
function Headphone() {
  this.volume = 0;
  
  Headphone.prototype.volumeUp = function () {
    if (this.volume < 10) {
      this.volume++;
    }
  }
  
  Headphone.prototype.volumeDown = function () {
    if (this.volume > 0) {
      this.volume--;
    }
  }
}

const headphoneA = new Headphone();

const headphoneB = new Headphone();
```



### Factory 함수

> 생성자 함수가 아니지만 객체를 반환하는 함수이다.

캡슐화와 대량 생산 모두 가능하다.

[예시]

```js
function factoryHeadphone () {
  let volumne = 0;
  
  return {
    volumeUp: function () {
      if (volume < 10) {
        volume++;
      }
    },
    volumeDown: function () {
      if (volume > 0) {
        volume--;
      }
    }
  };
}
const headphoneA = factoryHeadphone();

const headphoneB = factoryHeadphone();
```



## Object.create()

> 인자로 받는 객체를 prototype으로 하는 객체를 생성한다.

### 상속

고전적인 방법이다. 객체 생성으로 인해 끊어진 constructor를 다시 연결해주어야 상위 메소드와 본인이 가지고있는 메소드를 모두 사용할 수 있다.

[예시] 재연결

```js
Headphone.prototype = Object.create(Audio.prototype); // prototype 연결
Headphone.prototype.constructor = Headphone; // constructor 재연결
```



#### 장점

중복 코드를 줄이며 프로토타입 체인으로 메소드를 상속 가능하다.

#### 단점

코드가 길어진다. 하위 생성자의 경우 상위 생성자와 체인 연결하면 기존의 메소드들이 사라진다.



### ES6 class

> 상속의 개념으로 기존의 문제를 해결하고 다른 언어에서 사용하는 class를 도입했다.

// TODO: ES6 class 따로 포스팅 하기!!!

[예시]

```js
class Headphone extends Audio {
  constructor(props) {
    super(props);
    
    this.noiseCancelling = false;
  }
  
  setNoiseCancelling = function () {
    this.noiseCancelling = !this.noiseCancelling;
  }
}

class AirPod extends Audio {
  constructor(props) {
    super(props);
    
    this.pairingConnected = false;
  }
  
  pairingConnect = function () {
    this.pairingConnected = !this.pairingConnected;
  }
}
```

