// history.js

/**
 * 계산 결과를 기록 배열에 저장하고 콘솔에 출력합니다.
 * @param {number} firstNumber - 첫 번째 숫자.
 * @param {string} operator - 연산자.
 * @param {number} secondNumber - 두 번째 숫자.
 * @param {number} result - 계산 결과.
 * @param {Array<Object>} history - 현재까지의 계산 기록을 담고 있는 배열.
 * @returns {Array<Object>} 업데이트된 계산 기록 배열.
 */
export default function saveHistory(firstNumber, operator, secondNumber, result, history) {
    const record = { firstNumber, operator, secondNumber, result };
    history.push(record);
    // 콘솔에 JSON 형식으로 예쁘게 출력
    console.log("계산 기록:", JSON.stringify(history, null, 2));
    return history;
}

/**
 * 계산 기록 배열을 받아 UI에 표시하기 좋은 문자열 배열로 포맷합니다.
 * 이 함수는 실제 DOM을 업데이트하지 않고, 포맷된 데이터를 반환합니다.
 * @param {Array<Object>} history - 현재까지의 계산 기록을 담고 있는 배열.
 * @returns {Array<string>} 각 기록을 "숫자 연산자 숫자 = 결과" 형식의 문자열로 포맷한 배열.
 */
export function formatHistoryForDisplay(history) {
    if (!history || history.length === 0) {
        return ["기록이 없습니다."]; // 기록이 없을 때 표시할 메시지
    }
    return history.map(record =>
        `${record.firstNumber} ${record.operator} ${record.secondNumber} = ${record.result}`
    );
}