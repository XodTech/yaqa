function toggleModal() {
    event.stopPropagation();
    let modal_container = $("#add-modal"); modal_container.toggle();
}

function closeModal() {
    let modal_container = $("#add-modal");
    modal_container.hide();
};

$(document).on("click", function(event) {
  if ($(event.target).closest("#add-modal").length === 0 && $("#add-modal").is(":visible")) {
    closeModal();
  };
});

$(document).on("keydown", function(event) {
  if ( event.key === "Escape" && $("#add-modal").is(":visible")) {
    closeModal();
  };
});

function handleSubmit() {
    let name_input = $("#name-input");
    let json_textarea = $("#json-textarea");
    let name = name_input.val();
    let jsonContent = json_textarea.val();
    
    // Preventing script injection (beta)
    const pattern = /<[^>]*>/g;
    name = name.replace(pattern, "");
    // json_content = json_content.replace(pattern, replacement);
    if ( jsonContent.match(pattern) ) {
        if ( !confirm("HTML tag(s) were found in your quiz.Continue only if you trust authors of this quiz?") ) {
            return;
        };
    };

    if (name.trim() === "") {
        alert("Quiz name is incorrect");
        return;
    }

    if (jsonContent.trim() === "" || jsonContent.trim() === "[]" || jsonContent.trim() === "{}") {
        alert("Quiz JSON can't be empty");
        return;
    }
    //NOTE: Promt before overwritting
    localStorage.setItem(name,jsonContent);
    
    name_input.val("");
    json_textarea.val("");
    fetchQuizList();
    closeModal();
}

function handleFileInput(event) {
    let file = event.target.files[0];
    if (file.type !== "application/json") {
        alert("Please select a JSON file.");
        return;
    };
    let reader = new FileReader();

    reader.onload = function(e) {
        let fileContent = e.target.result;

        let json_textarea = $("#json-textarea");
        json_textarea.val(fileContent);
        $(event.target).val("");
    };
    reader.readAsText(file);
};

function fetchQuizList() {
    let list = Object.keys(localStorage);
    $("#quiz-list").empty();
    for (let name of list) {
        $("#quiz-list").append(`

        <div class="quiz-item">
            <span class="name">${name}</span>
            <span class="delete">&times;</span>
        </div>

        `);
    };
    quizItemLogic();
}

function quizItemLogic() {
    $(".delete").on("click", function(){
        event.stopPropagation();
        let quizName = $(this).parent().find(".name").text();
        deleteQuiz(quizName);
    });
    
    $(".quiz-item").on("click", function(){
        let quizName = $(this).children(".name").text();
        startQuiz(quizName) //NOTE: Mb name it gen or begin
    });
}

function deleteQuiz(name) {
    if (confirm(`Are you sure you want to delete: ${name} ?`)) {
        localStorage.removeItem(name);
        fetchQuizList();
    }
    if ( name == $("#quiz-name").text() ) {
        $("#quiz-window").empty();
    }
}

function startQuiz(name) {
    let startScreen = `
        <h2 id="quiz-name">${name}</h2>
        <button class = "btn" id = "begin-btn">Begin</button>
    `;
    $("#quiz-window").html(startScreen);
    $("#begin-btn").on("click", function(){
        quizHandler(name);
    });
}

function quizHandler(name) {
    $("#quiz-window").empty(); //NOTE: Consider deleting this line
    let quizContent = localStorage.getItem(name);

    let quizJson = JSON.parse(quizContent);
    let index = 0;

    function generateQuizQuestion() {
        if (index >= quizJson.length) {
            endQuiz();
            return;
        }

        let obj = quizJson[index];

        function spawnNextBtn() {
            $("#quiz-window").append(`
                <button id="next-btn" class="next-btn">Skip</button>
            `)
            $("#next-btn").on("click", function() {
                index++;
                generateQuizQuestion();
            });
        }

        switch (obj.type) {
            case "flashcard":
                genFlashcard(quizJson, index);
                spawnNextBtn();
                break;

            case "one-line":
                genOneLine(quizJson, index);
                spawnNextBtn();
                break;
            case "true/false":
                genTrueFalse(quizJson, index);
                spawnNextBtn();
                break;
            case "multiple-choice":
                genMultipleChoice(quizJson, index);
                spawnNextBtn();
                break;
            default:
                alert(`Type '${obj.type}' is not supported`);
                index++;
                generateQuizQuestion();
        };
    };
    generateQuizQuestion();
}

function endQuiz() {
    $("#quiz-window").empty()
    alert("Quiz completed!");
}
