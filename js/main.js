

function searchGif(){
    let newDiv = document.createElement("div");
    newDiv.id = "gif-section-container"; 
    document.getElementById("gif-section").appendChild(newDiv);
    
    const search = document.getElementById("search").value;
    const output = newDiv;

    let url = `http://api.giphy.com/v1/gifs/search?q=${search}&api_key=dY1K0Wk9d0YdMe2EL1fi1RfRwokszF6r&limit=12&offset=0`;
    console.log(search);
    fetch(url)
    .then(result => result.json())
    .then(json =>{

        for(let data of json.data){
            let img = data.images.fixed_height.url;
            output.innerHTML += 
            `<div class="gif-item">
               <img class="gif-img" src="${img}" alt="${data.title}" />
            </div>`;

        }
    })

    document.getElementById("search").value = "";
}