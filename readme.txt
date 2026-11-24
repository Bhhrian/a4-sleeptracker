--Readme document for *author(s)*, *email(s)*, *UCI id(s)*--
Hyeonbeen Han, hyeonbh@uci.edu, 58713923
Daniel Ho Kim, danihk15@uci.edu, 47366336
A4 Group 46

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

11/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 3/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
Approximately 10 hours combined, including implementation, debugging, UI design, testing, and documentation.


3. What online resources did you consult when completing this assignment? (list specific URLs)
- Ionic Framework Documentation: https://ionicframework.com/docs
- Angular Documentation: https://angular.dev
- Capacitor Documentation: https://capacitorjs.com/docs
- MDN Web Docs (Web Storage API): https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- ChatGPT (OpenAI): https://chatgpt.com — Used to understand assignment requirements, troubleshoot Angular and TypeScript code, implement sleep tracking functionality, and improve UI design.
- ChatGPT: Used to resolve Capacitor version conflicts and set up the iOS environment. 

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
Brian:  collaborated with my project partner, Daniel, to discuss feature implementation, user interface design, sleep history presentation, native notifications, and integration of our code through GitHub.
Daniel: I worked with my partner, Brian, to discuss the overall app design and additional features, including improvements to the sleep history interface and the sleepiness reminder.

5. Is there anything special we need to know in order to run your code?
Run npm install followed by ionic serve inside the sleeptracker directory to launch the application in a browser. Native notification functionality requires a supported device environment and appropriate notification permissions.
The Sleepiness Reminder feature was successfully tested on an iPhone simulator using Xcode. Xcode and CocoaPods are required to test this feature on iOS.
1. Run npm run build.
2. Run npx cap sync ios.
3. Run npx cap open ios.


Allow notification permissions when prompted.

--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
We designed the app for students and busy individuals who want a simple way to monitor their sleeping habits and daytime alertness. The interface focuses on quick data entry and easily understandable sleep statistics.


7. Did you design your app specifically for iOS or Android, or both?
We designed the application using Ionic and Angular to support both iOS and Android. We also added an iOS native project using Capacitor and tested the application on an iPhone simulator.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
Users can select their bedtime and wake-up time using date and time inputs, and the app automatically calculates their total sleep duration. We chose this approach because it is intuitive, requires minimal effort, and avoids manually calculating sleep hours.


9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
Users can select a sleepiness level from 1 to 7 using the Stanford Sleepiness Scale and save the entry with its timestamp. We used this standardized scale to make daytime sleepiness tracking consistent and easy to understand.


10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
Users can review their overnight sleep and daytime sleepiness entries in separate history sections and view summary statistics on the dashboard. This design makes it easy to identify sleeping patterns while keeping detailed records organized and accessible.


11. Which feature choose--using a native device resource, backing up logged data, or both?
We implemented both native device notifications and persistent local storage for sleep records.


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
We added native sleepiness notifications using Capacitor to remind users to track their daytime alertness. This encourages consistent logging and makes the application more useful beyond manual interaction.


13. If you backed up logged data, where does it back up to?
Sleep records are stored locally on the user's device using the browser's localStorage API. This allows previously saved entries to remain available after closing or refreshing the application, although the data is not backed up to an external server.

14. How does your app implement or follow principles of good mobile design?
We implemented a clear dashboard, familiar Ionic components, input validation, and confirmation dialogs to make the app intuitive and prevent user errors. 
We also improved the sleep history interface by separating bedtime and wake-up time, highlighting sleep duration and sleepiness levels, and using consistent colors and spacing to improve readability on mobile devices.