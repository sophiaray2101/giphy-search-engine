let selectedAnswers = {};
const answers = {
    1: ["Deep Blue Sea", "Jaws", "The Meg", "Sharnado"],
    2: ["Chronicles of Narnia", "Lord of the Rings", "Harry Potter", "Fantastic Beasts and Where to Find Them"],
    3: ["Poseidon", "Titanic", "The Perfect Storm", "Pirates of the Caribbean"],
    4: ["Mary Poppins", "Sound of Music", "Bedknobs and Broomsticks", "Chitty Chitty Bang Bang"],
    5: ["Thor Ragnarok", "Avengers Infinity War", "Iron Man 2", "Avengers End Game"]
}
const correctAnswers = {
    1: "Jaws",
    2: "Harry Potter",
    3: "Titanic",
    4: "Mary Poppins",
    5: "Avengers End Game"
}



function createQuiz(url, num){
    let output = '<section class="quiz-question">';

    output += `<img class="quiz-images" src=${url} alt="Gif img" />`;
    output += '<section class="quiz-answers">';
    for(let item in answers[num]){
        output += `<div class="quiz-answer-options" data-question="${num}" data-answer="${item}">${answers[num][item]}</div>`;
    }
    output += '</section></section>';
    return output;
}

function renderQuiz(){
    const section = document.getElementById("quiz-section-container");
    section.style.backgroundColor = "lightgoldenrodyellow";

    section.innerHTML = "<div id=quiz-title>Guess the Movie: click an answer option below</div>";

    const queries = ["jaws", "harry potter scene", "titanic", "Mary Poppins movie", "iron man snap"];

    const fetchPromises = queries.map(query =>{
        const url = `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=dY1K0Wk9d0YdMe2EL1fi1RfRwokszF6r&limit=1&offset=2`;
        return fetch(url)
        .then(result=> result.json())
        .then(json =>{
            return json.data[0].images.fixed_height.url;
        });
    });

    Promise.all(fetchPromises)
    .then(result =>{
       gifUrls = result;

       let output = "";
       let count = 1;
       for(let index in gifUrls){
           output += createQuiz(gifUrls[index], count);
           count++;
       }
      // console.log(output);
       output += '<div id="result"></div>';
       section.innerHTML += output;

       const answerOptions = document.querySelectorAll(".quiz-answer-options");
       answerOptions.forEach(option =>{
           option.addEventListener('click', function(){
               const questNum = this.getAttribute('data-question');
               selectAnswer(questNum, this);
           });
       });

    })
    .catch(error => console.log("error loading gifs", error));


}

function displayScore(){
    let score = 0;

    for(let question in selectedAnswers){
        if(selectedAnswers[question].textContent.trim() === correctAnswers[question])
            score++;
    }
    const results = document.getElementById("result");
    if(!results)
        console.log("no result found");
    results.textContent = `Your score is ${score} out of 5! Refresh page to play again`; 
}

function checkCompleteQuiz(){
    const answeredQs = Object.keys(selectedAnswers).length;

    if(answeredQs === 5)
        displayScore();
}


function selectAnswer(questionNum, selected){
    if(selectedAnswers[questionNum]) // question already has answer
        return;

    selectedAnswers[questionNum] = selected;

    const options = document.querySelectorAll(`.quiz-answer-options[data-question="${questionNum}]"`);
    options.forEach(option =>{
        option.classList.add('disabled');
        option.style.pointerEvents = 'none';
    });

    selected.classList.add('selected');

    checkCompleteQuiz();
}



