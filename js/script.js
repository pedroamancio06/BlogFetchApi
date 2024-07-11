const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector('[date-loading]');
const postsContainer = document.querySelector('[date-posts-container]');

const postPage = document.querySelector('[date-post]');
const postContainer = document.querySelector('[date-post-container]');
const commentsContainer = document.querySelector('[date-comments-container]');

const commentForm = document.querySelector('#comment-form')
const email = document.querySelector('[date-email-comment]');
const body = document.querySelector('[date-body-comment]');

// Get id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// Get all posts
async function getAllPosts() {
    const response = await fetch(url);
    const data = await response.json();

    loadingElement.classList.add('hide');

    data.map((post) => {
        const div = document.createElement('div');
        const title = document.createElement('h2');
        const body = document.createElement('p');
        const link = document.createElement('a');

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = "Ler";
        link.setAttribute("href", `post.html?id=${post.id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);
        postsContainer.appendChild(div);
    });
}

async function getPost(id) {
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ]);
    
    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();
    
    loadingElement.classList.add('hide');
    postPage.classList.remove('hide');
    
    const titlePost = document.createElement('h1');
    const bodyPost = document.createElement('p');
    
    titlePost.innerText = dataPost.title;
    bodyPost.innerText = dataPost.body;
    
    postContainer.appendChild(titlePost);
    postContainer.appendChild(bodyPost);
    
    dataComments.map(comment => {
        createComment(comment);
    });
}

function createComment(comment) {
    const div2 = document.createElement('div');
    const email = document.createElement('h3');
    const commentBody = document.createElement('p');
    
    email.innerText = comment.email;
    commentBody.innerText = comment.body;
    
    div2.appendChild(email);
    div2.appendChild(commentBody);
    
    commentsContainer.appendChild(div2);
}

async function postComments(comment) {
    const response = await fetch(url, {
        method: 'POST',
        body: comment,
        headers: {
            "Content-type": "application/json",
        },
    });

    const data = await response.json();
    createComment(data);
}

if (!postId) {
    getAllPosts();
} else {
    getPost(postId);

    // Add event to comment form
    commentForm.addEventListener('submit', e => {
        e.preventDefault();

        let comment = {
            email: email.value,
            body: body.value,
        }

        comment = JSON.stringify(comment);

        postComments(comment);
        
    })
}