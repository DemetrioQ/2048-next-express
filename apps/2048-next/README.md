### Pending features
- [x] Show user ScoreBoard
- [x] Save score locally so that users can enter the page and see their previous best score without authentication
- [x] GameOver logic
- [x] GameOver UI
- [x] New Game Button
- [x] Undo action (with a limit)
- [x] Save curent game state in case of reload so that players continue from where they left of.
- [ ] Record all the moves and tile spawn to send to backend for game validation.
- [ ] Authentication to save score in database
- [ ] Leaderboards (with moves to get to x score?)
 
### Bugs to fix 
- [x] Merging animation not working
- [x] Animations can get canceled if user inputs a lot of movements in a short period of time. This results in the tiles being stuck mid animation
- [x] If tile is on the top of the grid and another tile with the same value in the same column at the bottom of the grid tries to merge by either going up or going down no animation will play and it will just merge the tiles values.
- [x] Diagonal movement spawns only one tile 

