// index.js

// 다른 모듈에서 필요한 함수와 상수를 가져옵니다.
import calculateOperation from './operations.js';
import { resetDisplay, setDisplay, subDisplay, appendNumber, setOperator, VALID_NUMBERS, VALID_OPERATORS } from './input.js';
import { showError, removeError } from './error.js';
import saveHistory, { formatHistoryForDisplay } from './history.js';

// ===========================================
// 계산기 애플리케이션의 상태 변수들
// ===========================================
// 이 변수들은 `export` 하여 다른 모듈(예: main.js)에서 접근하고 수정할 수 있도록 합니다.
export let history = []; // History for exponent operations and displaying records
export let currentInput = "0"; // 현재 디스플레이에 표시되는 숫자 또는 입력 중인 값
export let firstNumber = null; // 첫 번째 피연산자 (숫자)
export let operator = null; // 선택된 연산자
export let isError = false; // 현재 에러 상태인지 나타내는 플래그

// ===========================================
// 핵심 계산 로직 (기본 내보내기)
// ===========================================
/**
 * 계산을 수행하는 핵심 함수입니다.
 * 모든 상태 변수를 활용하여 계산 로직을 처리하고, 결과를 업데이트합니다.
 * 이 함수는 `export default`로 내보내져 다른 파일에서 호출됩니다.
 */
export default function calculate() {
    // 에러 상태를 초기화합니다.
    removeError(); // error.js의 removeError 함수 호출
    isError = false;

    try {
        // 계산에 필요한 값이 충분한지 확인합니다.
        // 첫 번째 숫자, 연산자, 현재 입력값 중 하나라도 없으면 계산 불가
        if (firstNumber === null || operator === null || currentInput === "") {
            isError = true;
            throw new Error("계산에 필요한 값이 부족합니다.");
        }

        // 현재 입력된 값을 두 번째 숫자로 변환합니다.
        const secondNumber = Number(currentInput);

        // 변환된 값이 유효한 숫자인지 확인합니다.
        if (isNaN(secondNumber)) {
            isError = true;
            throw new Error("유효한 숫자를 입력하세요.");
        }

        // operations 모듈의 calculateOperation 함수를 사용하여 실제 계산을 수행합니다.
        const result = calculateOperation(firstNumber, secondNumber, operator);

        // history 모듈의 saveHistory 함수를 사용하여 계산 기록을 저장합니다.
        // history 배열은 이 모듈에서 관리되는 상태 변수입니다.
        history = saveHistory(firstNumber, operator, secondNumber, result, history);

        // 결과 디스플레이를 업데이트합니다.
        // setDisplay는 값을 포맷하여 반환하므로, 그 값을 currentInput에 할당
        currentInput = setDisplay(`결과: ${result}`);

        // 계산 완료 후 상태 변수들을 초기화합니다.
        firstNumber = null;
        operator = null;

    } catch (error) {
        // 에러 발생 시 error 모듈의 showError 함수를 호출하여 메시지를 표시합니다.
        isError = true; // 에러 상태로 설정
        showError(error.message); // 에러 메시지 표시

        // 에러 발생 시 상태를 초기화하여 다음 입력을 받을 준비를 합니다.
        currentInput = resetDisplay(); // 디스플레이를 '0'으로 초기화
        firstNumber = null;
        operator = null;
    }
}

// ===========================================
// `for...in` 루프를 위한 함수 목록 (콘솔 로그용)
// ===========================================
// index.js에서 '내보낸' 함수들을 객체로 관리하고 순회합니다.
// `calculateOperation`은 `operations.js`의 default export이므로 직접 포함되지 않습니다.
// `calculate`는 이 파일의 default export이므로 직접 포함되지 않습니다.
const exportedFunctionsForLogging = {
    resetDisplay,
    setDisplay,
    subDisplay,
    appendNumber,
    setOperator,
    showError,
    removeError,
    saveHistory,
    formatHistoryForDisplay
};

console.log("--- Available Exported Functions from index.js ---");
for (const funcName in exportedFunctionsForLogging) {
    if (typeof exportedFunctionsForLogging[funcName] === 'function') {
        console.log(`Function: ${funcName}`);
    }
}
console.log("--------------------------------------------------");


// ===========================================
// 다른 모듈에서 사용될 수 있는 모든 함수와 상태 변수들을 `export` 합니다.
// ===========================================
export {
    resetDisplay, setDisplay, subDisplay, appendNumber, setOperator,
    showError, removeError, saveHistory, formatHistoryForDisplay,
    VALID_NUMBERS, VALID_OPERATORS,
    history, currentInput, firstNumber, operator, isError
};