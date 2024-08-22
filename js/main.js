
let currentPg = 1;
let offset = 0;

let newDiv = document.createElement("div");
newDiv.id = "gif-section-container"; 
document.getElementById("gif-section").appendChild(newDiv);


function searchGif(){
    const search = document.getElementById("search").value;
    const output = document.getElementById("gif-section-container");

    output.innerHTML = '';

    let url = `http://api.giphy.com/v1/gifs/search?q=${search}&api_key=dY1K0Wk9d0YdMe2EL1fi1RfRwokszF6r&limit=12&offset=${offset}`;
    console.log(search);
    fetch(url)
    .then(result => result.json())
    .then(json =>{

        if(json.data.length > 0 )
            output.style.backgroundColor = "blue";

        for(let data of json.data){
            let img = data.images.fixed_height.url;
            output.innerHTML += 
            `<div class="gif-item">
               <img class="gif-img" src="${img}" alt="${data.title}" />
            </div>`; 
        }

        // handle modal
        document.querySelectorAll(".gif-item").forEach(function(gif){
            gif.addEventListener('click', function(){
                openModal(gif.querySelector(".gif-img").src);
            });
        });

        document.getElementById("pagination-page-num").textContent = `Page ${currentPg}`;

        if(currentPg === 1)
            document.getElementById("prev-button").disabled;
        if(json.pagination.total_count <= offset + 12)
            document.getElementById("next-button").disabled;
    })

}

// functions to open and close modal 

function openModal(url){
    let modal = document.getElementById("gif-modal");
    let modalOverlay = document.getElementById("modal-overlay");
    let zoomedGif = document.getElementById("zoomed-gif");
    let copy = document.getElementById("copy-button");

    modal.style.display = "block";
    modalOverlay.style.display = "block";

    console.log(url);

    zoomedGif.src = url;
    copy.setAttribute("data-url", url);
}

function closeModal(){
    let modal = document.getElementById("gif-modal");
    let modalOverlay = document.getElementById("modal-overlay");

    modal.style.display = "none";
    modalOverlay.style.display = "none";
}

// copying URL to clipboard and alerting

function copyURL(){
    let copy = document.getElementById("copy-button");
    let url = copy.getAttribute("data-url");
    navigator.clipboard.writeText(url).then(function(){
        alert("Gif URL copied");
    }).catch(function(error){
        console.error("error copying URL", error);
    });
}

// close modal when close button is clicked, copying url when copy button is clicked

document.getElementsByClassName("close-button")[0].onclick = closeModal;
document.getElementById("copy-button").addEventListener('click',copyURL);


// updating pagination info

document.getElementById("next-button").addEventListener('click',() => {
    offset += 12; // updating offset to make sure rendering starts at right spot
    currentPg++; // updating page num
    searchGif(); // calling function to render new page
})

document.getElementById("prev-button").addEventListener('click',() => {
    // must make sure we arent on first page
    if(currentPg > 1){
        offset -= 12;
        currentPg--;
        searchGif();
    }
})