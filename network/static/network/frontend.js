window.onpopstate = (event) => {
    alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
}
    document.addEventListener("DOMContentLoaded", function(){
// console.log(document.querySelector("#create-post"))

// document.querySelector("#my-profile").addEventListener("click",() => my_profile())
document.querySelector("#all-posts").addEventListener("click",() => all_posts())
if (document.querySelector("#new-post") || document.querySelector("#follow")){

document.querySelector("#new-post").addEventListener("click",() => new_post())
document.querySelector("#follow").addEventListener("click",() => following())
}

// default 
all_posts()

document.addEventListener("click",event =>{
            const element = event.target;
            // const name = element.innerHTML
            console.log(`innerhtml:${element.innerHTML}`)
            if(element.id == 'userButton'){
                showProfile(element.innerHTML);

            }

            if(element.id == 'like'){
                const id = element.parentElement.parentElement.id;
                let flag = 0;
                console.log(element.parentElement)
                console.log(id)


                if (element.innerHTML == 'Like' && flag == 0){
                    fetch(`change/${id}/like`,{
                        method:'PUT'
                    })
                    // fetch(`posts/${id}`)
                    // .then(response => response.json())
                    // .then(post =>)
                    element.innerHTML = 'Unlike';
                    let n = parseInt(document.querySelector(`#num${id}`).innerHTML);
                    console.log(n)
                    document.querySelector(`#num${id}`).innerHTML = n + 1;
                    flag = 1;


                }
                else if(element.innerHTML == 'Unlike' && flag != 1){
                    fetch(`change/${id}/unlike`,{
                        method:'PUT'
                    })
                    element.innerHTML = 'Like';
                    let n = parseInt(document.querySelector(`#num${id}`).innerHTML);
                    document.querySelector(`#num${id}`).innerHTML = n - 1;
                    flag = 1;
                }
            }
            if(element.id == 'edit'){
                document.querySelector("#posts").style.display = 'none';
                document.querySelector("#create-post").style.display = 'block'; 
                console.log(element.parentElement.id)

                fetch(`posts/${element.parentElement.id}`)
                .then(response => response.json())
                .then(post => {
                    console.log(post)
                    document.querySelector('#tagh3').innerHTML = 'Edit';
                    document.querySelector("#title").value = post.title;
                    document.querySelector("#body").value = post.body;

                })
                document.querySelector('#new-post-form').onsubmit = function(e){
                    e.preventDefault();
                    
                    fetch(`/posts/${element.parentElement.id}`,{
                        method:'PUT',
                        body:JSON.stringify({
                            title: document.querySelector("#title").value,
                            body: document.querySelector("#body").value,
                        })
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log(result);
                    });
                    location.reload();
                }   
            }
            if(element.id == 'page'){
                changePage(element.parentElement.id)
            }

            if(element.id == 'isFollow'){
                let gf = 0;
                const username = element.parentElement.id;
                let n =parseInt(document.querySelector('#numFollowers').innerHTML);

                // document.querySelector('#isFollow').onclick = () => {
                    // const button = document.querySelector(`#isFollow`)

                    if (element.innerHTML == 'Following' && gf == 0){
                        fetch(`change/${username}/positive`,{
                            method:'PUT'
                        })
                        element.innerHTML = 'UnFollow';

                        n += 1;
                        document.querySelector('#numFollowers').innerHTML = n;


                        gf = 1;

                    }else if (element.innerHTML == 'UnFollow' && gf == 0){

                        fetch(`change/${username}/negative`,{
                            method:'PUT'
                        })
                        element.innerHTML = 'Following';

                        n -= 1;
                        document.querySelector('#numFollowers').innerHTML = n;

                        gf = 1;
                    }
                // } 
            }

            if (element.id == 'nextPageFollow'){
                changePageFollow(element.parentElement.id)
            }

        })
});
function changePageFollow(x){
if (document.querySelector("#create-post")){

document.querySelector("#create-post").style.display = 'none';
}
document.querySelector("#profile").style.display = 'none';

if (document.querySelector('#without-login')){

document.querySelector('#without-login').innerHTML = '';
document.querySelector("#without-login").style.display = 'none';

}

document.querySelector("#posts").style.display = 'block';
document.querySelector('#posts').innerHTML = '';

x = parseInt(x)

let el0 = document.getElementById('page')
let el1 = document.getElementById('previous-page')
let n = 0;
let f = 0;

if(el0){
el0.remove()
}
if(el1){
el1.remove()
}

Promise.all([
fetch(`/posts`).then(response => response.json()),
fetch('posts/give/postLikes').then(response => response.json()),
fetch('posts/people/follow').then(response => response.json()),


]).then(allResponses =>{
const posts = allResponses[0]
const postsLikes = allResponses[1]
const follows = allResponses[2]

posts.forEach(post => {
n += 1;
f  = x+8;
follows.people_follow.forEach(follow => {
if (post.username == follow.username){
    if (n>=x && n<=x+9) {
        
            if(postsLikes.id_likes == ''){

                var div = document.createElement('div');
                if (post.is_active == true){
                        div = ` <div style=margin-bottom:20px;border-style:groove; >
                        <p style=text-align:left>
                    <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                    <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                    <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              

                    document.querySelector('#posts').innerHTML += div;
                    }else{

                        div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                        document.querySelector('#posts').innerHTML += div;
                    }

            }
            if(postsLikes && postsLikes.id_likes){

                let flag = 0;
                postsLikes.id_likes.forEach(postlike => {


                    console.log(post.likes)
                    console.log(`postLike:${postlike.id}`)
                    var div = document.createElement('div');

                    if(postlike.id == post.id && flag == 0){
                        if (post.is_active == true){
                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                            <p style=text-align:left>
                        <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                        <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                        <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
    
                        document.querySelector('#posts').innerHTML += div;
                        }else{
                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Unlike</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                            document.querySelector('#posts').innerHTML += div;

                        }
                        flag = 1;

                    }else if (postlike.id != post.id && flag == 0) {
                        if (post.is_active == true){
                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                            <p style=text-align:left>
                        <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                        <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                        <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                        <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
    
                        document.querySelector('#posts').innerHTML += div;
                        }else{

                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                            document.querySelector('#posts').innerHTML += div;
                        }

                        flag = 1;

                    }
                
                })
            }
        // }
    }
}
})
let y = 0;
// let num = 0;

if( n == x+10){
// x += 1;
var pack = document.createElement('div');
y = x + 10;
pack = ` <div> <span ><p class='text-right' id='${y}'> <button class='btn btn-primary' id='nextPageFollow'>next page</button></p> <span> </div> `
document.querySelector('#content').innerHTML += pack

// num = (2*x) + 10;
    
if ( n >= x + 10 && n >= 21 ){
    var pack1 = document.createElement('div');
    y = x - 10;

    pack1 = ` <div> <span ><p class='text-left' id='${y}'> <button class='btn btn-primary' id='nextPageFollow'>previous page</button></p> <span> </div> `
    document.querySelector('#content').innerHTML += pack1
}

}
})
if (n >= x && n <= x+9 ){
var pack = document.createElement('div');
y = x - 10;

pack = ` <div> <span ><p class='text-left' id='${y}'> <button class='btn btn-primary' id='nextPageFollow'>previous page</button></p> <span> </div> `
document.querySelector('#content').innerHTML += pack
}
})

}

function changePage(x){
if (document.querySelector("#create-post")){

    document.querySelector("#create-post").style.display = 'none';
}
document.querySelector("#profile").style.display = 'none';
document.querySelector('#without-login').innerHTML = '';

document.querySelector("#posts").style.display = 'block';
document.querySelector('#posts').innerHTML = '';

x = parseInt(x)

let el0 = document.getElementById('page')
let el1 = document.getElementById('previous-page')
let n = 0;
let f = 0;

if(el0){
    el0.remove()
}
if(el1){
    el1.remove()
}

Promise.all([
        fetch(`/posts`).then(response => response.json()),
        fetch('posts/give/postLikes').then(response => response.json())  
 ]).then(allResponses =>{
    const posts = allResponses[0]
    const postsLikes = allResponses[1]
 
    
    console.log(x)
    posts.forEach(post => {
        n += 1;
        f  = x+8;
        if (n>=x && n<=x+9) {

            var div = document.createElement('div');
                div = ` <div style=margin-bottom:20px;border-style:groove; >
                    <div>${post.username}</div>
                    <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              

                    document.querySelector('#without-login').innerHTML += div;

                if(postsLikes.id_likes == ''){
                    if (document.querySelector('#without-login')){

                        document.querySelector('#without-login').innerHTML = '';
                        document.querySelector("#without-login").style.display = 'none';

                    }
                    var div = document.createElement('div');
                    if (post.is_active == true){
                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                            <p style=text-align:left>
                        <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                        <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                        <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
    
                        document.querySelector('#posts').innerHTML += div;
                        }else{

                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                                    <p style=text-align:left>
                                <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                                <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                                </p>
                                <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
            
                            document.querySelector('#posts').innerHTML += div;
                        }

                }
                if(postsLikes && postsLikes.id_likes){
                    if (document.querySelector('#without-login')){

                        document.querySelector('#without-login').innerHTML = '';
                        document.querySelector("#without-login").style.display = 'none';

                    }
                    let flag = 0;
                    postsLikes.id_likes.forEach(postlike => {
    
    
                        console.log(post.likes)
                        console.log(`postLike:${postlike.id}`)
                        var div = document.createElement('div');
    
                        if(postlike.id == post.id && flag == 0){
                            if (post.is_active == true){
                                div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                            document.querySelector('#posts').innerHTML += div;
                            }else{
                                div = ` <div style=margin-bottom:20px;border-style:groove; >
                                    <p style=text-align:left>
                                <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                                <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Unlike</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                                </p>
                                <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
            
                                document.querySelector('#posts').innerHTML += div;
    
                            }
                            flag = 1;
    
                        }else if (postlike.id != post.id && flag == 0) {
                            if (post.is_active == true){
                                div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                            document.querySelector('#posts').innerHTML += div;
                            }else{
    
                                div = ` <div style=margin-bottom:20px;border-style:groove; >
                                    <p style=text-align:left>
                                <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                                <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                                </p>
                                <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
            
                                document.querySelector('#posts').innerHTML += div;
                            }

                            flag = 1;
    
                        }
                    
                    })
                }
            // }
        }
        let y = 0;
        // let num = 0;

        if( n == x+10){
        // x += 1;
            var pack = document.createElement('div');
            y = x + 10;
            pack = ` <div> <span ><p class='text-right' id='${y}'> <button class='btn btn-primary' id='page'>next page</button></p> <span> </div> `
            document.querySelector('#content').innerHTML += pack

            // num = (2*x) + 10;
                
            if ( n >= x + 10 && n >= 21 ){
                var pack1 = document.createElement('div');
                y = x - 10;

                pack1 = ` <div> <span ><p class='text-left' id='${y}'> <button class='btn btn-primary' id='page'>previous page</button></p> <span> </div> `
                document.querySelector('#content').innerHTML += pack1
            }
            
    }
    })
        if (n >= x && n <= x+9 ){
            var pack = document.createElement('div');
            y = x - 10;

            pack = ` <div> <span ><p class='text-left' id='${y}'> <button class='btn btn-primary' id='page'>previous page</button></p> <span> </div> `
            document.querySelector('#content').innerHTML += pack
        }
})

}

function showProfile(name){

    let flag = 0;
    let parcham = 0;
    document.querySelector("#create-post").style.display = 'none';
    if (document.querySelector('#without-login')){

        document.querySelector('#without-login').innerHTML = '';
}
    document.querySelector("#posts").style.display = 'none';
    document.querySelector("#profile").style.display = 'block';
    document.querySelector('#profile').innerHTML = '';

    let el0 = document.getElementById('page')
    let el1 = document.getElementById('previous-page')

if(el0){
    el0.remove()
}
if(el1){
    el1.remove()
}

Promise.all([
        fetch(`/posts`).then(response => response.json()),
        fetch('posts/people/follow').then(response => response.json()),
        fetch('posts/give/postLikes').then(response => response.json())
 ]).then(allResponses =>{
    const posts = allResponses[0]
    const follows = allResponses[1]
    const postsLikes = allResponses[2]

        posts.forEach(post => {
            if(post.username == name){
                
                var div1 = document.createElement('div');
                if(postsLikes.id_likes == ''){

var div = document.createElement('div');
if (post.is_active == true){
        div = ` <div style=margin-bottom:20px;border-style:groove; >
        <p style=text-align:left>
    <button class="btn btn-outline-info" id=userButton>${post.username}</button>
    <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
    <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              

    document.querySelector('#profile').innerHTML += div;
    }else{

        div = ` <div style=margin-bottom:20px;border-style:groove; >
                <p style=text-align:left>
            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
            </p>
            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              

        document.querySelector('#profile').innerHTML += div;
    }

}
                if (flag == 0){
                    var div0 = document.createElement('div');

                    if (post.is_active == true){
                        div0 = `<p class='text-center'>${post.username}</p> <p class='text-center'> 
                         </p> 
                    <p style=text-align:left> Followers <span style=float:right > Following </span> </p>
                    <p style=text-align:left;margin-left:15px;> ${post.followers} <span style=float:right;margin-right:25px;> ${post.following} </span> </p>
                    <hr>` 

                    document.querySelector('#profile').innerHTML = div0
                    flag = 1
                    }else{

                        div0 = `<div><p class='text-center'>${post.username}</p> <p id='${post.username}' class='text-center'> 
                                <button class='btn btn-outline-success' id='isFollow'>Following</button> </p> 
                            <p style=text-align:left> Followers <span style=float:right > Following </span> </p>
                            <p style=text-align:left;margin-left:15px;><span id='numFollowers'>${post.followers}</span><span style=float:right;margin-right:25px; ><span id='numFollowing'>${post.following}</span></span> </p>

                                </div>
                            <hr>`
                            
                            document.querySelector('#profile').innerHTML = div0
                            flag = 1

                            follows.people_follow.forEach(follow => {
                                console.log(follow.username)
                                if(post.username == follow.username && parcham != 1){
                                    div0 = `<p class='text-center'>${post.username}</p> <p id='${post.username}' class='text-center'> 
                                    <button class='btn btn-outline-success' id='isFollow'>UnFollow</button> </p> 
                                    <p style=text-align:left> Followers <span style=float:right > Following </span> </p>
                                    <p style=text-align:left;margin-left:15px;> <span id='numFollowers'>${post.followers}</span> <span style=float:right;margin-right:25px; ><span id='numFollowing'>${post.following}</span> </span> </p>

                                    <hr>`
                        
                                    document.querySelector('#profile').innerHTML = div0
                                    flag = 1

                                    parcham = 1;
                                    
                                }

                            })

                    }

                }

                if(postsLikes && postsLikes.id_likes){
                
                let flag = 0;
                postsLikes.id_likes.forEach(postlike => {

                    var div = document.createElement('div');

                    if (post.is_active == true && flag == 0){
                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                            <p style=text-align:left>
                        <h4>${post.username}</h4>
                        <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                        <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
    
                        document.querySelector('#profile').innerHTML += div;

                        flag = 1;
                        }

                    if(postlike.id == post.id && flag == 0){
                        
                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                                    <h4>${post.username}</h4>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Unlike</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                            document.querySelector('#profile').innerHTML += div;

                        flag = 1;

                    }else if (postlike.id != post.id && flag == 0){
                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                                    <h4>${post.username}</h4>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                            document.querySelector('#profile').innerHTML += div;

                        flag = 1;

                    }
                
                })
            }
            }
            
        })
 })         

}

function new_post(){
document.querySelector("#posts").style.display = 'none';
document.querySelector("#create-post").style.display = 'block';
if(document.querySelector('#page')){
    document.querySelector('#page').remove()
}

document.querySelector('#new-post-form').onsubmit = function(e){
    e.preventDefault();
    
    console.log("doc")
    console.log(document.querySelector("#body").value)
    
    fetch('/posts',{
        method:'POST',
        body:JSON.stringify({
            title: document.querySelector("#title").value,
            body: document.querySelector("#body").value,
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    });
    location.reload();
}
// Clear out fields
document.querySelector("#title").value = '';
document.querySelector("#body").value = '';
}
function all_posts(){
if (document.querySelector("#create-post")){
    
    document.querySelector("#create-post").style.display = 'none';
}
document.querySelector("#profile").style.display = 'none';
document.querySelector("#posts").style.display = 'block';
document.querySelector('#posts').innerHTML = '';


if(document.querySelector('#page')){
    document.querySelector('#page').remove()
}


Promise.all([
        fetch(`/posts`).then(response => response.json()),
        fetch('posts/give/postLikes').then(response => response.json())  
 ]).then(allResponses =>{
    const posts = allResponses[0]
    const postsLikes = allResponses[1]
    let x = 0;
    
    posts.forEach(post => {
        let t = 0;
        x += 1;
        if(x <= 10){

                var div = document.createElement('div');
                div = ` <div style=margin-bottom:20px;border-style:groove; >
                    <div>${post.username}</div>
                    <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              

                    document.querySelector('#without-login').innerHTML += div;

            if(postsLikes.id_likes == '' && t == 0){
                if (document.querySelector('#without-login')){

                    document.querySelector('#without-login').innerHTML = '';
                }

                var div = document.createElement('div');
                if (post.is_active == true){
                        div = ` <div style=margin-bottom:20px;border-style:groove; >
                        <p style=text-align:left>
                    <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                    <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                    <span id='numberLikes' style=float:right;margin-right:10px;>Likes: <span id='num${post.id}'>${post.likes}</span></span>
                    <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              

                    document.querySelector('#posts').innerHTML += div;
                    }else{

                        div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                        document.querySelector('#posts').innerHTML += div;
                    }
                    t = 1;

            }
            if(postsLikes && postsLikes.id_likes && t==0){
                if (document.querySelector('#without-login')){

                    document.querySelector('#without-login').innerHTML = '';
                    }
                let flag = 0;
                postsLikes.id_likes.forEach(postlike => {
                    if (post.is_active == true && flag == 0){
                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                            <p style=text-align:left>
                        <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                        <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                    <span id='numberLikes' style=float:right;margin-right:10px;>Likes: <span id='num${post.id}'>${post.likes}</span></span>
                        <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
    
                        document.querySelector('#posts').innerHTML += div;
                        flag = 1;
                        }

                    console.log(post.likes)
                    console.log(`postLike:${postlike.id}`)
                    console.log(post.id)
                    var div = document.createElement('div');

                    if(postlike.id == post.id && flag == 0){
                        // if (post.is_active == true){
                        //     div = ` <div style=margin-bottom:20px;border-style:groove; >
                        //     <p style=text-align:left>
                        // <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                        // <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                        // <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
    
                        // document.querySelector('#posts').innerHTML += div;
                        // }else{
                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Unlike</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                            document.querySelector('#posts').innerHTML += div;

                        // }
                        flag = 1;

                    }else if (postlike.id != post.id && flag == 0){
                        // if (post.is_active == true){
                        //     div = ` <div style=margin-bottom:20px;border-style:groove; >
                        //     <p style=text-align:left>
                        // <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                        // <span id='${post.id}'><button class='btn btn-warning' id='edit'>Edit</button></span></p>
                        // <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
    
                        // document.querySelector('#posts').innerHTML += div;
                        // }else{

                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
        
                            document.querySelector('#posts').innerHTML += div;
                        // }
                        flag = 1;

                    }
                
                })
                t = 1;
            }
        }

        var pack = document.createElement('div');
        if( x == 11){

            pack = ` <div style=text-align:bottom-right;> <span ><p class='text-right' id='${x}'> <button class='btn btn-primary' id='page'>next page</button> <span> </p></div> `;
            document.querySelector('#content').innerHTML += pack   
    }
    
})
})

}

function following(){

document.querySelector("#create-post").style.display = 'none';
        // document.querySelector("#posts-profile").style.display = 'block';
document.querySelector("#profile").style.display = 'none';
if (document.querySelector('#without-login')){

    document.querySelector('#without-login').innerHTML = '';
    // document.querySelector('#without-login').style.display = '';
}
document.querySelector("#posts").style.display = 'block';
document.querySelector('#posts').innerHTML = '';

if(document.querySelector('#page')){
    document.querySelector('#page').remove()
}

Promise.all([
        fetch(`/posts`).then(response => response.json()),
        fetch('posts/people/follow').then(response => response.json()) ,
        fetch(`posts/give/postLikes`).then(response => response.json())
 ]).then(allResponses =>{
    const posts = allResponses[0]
    const follows = allResponses[1]
    const postsLikes = allResponses[2]
    let x = 0;

posts.forEach(post => {
        
        follows.people_follow.forEach(follow => {
            if (post.username == follow.username){
                x += 1;
                if (x <= 10){

                    var div = document.createElement('div');
                    if(postsLikes.id_likes == ''){
                    var div = document.createElement('div');

                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                                    <p style=text-align:left;>
                                <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                                <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                                </p>
                                <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              
            
                            document.querySelector('#posts').innerHTML += div;
                    }
                    let flag = 0;
                    postsLikes.id_likes.forEach(postlike => {


                    console.log(post.likes)
                    console.log(`postLike:${postlike.id}`)
                    var div = document.createElement('div');

                    if(postlike.id == post.id && flag == 0){
                            div = ` <div style=margin-bottom:20px;border-style:groove;>
                                <p style=text-align:left;>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Unlike</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              

                            document.querySelector('#posts').innerHTML += div;
                            flag = 1;
                    }else if (postlike.id != post.id && flag == 0){

                            div = ` <div style=margin-bottom:20px;border-style:groove; >
                                <p style=text-align:left;>
                            <button class="btn btn-outline-info" id=userButton>${post.username}</button>
                            <span id='${post.id}'><span id=${post.username} style=float:right;margin-right:10px;><button id='like' class='btn btn-dark'>Like</button><span id='numberLikes'>Likes: <span id='num${post.id}'>${post.likes}</span></span></span></span>
                            </p>
                            <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;              

                            document.querySelector('#posts').innerHTML += div;
                            flag = 1;

                    }

                    })
                }
                            
            }

        })
    // }
    var pack = document.createElement('div');
        if( x == 11){

            pack = ` <div style=text-align:bottom-right;> <span ><p class='text-right' id='${x}'> <button class='btn btn-primary' id='nextPageFollow'>next page</button> <span> </p></div> `;
            document.querySelector('#content').innerHTML += pack   
    }
})

 })
}

    