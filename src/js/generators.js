function genFlashcard(question, answer,index, length, difficulty) {
    $("#quiz-window").html(`
        <b class="difficulty-indicator ${difficulty}">${difficulty}</b>
        <b class="question-counter">${index+1}/${length}</b>
        <h2 id="content">${question}</h2>
        <button class="btn" id="reveal-btn">Reveal</button>
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
}

function genOneLine(question, answer,index, length, difficulty) {
    $("#quiz-window").html(`
        <b class="difficulty-indicator ${difficulty}">${difficulty}</b>
        <b class="question-counter">${index+1}/${length}</b>
        <h2>${question}</h2>
        <input type = "text" id = "quiz-input" placeholder = "Provide answer here...">
        <button class="btn" id="reveal-btn">Reveal</button>
        `);
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
}


function genTrueFalse(question, answer,index, length, difficulty) {
    $("#quiz-window").html(`
        <b class="difficulty-indicator ${difficulty}">${difficulty}</b>
        <b class="question-counter">${index+1}/${length}</b>
        <h2>${question}</h2>
        <div class="tf-container">
        <button class="tf-btn true-btn" id="true-btn">True</button>
        <button class="tf-btn false-btn" id="false-btn">False</button>
        </div>
    `);

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
    };
}

function genMultipleChoice(obj, question, answer,index, length, difficulty) {
    $("#quiz-window").html(`
        <b class="difficulty-indicator ${difficulty}">${difficulty}</b>
        <b class="question-counter">${index+1}/${length}</b>
        <h2>${question}</h2>
        <div id="mch-container" class="mch-container">
        </div>
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
}
