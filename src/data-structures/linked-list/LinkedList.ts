namespace LinkedList {
  interface LinkedList {
    prepend(value: number): this;
    append(value: number): this;
    insert(value: number, rawIndex: number): this;
    delete(value: number): Node | null;
    deleteHead(): Node | null;
    deletedTail(): Node | null;
    find(value?: number): Node | null;
    reverse(): this;
  }

  type Node = {
    readonly value: number;
    next: Node | null;
  };

  class LinkedListImpl implements LinkedList {
    private head: Node | null = null;
    private tail: Node | null = null;
    // tail에도 노드를 지정하는 방식

    /* 
    prepend: 맨 앞에 노드 추가  
    📋 수도 코드
    - 새로운 노드 생성
    - 헤드를 새 노드로 변경
    ⚠️ 예외 사항
    - 테일이 null(애초에 빈 리스트)이라면 새 노드로 설정
    */
    prepend(value: number): this {
      const newNode: Node = { value, next: this.head };
      this.head = newNode;

      if (this.tail == null) {
        this.tail = newNode;
      }

      return this;
    }

    /* 
    append: 맨 뒤에 노드 추가
    📋 수도 코드
    - 새 노드 생성
    - 현재 테일에 새 노드 연결하기
    - 연결된 새 노드를 테일로 설정하기
    ⚠️ 예외 사항
    - 빈 리스트라면 새 노드로 활성화
    */
    append(value: number): this {
      const newNode: Node = { value, next: null };

      if (this.head == null) {
        this.head = newNode;
        this.tail = newNode;
        return this;
      }

      this.tail!.next = newNode;
      this.tail = newNode;

      return this;
    }

    /* 
    insert: 특정 인덱스에 노드 추가하기
    💡 인자로 들어온 인덱스가 연결리스트를 벗어났을 때 어떻게 로직을 구성할 것인가?
    - 그냥 맨뒤에 붙여준다. ✔
    - 벗어났다고 언질을 준다.
    📋 수도 코드
    - 통과한 인덱스가 0이라면 맨 앞에 추가하기(prepend)
    - 현재 노드와 예상 인덱스 설정
    - 선형 접근으로 새 노드 자리할 위치 잡기 (순회 while)
      - 인덱스와 노드를 한 칸씩 이동한다
      - 탈출 조건: 예상한 위치와 원하는 위치가 일치할 때
    - 새 노드 생성
    - 새 노드 연결하기
      - 앞서 풀 스캔이 아니었다면(현 노드가 존재한다) 현 노드의 다음 노드 사이에 새 노드를 연결한다
      - 풀 스캔을 완료했다면 맨 마지막에 노드를 추가하고 테일로 설정한다
    ⚠️ 예외 사항
    - 인자로 들어온 원본 인덱스 유효성 체크하고 조정하기
    - 빈 리스트였다면 그냥 새 노드로 활성화하기
    */
    insert(value: number, rawIndex: number): this {
      // 개발자의 실수 우아하게 처리하기
      const index: number = rawIndex < 0 ? 0 : rawIndex;

      if (index === 0) {
        return this.prepend(value);
      }

      let tempIndex = 1;
      const newNode: Node = { value, next: null };

      if (this.head == null) {
        this.head = newNode;
        this.tail = newNode;
      }

      let currentNode: Node | null = this.head;

      while (currentNode) {
        if (tempIndex === index) {
          newNode.next = currentNode.next;
          currentNode.next = newNode;
          break;
        }

        tempIndex++;
        currentNode = currentNode.next;
      }

      this.tail!.next = newNode;
      this.tail = newNode;

      return this;
    }

    /* 
    delete: 특정 값을 가진 노드 삭제
    📋 수도 코드
    - 헤드의 값과 인자로 들어온 값이 같다면 헤드 삭제 후 다음 노드로 헤드 변경하기
    - 선형 탐색으로 값 찾기 (prev 노드없이 next 이용)
      - 다음 노드의 값이 찾던 것이라면 현재 노드의 참조를 다다음 노드로 연결
      - 아니라면 다음 노드로 이동
    - 테일의 값이 찾던 것이라면 버리고 스캔 후 남은 마지막 노드로 연결
    ⚠️ 예외 사항
    - 빈 리스트라면 null을 반환
    */
    delete(value: number): Node | null {
      if (this.head == null) {
        return null;
      }
      // 삭제할 노드 지정
      let result = null;
      if (this.head && this.head.value === value) {
        result = this.head;
        this.head = this.head.next;
      }

      let currentNode = this.head;

      if (currentNode) {
        while (currentNode.next) {
          if (currentNode.next.value === value) {
            result = currentNode.next;
            currentNode.next = currentNode.next.next;
          } else {
            currentNode = currentNode.next;
          }
        }
      } // 마지막 노드 1개 currNode에 담겨있다.

      if (this.tail?.value === value) {
        this.tail = currentNode;
      }

      return result;
    }

    /* 
    deleteHead: 헤드 제거
    📋 수도 코드
    - 헤드 다음 노드가 있다면 헤드 변경
    - 없다면 빈 리스트 만들기
    ⚠️ 예외 사항
    - 빈 리스트라면 null 반환
    */
    deleteHead(): Node | null {
      if (this.head == null) {
        return null;
      }

      const result = this.head;

      if (this.head.next) {
        this.head = this.head.next;
      } else {
        this.head = null;
        this.tail = null;
      }
      return result;
    }

    /* 
    deleteTail: 테일 제거
    📋 수도 코드
    - 노드가 2개 이상이라면(Head !== Tail) 선형 접근으로 테일까지 가기
      - null 바로 전 마지막 노드(Tail)를 null로 만들고 테일 링크 변경하기
    ⚠️ 예외 사항
    - 노드가 단 하나라면(Head === Tail) 빈 리스트로 만들기
    */
    deletedTail(): Node | null {
      const result = this.tail;

      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
        return result;
      }

      // 노드가 존재할 때, 선형 탐색하면서 null 전 마지막 노드를 삭제하고 링크 변경
      let currentNode = this.head;
      while (currentNode?.next) {
        if (currentNode.next.next == null) {
          currentNode.next = null; // Tail 삭제
        } else {
          currentNode = currentNode.next; // 다음으로 넘어가기
        }
      }
      this.tail = currentNode;

      return result;
    }

    /* 
    find: 특정 값을 가진 노드 찾기
    📋 수도 코드
    - 리스트 선형 탐색
      - 탈출 조건: 특정값과 일치하는 값을 가진 노드일 때
    - 풀 스캔으로 찾지 못하면 null 반환
    ⚠️ 예외 사항
    - 빈 리스트라면 null 반환
    */
    find(value?: number): Node | null {
      if (this.head == null) {
        return null;
      }

      let currentNode: Node | null = this.head;

      while (currentNode) {
        if (value && currentNode.value === value) {
          return currentNode;
        }
        currentNode = currentNode.next;
      }

      return null;
    }

    /* 
    reverse: 연결 리스트 뒤집기
    📋 수도 코드
    - 전, 현재, 후의 노드 설정
    - 리스트 순회하기
      - 현재 노드의 next로 다음 노드 설정하기
      - 현재 노드의 next 링크를 전 노드로 변경하기
      - 한 칸씩 이동한다.
    - 풀 스캔을 끝이로 헤드와 테일을 교체해준다.
    ⚠️ 예외 사항
    - 빈 리스트라면 null 반환
    */
    reverse(): this {
      let currNode = this.head;
      let prevNode = null;
      let nextNode = null;

      while (currNode) {
        nextNode = currNode.next;

        currNode.next = prevNode;

        prevNode = currNode;
        currNode = nextNode;
      }

      this.tail = this.head;
      this.head = prevNode;

      return this;
    }
  }
}
