// list.js (포스트 목록 화면용 JavaScript)

// JSONPlaceholder API의 기본 URL
const apiUrl = "https://jsonplaceholder.typicode.com";

/**
 * API에서 포스트 목록을 가져와 HTML 목록에 표시합니다.
 * 각 포스트 제목은 클릭 가능한 링크로 상세 페이지로 연결됩니다.
 */
async function displayPosts() {
    const postList = document.getElementById("post-list");
    // 데이터를 가져오는 동안 사용자에게 로딩 상태를 표시합니다.
    postList.innerHTML = "<li>Loading posts...</li>"; 

    try {
        // API에서 포스트 데이터 가져오기
        const response = await fetch(`${apiUrl}/posts`);

        // HTTP 응답이 성공적이지 않을 경우 에러를 발생시킵니다.
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }

        // 응답을 JSON 형태로 파싱합니다.
        const posts = await response.json();

        // 기존 목록을 초기화합니다.
        postList.innerHTML = ""; 

        // 가져온 포스트 데이터를 순회하며 목록에 추가합니다.
        posts.forEach(post => {
            const li = document.createElement("li");
            // `li` 요소에 `data-postId` 속성을 추가하여 포스트 ID를 저장합니다.
            li.dataset.postId = post.id;
            
            // 링크 요소를 생성하여 포스트 제목을 표시하고 상세 페이지로 연결합니다.
            const anchor = document.createElement("a");
            anchor.href = `detail.html?postId=${post.id}`;
            anchor.textContent = post.title;

            li.appendChild(anchor);
            postList.appendChild(li);
        });
    } catch (error) {
        // 에러 발생 시 콘솔에 메시지를 출력하고 사용자에게도 에러를 알립니다.
        console.error("Error: Failed to fetch posts", error.message);
        postList.innerHTML = `<li>Error: Failed to load posts. ${error.message}</li>`;
    }
}

// DOM 내용이 완전히 로드된 후 `displayPosts` 함수를 실행합니다.
document.addEventListener('DOMContentLoaded', displayPosts);