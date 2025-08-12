# Yet Another Quiz App (YAQA)
# Simple yet powerfull open-source JSON-based quiz generator

## Introduction
YAQA is a quiz generator written in pure HTML, CSS and jQuery.It's designed to be:

- **Easy to use**
- **Easy to use**
- **Fully static** (no backend required)
- **Local** (all your quizzes are stored localy on your device)

*Future development may include a backend version with cloud or P2P storage for syncing quizzes between devices*

### Supported Quiz Question Types
The following question types are supported at the moment:

- Flashcard: Displays a question on one side and the answer on the other.
- One Line Input: Uses an input field to collect a user's answer.
- True/False: Requires the user to determine if a statement is correct (True) or incorrect (False).
- Multiple Choice: Presents the user with multiple options and requires them to choose the correct answer.

For more information, take a look at the [Example quiz](example.json), you can also use it as a reference while making your own quiz

## Deployment

### Locally on your device

- Clone this repository
- Navigate to the repository `src/` directory
- Open `index.html` in your browser

**Alternative method:**
- Install `http-server` using Python or Node.js
- Run the server inside `src/` directory and access YAQA in your browser

### Persistant Deploy

**Comming soon ...**

## Contributing

To contribute to this repository:

- Fork the repository
- Clone the forked repository to your local machine
- Create a new branch for your contribution
- Make changes, commit, and push to your fork
- Create a pull request to the original repository

Please:
- Follow the existing coding style
- Test new features
- Use commit messages that are meaningful and consistent in style with existing ones
- For new modules, utilize `template.py` and embed configuration instructions directly in the file

## License
YAQA is a free and open-source software and it's released under the terms of the AGPL 3.0.
The full license text is avaliable in the [LICENSE file](LICENSE)
