async function search() {

   const keyword = document.getElementById("search").value;
   const type = document.getElementById("type").value;
    const response = await fetch(
        `https://api.github.com/search/${encodeURIComponent(type)}?q=${encodeURIComponent(keyword)}`
    );

    const data = await response.json();
    const results = document.getElementById("results");
    if(!response.ok){
        results.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    results.innerHTML = "";
    if(data.items.length==0){
        results.innerHTML+= `<p>Zero search results!!!</p>`
    }

    if(type=="repositories"){
        data.items.forEach(repo => {
            results.innerHTML += `
                <div>
                    <h3>${repo.full_name}</h3>
                    <p>${repo.description ?? "No description"}</p>
                    <a href="${repo.html_url}" target="_blank">
                        Open Repository
                    </a>
                    <hr>
                </div>
            `;
        });
    }
    else{
        data.items.forEach(repo => {
            results.innerHTML += `
                <div>
                    <h3>${repo.login}</h3>
                    <img src="${repo.avatar_url}" width="60">
                    <br>
                    <a href="${repo.html_url}" target="_blank">View Profile</a>
                    <hr>
                </div>
            `;
        });
    }
    ///search end-point must be there which fetches json info from amazon-API
   //const response = await fetch(`/search?keyword=${encodeURIComponent(keyword)}`);



   //const products = await response.json();



   //console.log(products);

}

async function search_contributor(){
    const repo_name = document.getElementById("repo_name").value;
    const result = document.getElementById("results");
    const contri_key = document.getElementById("contri_key").value;
    const data = await fetch(
        `https://api.github.com/users/${contri_key}`
    );
    

    if(!data.ok){
        const json_data = await data.json();
        result.innerHTML = `<p>${json_data.message}</p>`;
        return;
    }

    //checking existance of user as contributor
    let page = 1;
    let found = false;

    while (true) {

        const response = await fetch(
            `https://api.github.com/repos/${repo_name}/contributors?per_page=100&page=${page}`
        );

        const contributors = await response.json();

        if(!response.ok){
            result.innerHTML = `<p>${contributors.message}</p>`;
            return;
        }

        if (contributors.length === 0)
            break;

        found = contributors.some(
            c => c.login.toLowerCase() === contri_key.toLowerCase()
        );

        if (found)
            break;

        if(contributors.length < 100)
            break;

        page++;
    }

    if (found) {
        console.log("Contributor found");
    } else {
        console.log("Contributor not found");
    }

}