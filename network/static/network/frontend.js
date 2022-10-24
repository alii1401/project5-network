document.addEventListener("DOMContentLoaded", function(){
    // console.log(document.querySelector("#create-post"))

    // document.querySelector("#my-profile").addEventListener("click",() => my_profile())
    document.querySelector("#all-posts").addEventListener("click",() => all_posts())
    document.querySelector("#new-post").addEventListener("click",() => new_post())
    // document.querySelector("#follow").addEventListener("click",() => follow())

    // default 
    all_posts()
});

    function showPost(post_id){
        document.querySelector("#create-post").style.display = 'none';
        // document.querySelector("#posts-profile").style.display = 'block';
        document.querySelector("#posts").style.display = 'none';
        document.querySelector("#profile").style.display = 'block';

        fetch(`posts/${post_id}`)
        .then(response => response.json())
        .then(post => {
            // posts.forEach(post => {
                var div = document.createElement('div');
                
                
                div = `<div> <p> <p> <div style=margin-top:5px>Followers</div><div style=margin-top:10px>1</div> </p>  
                <p> <div style=margin-top:2px> ${post.username} </div><div style=margin-top:7px>113</div> </p>
                <p> <div style=margin-top:5px>Following</div><div style=margin-top:10px>20</div> </p> </p></div> 
                
                
                <div style=margin-bottom:5px;border-style:groove; >
                <div><h4> ${post.title}</h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;

                

                document.querySelector('#profile').innerHTML += div;
                
            // })
        })
    }
    
    function new_post(){
        document.querySelector("#posts").style.display = 'none';
        document.querySelector("#create-post").style.display = 'block';

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
        document.querySelector("#create-post").style.display = 'none';
        // document.querySelector("#posts-profile").style.display = 'block';
        document.querySelector("#profile").style.display = 'none';
        document.querySelector("#posts").style.display = 'block';

        fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            console.log(posts)
            posts.forEach(post => {
                var div = document.createElement('div');
                
                
                div = ` <div style=margin-bottom:5px;border-style:groove; >
                <button class="btn btn-outline-info" id=${post.id}>${post.username}</button>
                <div><h4><code> ${post.title} </code> </h4> </div><div><h6> ${post.body}</h6> </div><div>${post.timestamp}</div> </div>`;

                

                document.querySelector('#posts').innerHTML += div;

                document.addEventListener("click",event =>{
                    const element = event.target;

                    if(element.id == post.id){
                        showPost(post.id);

                    }
                })
                
            })
        })

    }

    