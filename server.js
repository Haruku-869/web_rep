"use strict"
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

let posts = []; // 投稿データ
let likes = {}; // 各投稿の「いいね」の数

// ミドルウェア設定
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// ルートハンドラ
app.get("/", (req, res) => {
    res.render("index", { posts });
});

// 投稿を受け取るエンドポイント
app.post("/post", (req, res) => {
    const { name, message, category } = req.body;
    const newPost = { 
        id: posts.length, 
        name, 
        message, 
        category, 
        likes: 0 
    };
    posts.push(newPost);
    likes[newPost.id] = 0; // 新しい投稿には「いいね」は0
    res.json({ success: true, post: newPost });
});

// いいねを増加させるエンドポイント
app.post("/like/:id", (req, res) => {
    const id = req.params.id;
    if (likes[id] !== undefined) {
        likes[id]++;
        res.json({ likes: likes[id] });
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

// キーワード検索エンドポイント
app.post("/search", (req, res) => {
    const keyword = req.body.keyword || "";
    const results = posts.filter(post => 
        post.name.includes(keyword) || post.message.includes(keyword)
    );
    res.status(200).json({ results });  // 正しくステータスコードを指定
});

// カテゴリー別投稿を表示するエンドポイント
app.post("/category", (req, res) => {
    const category = req.body.category || "";
    const results = posts.filter(post => post.category === category);
    res.status(200).json({ posts: results });
});

// 投稿一覧を表示
app.post("/show_posts", (req, res) => {
    res.json(posts);
});
// サーバーを起動する部分
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});