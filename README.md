# Quiz with Session

Create a quiz with multiple choice questions. Allow the user to save their progress using `session storage`, so that they can resume the quiz later if they need to leave the page. When the user completes the quiz, store their score in `local storage` and display it on the page.

# Instructions

- Questions are already given to you and shown on the screen.
- Whenever user selects an option, save the options in the `session storage` with key `progress`
- If a user refreshes the page, the options should still be there
- When user clicks on submit, show `Your score is <score> out of 5.`
- Also store the score in `localstorage` with the key `score`
