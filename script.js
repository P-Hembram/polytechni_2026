let questions = [];

async function loadQuestions(){

    const response =
    await fetch("questions.json");

    questions =
    await response.json();

    renderQuestions(questions);

    updateProgress();
}

function renderQuestions(data){

    const quiz =
    document.getElementById("quiz");

    quiz.innerHTML = "";

    data.forEach(q=>{

        const box =
        document.createElement("div");

        box.className =
        "question-box";

        let html =
        `<h3>${q.id}. ${q.question}</h3>`;

        q.options.forEach((opt,index)=>{

            html += `
            <button
            class="option"
            onclick="saveAnswer(${q.id},${index})"
            id="q${q.id}_${index}">
            ${opt}
            </button>`;
        });

        box.innerHTML = html;

        quiz.appendChild(box);

        restoreAnswer(q);
    });
}

function saveAnswer(id,selected){

    localStorage.setItem(
        "mcq_"+id,
        selected
    );

    const q =
    questions.find(x=>x.id===id);

    restoreAnswer(q);

    updateProgress();
}

function restoreAnswer(q){

    q.options.forEach((o,index)=>{

        const btn =
        document.getElementById(
        `q${q.id}_${index}`);

        if(btn){
            btn.classList.remove(
            "correct",
            "wrong");
        }
    });

    const saved =
    localStorage.getItem(
    "mcq_"+q.id);

    if(saved===null) return;

    const selected =
    parseInt(saved);

    if(selected===q.answer){

        document
        .getElementById(
        `q${q.id}_${selected}`)
        ?.classList.add("correct");

    }else{

        document
        .getElementById(
        `q${q.id}_${selected}`)
        ?.classList.add("wrong");

        document
        .getElementById(
        `q${q.id}_${q.answer}`)
        ?.classList.add("correct");
    }
}

function updateProgress(){

    let answered = 0;

    questions.forEach(q=>{

        if(
        localStorage.getItem(
        "mcq_"+q.id
        )!==null){

            answered++;
        }
    });

    document.getElementById(
    "progress").innerHTML =
    `Answered: ${answered} / ${questions.length}`;
}

// function filterQuestions(){

//     const text =
//     document.getElementById(
//     "search").value.toLowerCase();

//     const filtered =
//     questions.filter(q=>

//     q.question
//     .toLowerCase()
//     .includes(text));

//     renderQuestions(filtered);
// }

function resetAnswers(){

    if(confirm(
    "Delete all saved answers?"
    )){

        questions.forEach(q=>{

            localStorage.removeItem(
            "mcq_"+q.id);
        });

        renderQuestions(questions);

        updateProgress();
    }
}

loadQuestions();