# ASYNCHRONOUS PROGRAMMING

### Why?

싱글 스레드로 동작하는 javscript의 한계를 해결하는 방법이므로 비동기 프로그래밍을 이해하는 것은 매우 중요하다.

DB나 file에 접근하거나 네트워크 통신을 하는 등의 경우에 비동기 처리를 통해서 blocking하지 않고 효과적으로 처리할 수 있다. 



## callstack & callback queue

![](https://cdn-images-1.medium.com/max/1600/1*FA9NGxNB6-v1oI2qGEtlRQ.png)

### call stack

### Web APIs

### callback queue

### event loop

> call stack이 비어있으면 callback queue의 callback함수가 stack으로 올린다.



### [Event Queue와 call stack의 관계](https://www.youtube.com/watch?v=8aGhZQkoFbQ)



### 순서 예상해보기

```javascript
const baseData = [1,2,3,4,5,6,100];

const asyncRun = (arr, fn) => {
   arr.forEach((v,i) => {
     setTimeout(() => {
       setTimeout(() => {
         console.log("cb 2");
         fn(i)
        },1000);
       console.log("cb 1");
     }, 1000);
   });
}

asyncRun(baseData, idx =>console.log(idx))
```