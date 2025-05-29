### Pending features
- [x] Show user ScoreBoard
- [x] Save score locally so that users can enter the page and see their previous best score without authentication
- [x] GameOver logic
- [x] GameOver UI
- [x] New Game Button
- [x] Undo action (with a limit)
- [x] Save curent game state in case of reload so that players continue from where they left of.
- [x] Record all the moves and tile spawn to send to backend for game validation.
- [x] Authentication to save score in database
- [ ] Leaderboards (with moves to get to x score?)
 
### Bugs to fix 
- [x] Merging animation not working
- [x] Animations can get canceled if user inputs a lot of movements in a short period of time. This results in the tiles being stuck mid animation
- [x] If tile is on the top of the grid and another tile with the same value in the same column at the bottom of the grid tries to merge by either going up or going down no animation will play and it will just merge the tiles values.
- [x] Diagonal movement spawns only one tile 
- [ ] When you are logged in and submit a score you can refresh the page and use undos (if have any left). Possible solutions: On submit  set the amounts of undosLeft to 0. After submitting score just restart the board.
- [x] When you use oath to login and press cancel or any other type of failure the pop up will redirect to the normal page inside the pop up so you will have two pages with the board. It should close and send an error toast.
- [x] When using oauth if the user clicks any option and closes the pop up and then clicks any other options (repeat x times) it will show the toast message for the corresponding option x times Ex. i press auth with google and close the window three times and then auth with github, It will show 3 toast messages of successful auth with google and one with guthub
- [ ] When redirecting user after validation email it is not checking if the user is logged in. This causes the login modal to be shown to a logged in user.
- [ ] Game is not valid try playing a fresh game error.  Possible the seed is changing. maybe its better to generate everything on the backend 


