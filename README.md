# Covidiots
BCIT COMP 4952 HCI Course Project 
### Project Overview
Covidiots 19 is an innovative team-based resource survival game that challenges players to strategize, cooperate, and adapt to survive in a world ravaged by a fictional COVID-19 outbreak. The game combines elements of survival, infection, and strategy to create an engaging and competitive multiplayer experience.
## Project Description
### Lobby Screen 
![image](https://github.com/annayujeong/Covidiots/assets/64446306/3249374f-049c-47d6-8c5e-fb266acf8466)
- Start button (only for the host)
- Mode selection (only for the host)
- Lobby chat to chat with players before starting the game
- Ready button for each player
- Join button for each player so you can join the player roster

### In-Game Environment
![image](https://github.com/annayujeong/Covidiots/assets/64446306/9cc3e702-e3d4-47fc-8a99-26c600351ec2)
![image](https://github.com/annayujeong/Covidiots/assets/64446306/590bf7bd-d0bf-457f-a651-a8d435b33f53)
- A grid-based, image-based art-style map with rooms and corridors.
- Player character represented by a image and a red indicator.
- Simple graphical elements for displaying resources.
- Moving between rooms is as simple as using the W/A/S/D keys or Arrow keys.
- Pressing the spacebar initiates interactions, like entering through a door, or gathering resources.
- When the player interacts with an item (e.g., a food, water container), show a text progress bar under the character. The progress bar represents the time it takes to gather the resource.
- A message appears when the resource is successfully gathered, updating players inventory.

### Inventory HUD
![image](https://github.com/annayujeong/Covidiots/assets/64446306/7a000b44-f6b6-4eb4-a57f-68968a676ab9)
- When the player presses 'Q', display a simple inventory screen.
- List the collected items (e.g., Food, Water, Mask, Vaccine, Booster Shot).
- Allow the player to select items for use or discard.
- When a player presses a number key respective to the order of the player’s items, it will consume that item (pressing 2 will consume inventory slot 2 if an item exists)

### Player Stats HUD
![image](https://github.com/annayujeong/Covidiots/assets/64446306/ad101441-4372-48fc-87f6-11edc69317eb)
- When the player presses 'E', show a screen displaying player stats.
- Display player stats (e.g., Hunger, Thirst, Health) and inventory on the side of the screen. Include a progress bar to indicate the value of each stat.

### Map HUD
![image](https://github.com/annayujeong/Covidiots/assets/64446306/074b17c5-a12b-46bf-9ce2-53ddd54fbe06)
When the player presses 'M', show a basic map of the current area.
Highlight the player's current position with a icon (e.g., 'Location icon')

## User Centered Design Techniques & Heuristics
### Strive for Consistency
The game maintains consistent keyboard controls (W/A/S/D, spacebar, Q, E, M) across screens, following this rule.
This consistency gives users a familiarity from other games to navigate throughout their gameplay experience.

### Seek Universal Usability
The keyboard-based interactions and menu access follow this rule by accommodating a broad range of users.
The design ensures that both novice and experienced players can play without confusion.

### Offer Informative Feedback
Text-based progress bars during resource gathering follows this rule by providing users with immediate and informative feedback.
This feedback mechanism helps users understand when the task starts and ends.

### Design Dialogs to Yield Closure
The game's use of prompts, such as "Press Enter" on the title screen, follows this rule by creating clear and self-contained interactions that guide users into the game world.

### Prevent Errors
The low-fidelity prototype prioritizes simplicity in design, aligning with this rule.
The straightforward interface reduces the chance of user errors, providing a frustration-free gaming experience.

### Permit Easy Reversal of Actions
The intuitive keyboard controls and easily accessible menus adhere to this rule by allowing users to backtrack and reverse actions effortlessly, giving users the sense of control.

### Keep Users in Control
The game design and layout supports users' sense of control over their actions and decisions, aligning with this rule.
Players can confidently predict the outcomes of their interactions and navigate the game world with ease.

### Reduce Short-Term Memory Load
Through consistent controls and clear feedback mechanisms, the design promotes user memory retention.
Users can recall how to perform tasks and access menus, eliminating the need for excessive memorization.

## Fitts's Law:
### Optimizing Target Size
Fitts's Law teaches us that larger targets are easier and quicker to hit accurately. In a user-centered design approach, the focus is on making user interface elements, such as buttons, icons, and links, appropriately sized. This ensures that users can interact with these elements easily, reducing the likelihood of accidental clicks or misses.

### Minimizing Target Distance
Fitts's Law highlights that shorter distances between the starting point and the target result in faster and more accurate interactions. In a user-centered design, designers prioritize placing frequently used or critical elements within easy reach of the user. This reduces the effort required for navigation and interaction.

### Enhancing Usability
A user-centered design process involves understanding user behaviors, preferences, and needs. By gathering user feedback and conducting usability testing, designers can make decisions about target sizes, placement, and organization. This ensures that the interface aligns with users' expectations and minimizes cognitive load.

### Reducing Errors
Fitts's Law also emphasizes the importance of minimizing errors in interactions. Designing with users in mind helps identify potential sources of errors early in the design process. It will help to refine the interface and to reduce the chances of users making mistakes or encountering difficulties.

### Enhancing Accessibility
User-centered design places a strong emphasis on inclusivity and accessibility. Fitts's Law is relevant in this context as well, as it underscores the importance of making user interface elements accessible to individuals with varying motor abilities or disabilities.

### Improving User Satisfaction
Ultimately, Fitts's Law contributes to a more efficient and user-friendly interface. When users can effortlessly navigate and interact with a system, they are more likely to have a positive experience. A user-centered design approach prioritizes user satisfaction, leading to higher user retention and engagement.

## Risks and Technical Issues
### Scalability and Performance
As the game progresses in development, there could be technical issues related to scalability and performance. As more features, graphics, and content are added, the game's performance may degrade, leading to potential lag or instability.

### Cross-Platform Compatibility
Ensuring that the game is compatible with various web browsers and devices may present challenges. Players on different platforms should have a consistent and enjoyable experience.

### Multiplayer and Networking
If the game intends to include multiplayer features, there may be complexities and technical challenges associated with implementing networking functionality, including synchronization and server management.

### Resource Constraints
Budget and resource limitations may affect the development timeline and the ability to implement desired features. Managing resources effectively to meet deadlines and quality standards is a potential challenge.
