// detail.js (포스트 상세 화면용 JavaScript)

// JSONPlaceholder API의 기본 URL
const apiUrl = "https://jsonplaceholder.typicode.com";

// 캐시 유효 시간 설정 (5분, 밀리초 단위)
const CACHE_DURATION = 5 * 60 * 1000; // 5분 = 5 * 60초 * 1000밀리초

/**
 * URL에서 'postId' 쿼리 파라미터 값을 가져옵니다.
 * @returns {string|null} postId 값 또는 파라미터가 없는 경우 null
 */
function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("postId");
}

/**
 * 포스트 상세 정보를 화면에 표시하는 비동기 함수입니다.
 * 로컬 스토리지에 캐시된 데이터가 있는지 확인하고, 있다면 캐시를 우선 사용합니다.
 * 캐시가 없거나 만료되었다면 API에서 새로운 데이터를 가져옵니다.
 */
async function displayPostDetail() {
    const postId = getPostIdFromUrl();
    const postDetailElement = document.getElementById("post-detail");

    // postId가 URL에 없는 경우 에러 메시지를 표시하고 함수를 종료합니다.
    if (!postId) {
        postDetailElement.innerHTML = `<h3>Error: No Post ID provided</h3><p>Please go back to the list and select a post.</p>`;
        console.error("Error: No post ID provided in URL.");
        return;
    }

    const localStorageKey = `post_${postId}`;
    const cachedData = localStorage.getItem(localStorageKey);
    const now = new Date().getTime(); // 현재 시간 (밀리초)

    let post = null; // 포스트 데이터를 저장할 변수

    // 1. 로컬 스토리지에 캐시된 데이터가 있는지 확인합니다.
    if (cachedData) {
        try {
            const { data, timestamp } = JSON.parse(cachedData);
            // 캐시 데이터가 유효 기간(5분) 내에 있는지 확인합니다.
            if (now - timestamp < CACHE_DURATION) {
                post = data;
                console.log("Post loaded from localStorage");
            } else {
                // 캐시가 만료된 경우
                console.log("Cache expired, fetching from API...");
                localStorage.removeItem(localStorageKey); // 만료된 캐시 제거
            }
        } catch (e) {
            // 캐시 데이터 파싱 중 에러 발생 시 (데이터 손상 등)
            console.error("Error parsing cached data, fetching from API:", e);
            localStorage.removeItem(localStorageKey); // 손상된 캐시 제거
        }
    }

    // 2. 캐시 데이터가 없거나 유효하지 않은 경우, API에서 데이터를 가져옵니다.
    if (!post) { // post 변수가 아직 채워지지 않았다면 (캐시 사용 못 했다면)
        try {
            const response = await fetch(`${apiUrl}/posts/${postId}`);
            if (!response.ok) {
                // HTTP 응답이 성공적이지 않을 경우 에러를 발생시킵니다.
                throw new Error(`Failed to fetch post ${postId}: ${response.status} ${response.statusText}`);
            }
            post = await response.json();
            console.log("Post fetched from API");

            // 새로 가져온 데이터를 로컬 스토리지에 캐시합니다.
            localStorage.setItem(localStorageKey, JSON.stringify({ data: post, timestamp: now }));
        } catch (error) {
            // API 호출 중 에러 발생 시
            console.error(`Error: ${error.message}`);
            postDetailElement.innerHTML = `<h3>Error loading post details</h3><p>${error.message}</p>`;
            return; // 에러 발생 시 더 이상 진행하지 않고 함수를 종료합니다.
        }
    }

    // 3. 가져온 (또는 캐시된) 포스트 데이터를 화면에 렌더링합니다.
    if (post) {
        renderPost(post);
    } else {
        // 모든 시도 후에도 포스트 데이터를 얻지 못했을 경우
        postDetailElement.innerHTML = `<h3>Error: Could not retrieve post details.</h3><p>Please try again later.</p>`;
    }
}

/**
 * 주어진 포스트 객체를 사용하여 HTML 요소를 렌더링합니다.
 * @param {object} post - 렌더링할 포스트 객체 (title, body 속성 포함)
 */
function renderPost(post) {
    const postDetail = document.getElementById("post-detail");
    if (post && post.title && post.body) {
        postDetail.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        `;
    } else {
        postDetail.innerHTML = "<h3>Post data is incomplete or unavailable.</h3><p>Details could not be displayed.</p>";
    }
}

// DOM 내용이 완전히 로드된 후 displayPostDetail 함수를 실행합니다.
document.addEventListener('DOMContentLoaded', displayPostDetail);