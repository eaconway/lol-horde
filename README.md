# Last Explorer

Welcome to the Last Explorer (Previously LoL-Horde)!
Link to Website: [Last Explorer](https://lastexplorer.netlify.com/)

# Background and Overview
Last Explorer is an interactive game where a user is tasked to get rid of all of the enemies before moving onto the next level. The idea is to clear the level being killed by the enemies. All combatants will have access to guns (ranged) or can kill you by touch (melee).

The game is called LoL: Horde Mode because the character will be a league of legends character head shooting other characters in the game.

The main player can move around as much as they like within the level. They're able to jump on platforms around the map, but so are the enemies. As the levels progress, more enemies will come to attack you.

Overall, I wanted a project that would really challenge my abilities in a new way, but also one that fit my interests. This game combines some interesting aspects from a few different games overall, the main 2 being: player movements and platforms, shooting/touch death animations.

# Functionality and MVP Features
- Users exists, can move, and jump
- Level is created with platforms
- User can shoot projectiles
- User can kill/be killed by enemies
- User can complete a level and choose to move onto another level (or stay)
- Enemies can shoot and can target the user

# Wireframe
Saved in file tree above as Lol_Horde.png

# Architecture and Technologies

In order to get the project up and running, I'll be implementing the following technologies:
- Vanilla JS for overall structure and logic
- HTML5 Canvas for DOM manipulation and rendering
- Webpack to bundle and serve up the various scripts
- Bonus:

There will be a few primary files:
- Map: this will house all pieces from players, to enemies
- Levels: this file will house different configurations of the map, inserting different platforms where needed
- Player: this file will manage how a player moves and interacts with the game
- Enemies: this file will manage how enemies interact with the game and player

# Implementation Timeline
Day 1 (Tues): Canvas exists, User exists, enemies exist. User can move.
Day 2 (Wed): User can shoot projectiles, Enemies can shoot projectiles, User can be killed/kill enemies, User and enemies can die
Day 3 (Thurs): User can complete a level and move onto then next level, map is populated with platforms
Day 4 (Fri): User can jump, fall. Enemies follow user.
Day 5 (Sat): Fix bugs with enemies/player. Allow players to swap option for character. Finish UI details (Start/Stop button, enemies remaining, etc)
Day 6 (Sun): Any extra lingering things 
