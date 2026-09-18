let currentPage = 1;
const limit = 10;
let timerId;
let isFetching = false;

const searchQuery = document.getElementById("search-input");
const loadEl = document.getElementById("loader");
const errorEl = document.getElementById("error-message");
const notFoundEl = document.getElementById("not-found");
const loadButton = document.getElementById("load-more");

searchQuery.addEventListener("input", () => {
    resetPage();
    clearTimeout(timerId);
    timerId = setTimeout(() => {
        loadPosts();
    }, 300);
});

function loadPosts() {
    if (isFetching) return;
    isFetching = true;

    loadEl.style.display = "block";
    errorEl.style.display = "none";
    notFoundEl.style.display = "none";

    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${limit}&q=${searchQuery.value}`)
    .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
    })
    .then(json => {
        if (json.length === 0 && currentPage === 1) {
            notFoundEl.style.display = "block";
        }
        loadButton.disabled = (json.length === 0 || json.length < limit);
        json.forEach(element => renderPost(element));
    })
    .catch(() => {
        errorEl.style.display = "block";
    })
    .finally(() => {
        isFetching = false;
        loadEl.style.display = "none";
    });
}

loadButton.addEventListener("click", () => {
    currentPage++;
    loadPosts();
});

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loadButton.disabled && !isFetching) {
        currentPage++;
        loadPosts();
    }
}, {
    rootMargin: '200px'
});

observer.observe(document.getElementById("mark"));

function renderPost(post) {
    const container = document.getElementById("posts-container");
    const postElement = document.createElement("div");
    postElement.classList.add("post-item");
    postElement.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
    container.append(postElement);
}

function resetPage() {
    document.getElementById("posts-container").innerHTML = "";
    currentPage = 1;
    loadButton.disabled = false;
}

loadPosts();