// main.js

// index.js에서 필요한 함수와 상태 변수를 가져옵니다.
import calculate, {
    appendNumber,
    setOperator,
    resetDisplay,
    subDisplay,
    showError,
    removeError,
    formatHistoryForDisplay, // 계산 기록 포맷팅 함수
    VALID_NUMBERS,
    VALID_OPERATORS,
    history, // 계산 기록 배열 자체
    currentInput,
    firstNumber,
    operator,
    isError
} from './index.js';

// ===========================================
// DOM 요소 선택
// ===========================================
// HTML에서 각 요소를 ID 또는 클래스 이름을 사용하여 가져옵니다.
const displayElement = document.getElementById("result");
const subDisplayElement = document.getElementById("sub-display");

const numberButtons = document.querySelectorAll(".btn-number");
const operatorButtons = document.querySelectorAll(".btn-operator");
const equalsButton = document.getElementById("btn-equals");
const clearButton = document.getElementById("btn-clear");
const backspaceButton = document.getElementById("btn-backspace");

// 새로 추가된 기록 관련 DOM 요소
const showHistoryButton = document.getElementById("btn-show-history"); // 기록 표시 버튼
const historyDisplayArea = document.getElementById("history-display-area"); // 기록 전체를 감싸는 div
const historyListElement = document.getElementById("history-list"); // 기록 목록 (ul)

// ===========================================
// UI 업데이트 함수들
// ===========================================

/**
 * 메인 디스플레이(결과창)를 업데이트합니다.
 */
function updateMainDisplay() {
    if (isError) {
        displayElement.classList.add("error");
    } else {
        displayElement.classList.remove("error");
    }
    // currentInput은 이미 index.js에서 포맷된 "결과: 숫자" 형태일 수 있음
    displayElement.textContent = currentInput;
}

/**
 * 서브 디스플레이(보조창)를 업데이트합니다.
 */
function updateSubDisplay() {
    let subText = '';
    if (firstNumber !== null) {
        subText += firstNumber;
    }
    if (operator !== null) {
        subText += ` ${operator} `;
    }
    subDisplayElement.textContent = subText;
}

/**
 * 계산 기록 리스트를 HTML에 업데이트합니다.
 */
function updateHistoryDisplay() {
    historyListElement.innerHTML = ''; // 기존 기록 초기화

    // history.js에서 포맷된 기록 문자열 배열을 가져옵니다.
    const formattedRecords = formatHistoryForDisplay(history);

    if (formattedRecords.length === 1 && formattedRecords[0] === "기록이 없습니다.") {
        // 기록이 없을 때 "기록이 없습니다." 메시지를 표시합니다.
        const listItem = document.createElement('li');
        listItem.textContent = formattedRecords[0];
        historyListElement.appendChild(listItem);
    } else {
        // 각 기록 문자열에 대해 <li> 요소를 생성하여 목록에 추가합니다.
        formattedRecords.forEach(recordText => {
            const listItem = document.createElement('li');
            listItem.textContent = recordText;
            historyListElement.appendChild(listItem);
        });
    }
}

// ===========================================
// 이벤트 핸들러 함수들
// ===========================================

/**
 * 숫자 버튼 클릭 또는 숫자 키 입력 처리.
 * @param {string} number - 입력된 숫자 문자열.
 */
function handleNumberClick(number) {
    if (isError) removeError(); // 에러 상태 해제
    // appendNumber 함수를 통해 currentInput 업데이트
    currentInput = appendNumber(number, currentInput);
    updateMainDisplay();
}

/**
 * 연산자 버튼 클릭 또는 연산자 키 입력 처리.
 * @param {string} op - 입력된 연산자 문자열.
 */
function handleOperatorClick(op) {
    if (isError) removeError(); // 에러 상태 해제

    // 첫 번째 숫자가 아직 설정되지 않았고 현재 입력값이 유효하다면 설정
    if (firstNumber === null && currentInput !== "0" && currentInput !== "") {
        firstNumber = Number(currentInput);
    }
    // 체인 연산 (이전 계산 결과로 다음 연산 시작)
    else if (firstNumber !== null && operator !== null && currentInput !== "0" && currentInput !== "") {
        calculate(); // 이전 연산을 먼저 수행
        // 계산 결과가 "결과: 숫자" 형태이므로 숫자만 추출하여 firstNumber로 설정
        firstNumber = Number(displayElement.textContent.replace("결과: ", ""));
    }

    // 연산자 설정
    operator = setOperator(op, currentInput);
    updateSubDisplay(); // 보조창 업데이트
    currentInput = resetDisplay(); // 메인 디스플레이 초기화
    updateMainDisplay(); // 메인 디스플레이 업데이트 (초기화된 '0' 표시)
}

/**
 * 등호 `=` 버튼 클릭 또는 Enter 키 입력 처리.
 */
function handleEqualsClick() {
    calculate(); // index.js의 calculate 함수 호출 (계산 수행 및 history 업데이트)
    updateMainDisplay(); // 메인 디스플레이 업데이트
    updateSubDisplay(); // 보조 디스플레이 초기화
    updateHistoryDisplay(); // 계산 완료 후 기록 리스트 업데이트
}

/**
 * C (Clear) 버튼 클릭 또는 Esc 키 입력 처리.
 */
function handleClearClick() {
    // index.js에서 export된 상태 변수들을 직접 초기화합니다.
    history.length = 0; // 기록 배열 비우기
    currentInput = resetDisplay(); // 현재 입력값 초기화
    firstNumber = null;
    operator = null;
    isError = false;

    removeError(); // 에러 메시지 제거
    updateMainDisplay(); // 디스플레이 업데이트
    updateSubDisplay(); // 보조창 업데이트
    updateHistoryDisplay(); // 기록 디스플레이 초기화
}

/**
 * 백스페이스 `←` 버튼 클릭 처리.
 */
function handleBackspaceClick() {
    if (isError) removeError(); // 에러 상태 해제

    // currentInput에서 마지막 문자 제거
    currentInput = subDisplay(currentInput);
    updateMainDisplay();
}

/**
 * '기록 표시' 버튼 클릭 시 기록 영역의 가시성을 토글합니다.
 */
function handleShowHistoryClick() {
    // 'display' 스타일 속성을 사용하여 'none'과 'block'을 토글합니다.
    if (historyDisplayArea.style.display === 'none' || historyDisplayArea.style.display === '') {
        historyDisplayArea.style.display = 'block'; // 보이기
        updateHistoryDisplay(); // 기록을 보일 때마다 최신 기록으로 업데이트
    } else {
        historyDisplayArea.style.display = 'none'; // 숨기기
    }
}

// ===========================================
// 이벤트 리스너 연결
// ===========================================
// 모든 숫자 버튼에 클릭 이벤트 리스너 연결
numberButtons.forEach(button => {
    button.addEventListener("click", () => handleNumberClick(button.dataset.value));
});

// 모든 연산자 버튼에 클릭 이벤트 리스너 연결
operatorButtons.forEach(button => {
    button.addEventListener("click", () => handleOperatorClick(button.dataset.value));
});

// 기능 버튼에 클릭 이벤트 리스너 연결
equalsButton.addEventListener("click", handleEqualsClick);
clearButton.addEventListener("click", handleClearClick);
backspaceButton.addEventListener("click", handleBackspaceClick);

// '기록 표시' 버튼에 클릭 이벤트 리스너 연결
showHistoryButton.addEventListener("click", handleShowHistoryClick);

// ===========================================
// 키보드 이벤트 처리
// ===========================================
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (VALID_NUMBERS.includes(key)) {
        handleNumberClick(key);
    } else if (VALID_OPERATORS.includes(key)) {
        handleOperatorClick(key);
    } else if (key === "Enter") {
        event.preventDefault(); // Enter 키 기본 동작(폼 제출 등) 방지
        handleEqualsClick();
    } else if (key === "Backspace") {
        handleBackspaceClick();
    } else if (key === "Escape") { // Esc 키를 Clear 기능에 매핑
        handleClearClick();
    }
});

// ===========================================
// 초기화
// ===========================================
// 페이지 로드 시 계산기 초기 상태 설정
handleClearClick();