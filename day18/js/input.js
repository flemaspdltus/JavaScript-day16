// input.js

// 계산기에 허용되는 숫자 및 연산자 정의
const VALID_NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const VALID_OPERATORS = ["+", "-", "*", "/", "^"]; // ^ (제곱) 연산자 포함

// 현재 디스플레이 값을 "0"으로 초기화하고 반환합니다.
export function resetDisplay() {
    return "0";
}

// 주어진 값을 디스플레이에 설정합니다. (현재는 단순히 값을 반환)
export function setDisplay(value) {
    // 이 함수는 실제 DOM 조작을 담당하지 않고,
    // main.js로 전달될 디스플레이 '값'을 결정합니다.
    return String(value);
}

// 디스플레이에서 마지막 문자를 제거하거나 "0"으로 설정합니다. (현재는 단순히 값을 반환)
export function subDisplay(currentDisplayValue) {
    if (currentDisplayValue.length > 1) {
        return currentDisplayValue.slice(0, -1);
    }
    return "0";
}

/**
 * 현재 입력 값에 숫자를 추가합니다.
 * - "0"으로 시작하거나 소수점 중복을 방지합니다.
 * @param {string} number - 추가할 숫자 문자열.
 * @param {string} currentInput - 현재 디스플레이에 표시된 입력 값.
 * @returns {string} 업데이트된 입력 값.
 */
export function appendNumber(number, currentInput) {
    // 에러 상태이거나 현재 입력이 "0"일 때 새 숫자로 시작
    if (currentInput === "0" && number !== ".") {
        return number;
    }
    // 소수점이 이미 있는데 또 소수점을 입력하는 경우 무시
    if (number === "." && currentInput.includes(".")) {
        return currentInput;
    }
    // 최대 자릿수 제한 (예: 15자리)
    if (currentInput.length >= 15 && number !== ".") {
        return currentInput; // 15자리를 초과하면 더 이상 추가하지 않음
    }
    return currentInput + number;
}

/**
 * 현재 연산자를 설정합니다.
 * (이 함수는 주로 유효성 검사를 수행하며, 실제 연산자 상태는 index.js에서 관리)
 * @param {string} operator - 설정할 연산자.
 * @param {string} currentInput - 현재 입력 값.
 * @returns {string} 유효한 연산자 또는 null.
 */
export function setOperator(operator, currentInput) {
    if (VALID_OPERATORS.includes(operator)) {
        // 연산자 설정 로직은 index.js나 main.js에서 상태를 업데이트함
        return operator;
    }
    // 유효하지 않은 연산자일 경우 처리
    console.warn(`Attempted to set invalid operator: ${operator}`);
    return null; // 또는 에러를 발생시킬 수 있음
}

// 외부에서 사용될 함수들과 상수들을 export합니다.
export {
    VALID_NUMBERS,
    VALID_OPERATORS
};