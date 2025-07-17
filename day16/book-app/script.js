// 도서 데이터를 저장할 배열 (기본 정보)
const books = [];
// 각 도서의 대여 상태를 관리하는 클로저 인스턴스를 저장할 Map
// key: 도서 제목 (string), value: 해당 도서의 대여 클로저 객체
const rentalClosures = new Map();

/**
 * addBook 함수: 새로운 도서를 추가하고 UI를 업데이트합니다.
 * 도서 제목 중복을 방지하고, 유효한 가격 입력을 강제하며, 각 도서에 대한 대여 클로저를 생성합니다.
 */
function addBook() {
    const titleInput = document.getElementById('bookTitle');
    const priceInput = document.getElementById('bookPrice');
    const title = titleInput.value.trim(); // 입력된 제목의 앞뒤 공백 제거
    const price = Number(priceInput.value);

    // 입력 유효성 검사
    if (title === '' || isNaN(price) || price <= 0) {
        alert('도서 제목을 입력하고, 0보다 큰 유효한 가격을 입력해주세요.');
        return;
    }

    // 도서 제목 중복 방지
    if (books.some(book => book.title === title)) {
        alert(`"${title}" 도서는 이미 존재합니다. 다른 제목을 입력해주세요.`);
        return;
    }

    // 새로운 도서 객체 생성 및 'books' 배열에 추가
    const newBook = { title, price };
    books.push(newBook);

    // 새로운 도서에 대한 대여 관리 클로저를 생성하고 'rentalClosures' Map에 저장
    const rentalManager = createBookRental(title);
    rentalClosures.set(title, rentalManager);

    // 도서 목록을 다시 렌더링하여 화면에 변경사항 반영
    renderBooks();

    // 입력 필드 초기화
    titleInput.value = '';
    priceInput.value = '';
}

/**
 * renderBooks 함수: 'books' 배열과 'rentalClosures' Map의 현재 상태를 기반으로
 * HTML 도서 목록을 완전히 새로 그립니다.
 * 각 도서의 대여 상태를 표시하고, '삭제', '대여/반납' 버튼을 포함합니다.
 */
function renderBooks() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; // 기존 목록을 초기화하여 중복 렌더링 방지

    // 'books' 배열의 각 도서에 대해 HTML 리스트 아이템을 생성하고 추가합니다.
    books.forEach(book => {
        const li = document.createElement('li');
        li.className = 'book-item';

        // 해당 도서의 대여 상태 클로저를 'rentalClosures' Map에서 찾아 현재 상태를 가져옵니다.
        const rentalManager = rentalClosures.get(book.title);
        let statusText = '(상태 알 수 없음)'; // 클로저가 없을 경우의 기본 텍스트
        if (rentalManager) {
            const { isBorrowed } = rentalManager.getStatus();
            statusText = isBorrowed ? '(대여 중)' : '(대여 가능)';
        }

        li.innerHTML = `
            <span>${book.title} - ${book.price}원 ${statusText}</span>
            <button class="delete-button" onclick="removeBook(this)" data-book-title="${book.title}">삭제</button>
            <button class="toggle-button" onclick="toggleRental(this)" data-book-title="${book.title}">대여/반납</button>
        `;
        bookList.appendChild(li); // 생성된 리스트 아이템을 ul에 추가
    });
}

/**
 * removeBook 함수: 클릭된 '삭제' 버튼에 해당하는 도서를 DOM, 'books' 배열, 'rentalClosures' Map에서 제거합니다.
 * @param {HTMLButtonElement} button - 클릭된 '삭제' 버튼 요소
 */
function removeBook(button) {
    const li = button.parentElement; // 클릭된 버튼의 부모 요소(li.book-item)를 찾습니다.
    const titleToRemove = button.dataset.bookTitle; // data-book-title 속성에서 책 제목을 가져옵니다.

    // 'books' 배열에서 도서 제거 (filter 메서드를 사용하여 새 배열 생성)
    books = books.filter(book => book.title !== titleToRemove);

    // 'rentalClosures' Map에서 해당 도서의 대여 상태 클로저 제거 (중요: 메모리 누수 방지)
    if (rentalClosures.has(titleToRemove)) {
        rentalClosures.delete(titleToRemove);
    }

    // DOM에서 해당 리스트 아이템 제거
    li.remove();

    console.log(`"${titleToRemove}" 도서 및 관련 대여 상태가 제거되었습니다.`);
    console.log('업데이트된 도서 목록:', books);
    console.log('업데이트된 클로저 맵:', Array.from(rentalClosures.keys())); // Map의 키(제목)만 출력
}

/**
 * processBooks 함수: 'books' 배열에 대해 map, filter, reduce를 사용하여 데이터를 처리하고 결과를 #results div에 표시합니다.
 * 이는 '기본 과제'의 핵심 기능입니다.
 */
function processBooks() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // 이전 처리 결과를 초기화

    // map: 각 도서 제목에 "Book: " 접두사 추가하여 새로운 배열 생성
    const prefixedBooks = books.map(book => ({
        ...book, // 기존 도서의 모든 속성을 복사
        title: `Book: ${book.title}` // 제목 속성만 변경
    }));

    // filter: 가격이 10,000원 이상인 도서만 필터링하여 새로운 배열 생성
    const highPriceBooks = books.filter(book => book.price >= 10000);

    // reduce: 모든 도서 가격의 합계를 계산
    const totalPrice = books.reduce((sum, book) => sum + book.price, 0); // 초기 합계 값은 0

    // 결과를 HTML 문자열로 구성하여 'resultsDiv'에 삽입
    let html = '<h3>상위 가격 도서:</h3><ul>';
    if (prefixedBooks.length === 0) {
        html += '<li>도서가 없습니다.</li>';
    } else {
        prefixedBooks.forEach(book => {
            html += `<li>${book.title} - ${book.price}원</li>`;
        });
    }
    html += '</ul>';

    html += '<h3>고가 도서:</h3><ul>';
    if (highPriceBooks.length === 0) {
        html += '<li>고가 도서가 없습니다.</li>';
    } else {
        highPriceBooks.forEach(book => {
            html += `<li>${book.title} - ${book.price}원</li>`;
        });
    }
    html += '</ul>';

    html += `<h3>총 가격:</h3><p>${totalPrice}원</p>`;
    resultsDiv.innerHTML = html;

    console.log('맵핑된 도서:', prefixedBooks);
    console.log('고가 도서:', highPriceBooks);
    console.log('총 가격:', totalPrice);
}

// --- 도전 과제: 클로저를 활용한 도서 대여 상태 관리 ---

/**
 * createBookRental 함수: 특정 도서의 대여 상태(isBorrowed)와 대여 횟수(borrowCount)를 관리하는 클로저를 생성합니다.
 * 이 함수가 반환하는 객체 내의 메서드들은 외부에서 직접 접근할 수 없는 내부 변수(isBorrowed, borrowCount)에 접근하고 조작합니다.
 * 이것이 클로저의 핵심적인 기능입니다.
 * @param {string} bookTitle - 관리할 도서의 제목
 * @returns {object} - 대여, 반납, 상태 확인 기능을 제공하는 객체 (클로저)
 */
const createBookRental = (bookTitle) => {
    let isBorrowed = false; // 도서 대여 상태 (true: 대여 중, false: 대여 가능). 클로저 내에서만 접근 가능
    let borrowCount = 0;    // 도서 총 대여 횟수. 클로저 내에서만 접근 가능

    return {
        // 도서를 대여하는 함수
        borrow: () => {
            if (isBorrowed) {
                alert(`"${bookTitle}" 도서는 이미 대여 중입니다.`);
                return false; // 대여 실패 (이미 대여 중이므로)
            }
            isBorrowed = true; // 상태를 '대여 중'으로 변경
            borrowCount++;     // 대여 횟수 증가
            console.log(`"${bookTitle}" 도서가 대여되었습니다. (총 대여 횟수: ${borrowCount})`);
            return true; // 대여 성공
        },
        // 도서를 반납하는 함수
        returnBook: () => {
            if (!isBorrowed) { // 대여 중이 아닐 때 반납 시도하면 경고
                 alert(`"${bookTitle}" 도서는 현재 대여 중이 아닙니다.`);
                 return false; // 반납 실패 (대여 중이 아니므로)
            }
            isBorrowed = false; // 상태를 '대여 가능'으로 변경
            console.log(`"${bookTitle}" 도서가 반납되었습니다.`);
            return true; // 반납 성공
        },
        // 현재 대여 상태와 횟수를 반환하는 함수 (클로저의 내부 상태에 접근)
        getStatus: () => ({
            title: bookTitle, // 클로저가 관리하는 도서 제목을 함께 반환
            isBorrowed,       // 현재 대여 상태
            borrowCount       // 현재 대여 횟수
        })
    };
};

/**
 * toggleRental 함수: '대여/반납' 버튼 클릭 시 호출되어 해당 도서의 대여 상태를 토글합니다.
 * 클로저의 'borrow()' 또는 'returnBook()' 메서드를 호출하고 UI를 업데이트합니다.
 * @param {HTMLButtonElement} button - 클릭된 '대여/반납' 버튼 요소
 */
function toggleRental(button) {
    const titleToToggle = button.dataset.bookTitle; // data-book-title 속성에서 도서 제목을 가져옵니다.
    
    // 'rentalClosures' Map에서 해당 도서의 대여 클로저 인스턴스를 찾습니다.
    const rentalManager = rentalClosures.get(titleToToggle);
    if (!rentalManager) {
        console.error(`Error: "${titleToToggle}"에 대한 대여 관리자를 찾을 수 없습니다. (클로저 없음)`);
        alert('대여 관리 오류가 발생했습니다. 개발자 콘솔을 확인해주세요.');
        return;
    }

    const { isBorrowed } = rentalManager.getStatus(); // 현재 대여 상태를 확인

    let actionSuccessful;
    // 현재 상태에 따라 'borrow()' 또는 'returnBook()' 메서드를 호출
    if (isBorrowed) {
        actionSuccessful = rentalManager.returnBook(); // 대여 중이면 반납 시도
    } else {
        actionSuccessful = rentalManager.borrow(); // 대여 가능이면 대여 시도
    }
    
    // 대여/반납 액션이 성공했을 때만 UI를 다시 렌더링하여 최신 상태를 반영합니다.
    if (actionSuccessful) {
        renderBooks();
    }
}

/**
 * showAllRentalStatus 함수: 'rentalClosures' Map에 관리되는 모든 도서의 현재 대여 상태와
 * 총 대여 횟수를 #results div에 표시합니다.
 * 이는 '도전 과제'의 핵심 기능입니다.
 */
function showAllRentalStatus() {
    const resultsDiv = document.getElementById('results');
    let rentalStatusHtml = '<h3>모든 도서 대여 상태:</h3><ul>';

    // 'rentalClosures' Map에 저장된 각 클로저 인스턴스를 순회하여 상태를 가져옵니다.
    // Map.values()는 Map의 모든 값(여기서는 클로저 객체)에 대한 이터레이터를 반환합니다.
    // Array.from()을 사용하여 이를 배열로 변환하고 map 메서드를 적용합니다.
    const allStatuses = Array.from(rentalClosures.values()).map(rentalManager => rentalManager.getStatus());

    if (allStatuses.length > 0) {
        allStatuses.forEach(status => {
            rentalStatusHtml += `<li>${status.title}: ${status.isBorrowed ? '대여 중' : '대여 가능'}, 총 대여 횟수: ${status.borrowCount}회</li>`;
        });
    } else {
        rentalStatusHtml += '<li>관리되는 도서 대여 상태가 없습니다. 도서를 추가해주세요.</li>';
    }
    rentalStatusHtml += '</ul>';

    resultsDiv.innerHTML = rentalStatusHtml; // 결과를 'resultsDiv'에 표시
    console.log('모든 도서 대여 상태:', allStatuses);
}

// DOMContentLoaded 이벤트 리스너: HTML 문서가 완전히 로드되고 파싱된 후에 실행될 코드를 정의합니다.
document.addEventListener('DOMContentLoaded', () => {
    // 앱 시작 시, 초기 'books' 배열이 비어있으므로 별도의 초기 클로저 생성은 필요 없습니다.
    // 사용자가 도서를 추가해야 목록이 채워지고 클로저가 생성됩니다.
    renderBooks(); // 초기 화면 로드 시 빈 목록을 렌더링합니다.
});