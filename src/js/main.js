function toggleModal() {
    event.stopPropagation();
    let modal_container = $("#add-modal");
    modal_container.toggle();
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
}

function startQuiz(name) {
    let startScreen = `
        <h2>${name}</h2>
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

        let question = `${index+1}.${obj.question}`;
        let answer = obj.answer;
        let difficulty = obj.difficulty;

        switch (obj.type) {
            case "flashcard":
                $("#quiz-window").html(`
                    <b class="difficulty-indicator ${difficulty}">${difficulty}</b>
                    <h2 id="content">${question}</h2>
                    <button class="btn" id="reveal-btn">Reveal</button>
                    <button id="next-btn" class="next-btn">Skip</button>
                 `);

                $("#reveal-btn").on("click", function(event) {
                    if ($(this).text() === "Reveal") {
                        $("#content").text(answer);
                        $(this).text("Back");
                        $("#next-btn").text("Next →");
                    } else {   
                        $("#content").text(question);
                        $(this).text("Reveal");
                        $("#next-btn").text("Skip");
                    };
                });

                $("#next-btn").on("click", function() {
                    index++;
                    generateQuizQuestion();
                });
                break;

            case "one-line":
                $("#quiz-window").html(`
                    <b class="difficulty-indicator ${difficulty}">${difficulty}</b>
                    <h2>${question}</h2>
                    <input type = "text" id = "quiz-input" placeholder = "Provide answer here...">
                    <button class="btn" id="reveal-btn">Reveal</button>
                    <button id="next-btn" class="next-btn">Skip</button>
                 `);//NOTE: Make it button with
                let quiz_input = $("#quiz-input")

                $("#reveal-btn").on("click", function() {
                    quiz_input.prop("placeholder",answer);   
                });

                quiz_input.on("change", function() {
                    if (quiz_input.val() === answer) {
                        quiz_input.css("border-color", "green");
                        quiz_input.css("box-shadow", "0 0 5px rgba(0, 255, 0, 0.9");
                        $("#next-btn").text("Next →");
                    }else if (quiz_input.val() === "") {
                        quiz_input.removeAttr("style");
                    }else {
                        quiz_input.css("border-color", "red"); 
                        quiz_input.css("box-shadow", "0 0 5px rgba(255, 0, 0, 0.9)");
                        $("#next-btn").text("Skip");
                    };
                });

                $("#next-btn").on("click", function() {
                    index++;
                    generateQuizQuestion();
                });
                break;
            case "true/false":
                $("#quiz-window").html(`
                    <b class="difficulty-indicator ${difficulty}">${difficulty}</b>
                    <h2>${question}</h2>
                    <div class="tf-container">
                    <button class="tf-btn true-btn" id="true-btn">True</button>
                    <button class="tf-btn false-btn" id="false-btn">False</button>
                    </div>
                    <button id="next-btn" class="next-btn">Skip</button>
                 `);//NOTE: Make it button with
                
                if (answer === true) {
                    $("#true-btn").on("click", function() {
                        $("#next-btn").text("Next →");
                        $("#false-btn").addClass("disabled");
                    });
                } else if (answer === false) {
                    $("#false-btn").on("click", function() {
                        $("#next-btn").text("Next →");
                        $("#false-btn").addClass("disabled");
                    });
                } else {
                    alert(`Answer format in question with index: ${index} is incorrect.`);
                    index++;
                    generateQuizQuestion();
                };
                $("#next-btn").on("click", function() {
                    index++;
                    generateQuizQuestion();
                });
                break;
            case "multiple-choice":
                $("#quiz-window").html(`
                    <b class="difficulty-indicator ${difficulty}">${difficulty}</b>
                    <h2>${question}</h2>
                    <div id="mch-container" class="mch-container">
                    </div>
                    <button id="next-btn" class="next-btn">Skip</button>
                 `);
                
                obj.choices.forEach(function(choice, index) {
                    let dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    let letter = dict[index];
                    $("#mch-container").append(`<button id="${letter}-btn">${letter}.${choice}</button>`);

                    if (choice === obj.answer) {
                        $(`#${letter}-btn`).on("click", function() {
                            $(this).css("background-color", "#2BE028");
                            $("#next-btn").text("Next →");
                        });
                    }else {
                        $(`#${letter}-btn`).on("click", function() {
                            $(this).css("background-color", "#FC2E05");
                        });
                    };
                });
                
                $("#next-btn").on("click", function() {
                    index++;
                    generateQuizQuestion();
                });
                break;
            default:
                alert(`Type '${obj.type}' is not supported`); //NOTE: Skipping...
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
