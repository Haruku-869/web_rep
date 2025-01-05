"use strict"
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

let posts = []; 
let likes = {}; 

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("index", { posts });
});


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
    likes[newPost.id] = 0; 
    res.json({ success: true, post: newPost });
});


app.post("/like/:id", (req, res) => {
    const id = req.params.id;
    if (likes[id] !== undefined) {
        likes[id]++;
        res.json({ likes: likes[id] });
    } else {
        res.status(404).json({ error: "Post not found" });
    }
});

// キーワード検索
app.post("/search", (req, res) => {
    const keyword = req.body.keyword || "";
    const results = posts.filter(post => 
        post.name.includes(keyword) || post.message.includes(keyword)
    );
    res.status(200).json({ results });  // 正しくステータスコードを指定
});

// カテゴリー別投稿
app.post("/category", (req, res) => {
    const category = req.body.category || "";
    const results = posts.filter(post => post.category === category);
    res.status(200).json({ posts: results });
});

// 投稿一覧
app.post("/show_posts", (req, res) => {
    res.json(posts);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});