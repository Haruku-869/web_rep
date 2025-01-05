"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');


document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;
    const category = document.querySelector('#category').value;

    const params = {
        method: "POST",
        body: 'name=' + name + '&message=' + message + '&category=' + category,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch("/post", params)
        .then(response => response.json())
        .then(() => {
            document.querySelector('#message').value = ""; 
            loadPosts(); 
        });
});


function loadPosts() {
    const params = {
        method: "POST",
        body: 'start=' + number,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch("/show_posts", params)
        .then(response => response.json())
        .then(response => {
            number += response.length;
            for (let i = 0; i < response.length; i++) {
                const mes = response[i];
                const cover = document.createElement('div');
                cover.className = 'cover';

                const name_area = document.createElement('span');
                name_area.className = 'name';
                name_area.innerText = mes.name;

                const mes_area = document.createElement('span');
                mes_area.className = 'mes';
                mes_area.innerText = mes.message;

                const like_button = document.createElement('button');
                like_button.innerText = `いいね (${mes.likes || 0})`;
                like_button.className = 'like-button';
                like_button.addEventListener('click', () => {
                    fetch(`/like/${mes.id}`, { method: 'POST' })
                        .then(res => res.json())
                        .then(data => {
                            like_button.innerText = `いいね (${data.likes})`;
                        });
                });

                cover.appendChild(name_area);
                cover.appendChild(mes_area);
                cover.appendChild(like_button);

                bbs.appendChild(cover);
            }
        });
}

loadPosts();

// キーワード
document.querySelector('#search').addEventListener('click', () => {
    const keyword = document.querySelector('#keyword').value;

    const params = {
        method: "POST",
        body: 'keyword=' + encodeURIComponent(keyword),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch("/search", params)
        .then(response => response.json())
        .then(data => {
            const results = document.querySelector('#search-results');
            results.innerHTML = ""; 
            for (let post of data.results) {
                const result = document.createElement('div');
                result.className = 'result';
                result.innerText = `名前: ${post.name}, メッセージ: ${post.message}`;
                results.appendChild(result);
            }
        });
});

// カテゴリー
document.querySelectorAll('#category-btn').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        const params = {
            method: "POST",
            body: 'category=' + encodeURIComponent(category),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        fetch('/category', params)
            .then(response => response.json())
            .then(data => {
                const categoryResultsDiv = document.querySelector('#categoryResults');
                categoryResultsDiv.innerHTML = ""; 

                if (data.posts.length === 0) {
                    categoryResultsDiv.innerHTML = "<p>このカテゴリーには投稿がありません。</p>";
                } else {
                    const ul = document.createElement('ul');
                    data.posts.forEach(post => {
                        const li = document.createElement('li');
                        li.textContent = `${post.name}: ${post.message}`;
                        ul.appendChild(li);
                    });
                    categoryResultsDiv.appendChild(ul);
                }
            });
    });
});