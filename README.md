
Links
* https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-kanban-npm#/bootstrap5/kanban/overview
* https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-kanban-npm#/bootstrap5/ai-gantt/task-prioritize
* https://ej2.syncfusion.com/react/documentation/gantt/data-binding#remote-data

1. Install NodeJs (Do only once)
    1. https://nodejs.org/en/download
2. Install Git
   1. https://git-scm.com/install/windows
3. Create a Workspace directory or Change to your Workspace directory
4. Clone Project from GitHub OR Pull Changes
   1. Clone this GitHub Project: https://github.com/Dchan1836/ProjectManagement
      1. Run: git clone https://github.com/Dchan1836/ProjectManagement.git
      2. You can get this GitHub Url by clicking the "Code" button on this GitHub Project page.
      3. You will get a subdirectory Workspace/ProjectManagement.  This is your Project Directory
   2. Pull New Changes from GitHub
      1. Change Directory to Workspace/ProjectManagement
      2. Run: git pull
5. Start Server
   1. Open new terminal
   2. Change Directory to Workspace/ProjectManagement/server
   3. Run: npm install (Do only once)
   4. Run: node .\server.js
   5. You should see: Server running on port 3000
   6. Test
      1. On a Browser: http://localhost:3000/kanban
   7. Leave Server running.  
6. Start Client 
   1. Open a new terminal.
   2. Change directory to this Workspace/ProjectManagement/client
   3. Run: npm install (Do only once)
   4. Run: npm run dev
   5. You should see: local: http://localhost:5173

7. Start Application
   1. From Browser: http://localhost:5173 (same as above)


   === Advanced Instructions ===

1. Install NodeJs
    1. https://nodejs.org/en/download
2. Installing VsCode 
    1. Go to https://code.visualstudio.com/download
    2. Follow the install wizard
3. Clone Project
   1. On the main page of this GitHub Project click "Code"
   2. Verify HTTPS is selected
   3. Click the "Copy Url to Clipboard" icon
      1. This will be copied to clipboard: https://github.com/Dchan1836/ProjectManagement.git
      2. VsCode created a workspace directory for you.  Change to that directory
         1. c:/workspace or $USER/workspace
      3. Run: git https://github.com/Dchan1836/ProjectManagement.git
         1. The URL is from your clipboard: c:/workspace/ProjectManagement or $USER/workspace/ProjectManagement
      4. This is your project.  
4. Open VsCode
   1. In VsCode Open Project
      1. Select File/Open
      2. Choose Project Directory (workspace/ProjectManagement)
5. Running node express backend
    1. Open a terminal
       1. In the Navigation pane on the left Choose the "Terminal" icon
    2. Navigate to ProjectManagement/server directory
    3. Run: npm install
    4. Run: node .\server.js
6. Running React.js frontend
    1. Open another terminal 
    2. navigate to ProjectManagement/client directory
    3. Run: npm install
    4. Run: npm run dev
