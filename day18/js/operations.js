// operations.js

/**
 * 두 숫자와 연산자를 받아 사칙연산을 수행합니다.
 * 0으로 나누는 경우 Error를 발생시킵니다.
 *
 * @param {number} firstNumber - 첫 번째 숫자.
 * @param {number} secondNumber - 두 번째 숫자.
 * @param {string} operator - 연산자 ('+', '-', '*', '/', '^').
 * @returns {number} 계산 결과.
 * @throws {Error} 0으로 나누려고 할 때 발생합니다.
 */
export default function calculateOperation(firstNumber, secondNumber, operator) {
    switch (operator) {
        case '+':
            return firstNumber + secondNumber;
        case '-':
            return firstNumber - secondNumber;
        case '*':
            return firstNumber * secondNumber;
        case '/':
            if (secondNumber === 0) {
                throw new Error("0으로 나눌 수 없습니다.");
            }
            return firstNumber / secondNumber;
        case '^': // 제곱 연산 추가: firstNumber ** secondNumber (ES2016 지수 연산자)
            return firstNumber ** secondNumber;
        default:
            throw new Error("지원하지 않는 연산자입니다.");
    }
}