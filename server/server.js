const express = require('express');

const cors = require('cors');

const app = express();

let posts = [
    {
        "Id": "1",
        "Title": "Task - 29001",
        "Status": "Open",
        "Summary": "Analyze the new requirements gathered from the customer.",
        "Type": "Story",
        "Priority": "Low",
        "Estimate": 3.5,
        "Assignee": "Nancy Davloio",
        "Start": "2024-12-11T21:34:00Z"
    },
    {
        "Id": "2",
        "Title": "Task - 29002",
        "Status": "In Progress",
        "Summary": "Improve application performance",
        "Type": "Improvement",
        "Priority": "Normal",
        "Estimate": 6,
        "Assignee": "Andrew Fuller"
    },
    {
        "Id": "3",
        "Title": "Task - 29003",
        "Status": "Open",
        "Summary": "Arrange a web meeting with the customer to get new requirements.",
        "Type": "Others",
        "Priority": "Critical",
        "Estimate": 5.5,
        "Assignee": "Janet Leverling"
    },
    {
        "Id": "4",
        "Title": "Task - 29004",
        "Status": "In Progress",
        "Summary": "Fix the issues reported in the IE browser.",
        "Type": "Bug",
        "Priority": "Critical",
        "Estimate": 2.5,
        "Assignee": "Janet Leverling"
    },
    {
        "Id": "5",
        "Title": "Task - 29005",
        "Status": "Review",
        "Summary": "Fix the issues reported by the customer.",
        "Type": "Bug",
        "Priority": "Low",
        "Estimate": "3.5",
        "Assignee": "Steven walker"
    },
    {
        "Id": "6",
        "Title": "Task - 29007",
        "Status": "Testing",
        "Summary": "Testing new requirements",
        "Type": "Improvement",
        "Priority": "Low",
        "Estimate": 1.5,
        "Assignee": "Robert King"
    },
    {
        "Id": "7",
        "Title": "Task - 29009",
        "Status": "Review",
        "Summary": "Fix the issues reported in Safari browser.",
        "Type": "Bug",
        "Priority": "Critical",
        "Estimate": 1.5,
        "Assignee": "Nancy Davloio"
    },
    {
        "Id": "8",
        "Title": "Task - 29010",
        "Status": "Close",
        "Summary": "Test the application in the IE browser.",
        "Type": "Story",
        "Priority": "Low",
        "Estimate": 5.5,
        "Assignee": "Margaret hamilt"
    },
    {
        "Id": "9",
        "Title": "Task - 29011",
        "Status": "Testing",
        "Summary": "Testing the issues reported by the customer.",
        "Type": "Story",
        "Priority": "High",
        "Estimate": 1,
        "Assignee": "Steven walker"
    },
    {
        "Id": "10",
        "Title": "Task - 29015",
        "Status": "Open",
        "Summary": "Show the retrieved data from the server in grid control.",
        "Type": "Story",
        "Priority": "High",
        "Estimate": 5.5,
        "Assignee": "Margaret hamilt"
    },
    {
        "Id": "11",
        "Title": "Task - 29016",
        "Status": "In Progress",
        "Summary": "Fix cannot open user’s default database SQL error.",
        "Priority": "Critical",
        "Type": "Bug",
        "Estimate": 2.5,
        "Assignee": "Janet Leverling"
    },
    {
        "Id": "12",
        "Title": "Task - 29017",
        "Status": "Review",
        "Summary": "Fix the issues reported in data binding.",
        "Type": "Story",
        "Priority": "Normal",
        "Estimate": "3.5",
        "Assignee": "Janet Leverling"
    },
    {
        "Id": "13",
        "Title": "Task - 29018",
        "Status": "Close",
        "Summary": "Analyze SQL server 2008 connection.",
        "Type": "Story",
        "Priority": "Critical",
        "Estimate": 2,
        "Assignee": "Andrew Fuller"
    },
    {
        "Id": "14",
        "Title": "Task - 29019",
        "Status": "Testing",
        "Summary": "Testing databinding issues.",
        "Type": "Story",
        "Priority": "Low",
        "Estimate": 1.5,
        "Assignee": "Margaret hamilt"
    },
    {
        "Id": "15",
        "Title": "Task - 29020",
        "Status": "Close",
        "Summary": "Analyze grid control.",
        "Type": "Story",
        "Priority": "High",
        "Estimate": 2.5,
        "Assignee": "Margaret hamilt"
    },
    {
        "Id": "16",
        "Title": "Task - 29021",
        "Status": "Close",
        "Summary": "Stored procedure for initial data binding of the grid.",
        "Type": "Others",
        "Priority": "Critical",
        "Estimate": 1.5,
        "Assignee": "Steven walker"
    },
    {
        "Id": "17",
        "Title": "Task - 29022",
        "Status": "Close",
        "Summary": "Analyze stored procedures.",
        "Type": "Story",
        "Priority": "Critical",
        "Estimate": 5.5,
        "Assignee": "Janet Leverling"
    },
    {
        "Id": "18",
        "Title": "Task - 29023",
        "Status": "Testing",
        "Summary": "Testing editing issues.",
        "Type": "Story",
        "Priority": "Critical",
        "Estimate": 1,
        "Assignee": "Nancy Davloio"
    },
    {
        "Id": "19",
        "Title": "Task - 29024",
        "Status": "Review",
        "Summary": "Test editing functionality.",
        "Type": "Story",
        "Priority": "Normal",
        "Estimate": 0.5,
        "Assignee": "Nancy Davloio"
    },
    {
        "Id": "20",
        "Title": "Task - 29025",
        "Status": "Open",
        "Summary": "Enhance editing functionality.",
        "Type": "Improvement",
        "Priority": "Low",
        "Estimate": 3.5,
        "Assignee": "Andrew Fuller"
    }

];

// let ganttPosts = [
//      {
//         TaskID: 1,

//         TaskName: "Product concept",

//         StartDate: new Date("04/02/2025"),

//         EndDate: new Date("04/08/2025"),

//     },
//     // {
//     //         TaskID: 1,
//     //         TaskName: 'Project Initiation',
//     //         StartDate: new Date('04/02/2020'),
//     //         EndDate: new Date('04/21/2020'),
//     //         subtasks: [
//     //             { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/06/2020'), Duration: 4, Progress: 50 },
//     //             { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/10/2020'), Duration: 4, Progress: 50, Predeceesor: "2FS" },
//     //             { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/12/2020'), Duration: 4, Progress: 50 },
//     //         ]
//     //     },
//     //     {
//     //         TaskID: 5,
//     //         TaskName: 'Project Estimation',
//     //         StartDate: new Date('04/02/2020'),
//     //         EndDate: new Date('04/21/2020'),
//     //         subtasks: [
//     //             { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/03/2020'), Duration: 3, Progress: 50 },
//     //             { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2020'), Duration: 3, Progress: 50 },
//     //             { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/08/2020'), Duration: 3, Progress: 50 }
//     //         ]
//     //     },
//     // {
//     //     "TaskID": 1,
//     //     "TaskName": 'Project Initiation',
//     //     "StartDate": new Date("04/02/2020"),
//     //     "EndDate": new Date("04/21/2020"),
//     //     "subtasks": [
//     //         { "TaskID": 2, "TaskName": 'Identify Site location', "StartDate": new Date("04/06/2020"), "Duration": 4, "Progress": 50 },
//     //         { "TaskID": 3, "TaskName": 'Perform Soil test', "StartDate": new Date("04/10/2020"), "Duration": 4, "Progress": 50, "Predeceesor":"2FS" },
//     //         { "TaskID": 4, "TaskName": 'Soil test approval', "StartDate": new Date("04/12/2020"), "Duration": 4, "Progress": 50 },
//     //     ]
//     // },
//     // {
//     //     "TaskID": 5,
//     //     "TaskName": 'Project Estimation',
//     //     "StartDate": new Date('04/02/2020'),
//     //     "EndDate": new Date('04/21/2020'),
//     //     "subtasks": [
//     //         { "TaskID": 6, "TaskName": 'Develop floor plan for estimation', "StartDate": new Date('04/03/2020'), "Duration": 3, "Progress": 50 },
//     //         { "TaskID": 7, "TaskName": 'List materials', "StartDate": new Date('04/04/2020'), "Duration": 3, "Progress": 50 },
//     //         { "TaskID": 8, "TaskName": 'Estimation approval', "StartDate": new Date('04/08/2020'), "Duration": 3, "Progress": 50 }
//     //     ]
//     // },
//     // { TaskID: 1,TaskName: 'Project Initiation',StartDate: new Date('04/02/2019'),EndDate: new Date('04/21/2019')},
//     // { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50,ParentId:1 },
//     // { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50, ParentId:1   },
//     // { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50,ParentId:1 },
//     // { TaskID: 5, TaskName: 'Project Estimation',StartDate: new Date('04/02/2019'),EndDate: new Date('04/21/2019')},
//     // { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId:5  },
//     // { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50,ParentId:5  },
//     // { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId:5  }
// ];
let allTasks = [
    {
        Id: "123456",
        Title: "Task - 29001",
        Status: "Open",
        Summary: "Analyze the new requirements gathered from the customer.",
        Type: "Story",
        Priority: "Low",
        Estimate: 3.5,
        Assignee: "Nancy Davloio",
        StartDate: new Date('04/02/2025'),
        EndDate: new Date('04/21/2025'),
    },
    {
        Id: "1000",
        Title: 'Project initiation',
        StartDate: new Date('04/02/2025'),
        EndDate: new Date('04/21/2025'),
        isExpand: false,
        Status: "Open",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee", 
        // Duration: 0,
        Progress: 30,
        ParentId: null,
        Predecessor: '1002',
        info:"test info",
        resources:[]
    },
    {
        Id: "1002",
        Title: 'Identify site location',
        StartDate: new Date('04/01/2025'),
        EndDate: new Date('04/12/2025'),
        // Duration: 0,
        Progress: 30,
        resources: [1],
        info: 'Measure the total property area alloted for construction',
        isExpand: true,
        Status: "In Progress",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "1003",
        Title: 'Perform Soil test',
        StartDate: new Date('03/22/2025'),
        EndDate: new Date("03/28/2025"),
        // Duration: 4,
        Predecessor: '1002',
        Status: "Open",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "1",
        Title: "Product concept",
        StartDate: new Date("04/02/2025"),
        EndDate: new Date("04/08/2025"),
        isExpand: false,
        Status: "Open",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "2",
        // ParentId: 1,
        Title: "Define the product usage",
        StartDate: new Date("04/02/2025"),
        EndDate: new Date("04/08/2025"),
        // Duration: 3,
        Progress: 30,
        BaselineStartDate: new Date("04/02/2025"),
        BaselineEndDate: new Date("04/02/2025"),
        Predecessor: 1,
        isExpand: true,
        resources: [1],
        info: 'Measure the total property area alloted for construction',
        Status: "In Progress",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "3",
        // ParentId: 1,
        Title: "Define the target audience",
        StartDate: new Date("04/02/2025"),
        EndDate: new Date("04/04/2025"),
        // Duration: 2,
        Progress: 40,
        Predecessor: 1,
        isExpand: true,
        Status: "Review",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "4",
        Title: "Prepare product sketch and notes",
        StartDate: new Date("04/05/2025"),
        EndDate: new Date("04/08/2025"),
        // Duration: 4,
        Progress: 30,
        Predecessor: "2FS",
        Status: "Open",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "5",
        Title: "Concept approval",
        StartDate: new Date("04/08/2025"),
        EndDate: new Date("04/08/2025"),
        // Duration: 0,
        Predecessor: "3FS,4SS",
        Indicators: [
            {
                date: new Date("04/15/2025"),
                name: "Design Phase",
                tooltip: "Design phase completed",
                iconClass: "okIcon e-icons",
            },
        ],
        Status: "Close",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "6",
        Title: "Product concept",
        StartDate: new Date("04/02/2025"),
        EndDate: new Date("04/08/2025"),
        Status: "In Progress",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",

    },
    {
        Id: "7",
        Title: "Define the product usage",
        StartDate: new Date("04/02/2025"),
        EndDate: new Date("04/08/2025"),
        // Duration: 3,
        Progress: 30,
        Status: "In Progress",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "8",
        Title: "Define the target audience",
        StartDate: new Date("04/02/2025"),
        EndDate: new Date("04/04/2025"),
        // Duration: 2,
        Progress: 40,
        Status: "Review",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "9",
        Title: "Prepare product sketch and notes",
        StartDate: new Date("04/05/2025"),
        EndDate: new Date("04/10/2025"),
        // Duration: 4,
        Progress: 30,
        Predecessor: "2",
        Status: "Testing",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "10",
        Title: "Concept approval",
        StartDate: new Date("04/08/2025"),
        EndDate: new Date("04/08/2025"),
        // Duration: 0,
        Predecessor: "8,9",
        Indicators: [
            {
                date: new Date("04/15/2025"),
                name: "Design Phase",
                tooltip: "Design phase completed",
                iconClass: "okIcon e-icons",
            },
        ],
        Status: "Close",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "100", Title: "Planning and Permits",
        StartDate: new Date("04/02/2025"), EndDate: new Date("04/10/2025"),
        // Duration: 7,
         Progress: 100, resources: [
            {
                "resourceId": 2,
                "resourceName": "Rose Fuller",
                "unit": 100
            },
            {
                "resourceId": 3,
                "resourceName": "Margaret Buchanan",
                "unit": 100
            }
        ],
        Status: "Close",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
    },
    {
        Id: "120", Title: "Site Evaluation", StartDate: new Date("04/02/2025"),
        EndDate: new Date("04/04/2025"),
        //  Duration: 2,
          Progress: 100,
        //  ParentId: 100,
        Predecessor: "4FS,8FS+5 days", resources: [
            {
                "resourceId": 2,
                "resourceName": "Rose Fuller",
                "unit": 100
            },
            {
                "resourceId": 3,
                "resourceName": "Margaret Buchanan",
                "unit": 100
            }
        ],
        Status: "Review",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
        "info": "I love Sushi"
    },
    {
        Id: "130", Title: "Obtain Permits", StartDate: new Date("04/07/2025"),
        EndDate: new Date("04/09/2025"),
        //  Duration: 3,
          Progress: 100,
        // ParentId: 100,
        Predecessor: "9FS", resources: [
            {
                "resourceId": 6
            },
            {
                "resourceId": 7
            }
        ],
        Status: "Testing",
        Summary: "test summary",
        Type: "Story",
        Priority: "Low",
        Estimate: 4.5,
        Assignee: "test assignee",
        "info": "I love React"
    },
];

app.use(cors({
    origin: '*' // Or '*' to allow all origins during development
}));
// Must do this before adding express.json() to the app.  Or you will get invalid json errors.
// WARNING: This delete will be followed by a PUT to update dependencies
app.delete('/gantt/:id', (req, res) => {
    const header = req.headers;
    const path = req.path;
    const id = req.params.id;
    console.log(`Delete /gantt  id: ${id} path: ${path}`);

    // REMOVE the Task from allTasks here

    res.status(201).json({ message: 'Item deleted successfully', id: req.params.id });
});


app.get('/gantt', express.json(), async (req, res) => {
    console.log("Get /gantt");
    res.json({ result: allTasks, count: allTasks.length });
});

// POST /gant is posted on Create New
app.post("/gantt", express.json(), (req, res) => {
    const body = req.body;
    const header = req.headers;
    const path = req.path;
    // posts.push(post);
    console.log("Post: /gantt request to path:", path);
    console.log("Headers:", header);
    if (body && body.requiresCounts) {
        console.log(`Post: /gantt RequiresCount == ${body.requiresCount}`);
        res.status(201).send({ result: allTasks, count: allTasks.length });
    } else {
        allTasks.unshift(body[0]);
        console.log("Post /gantt:", body);
        res.status(201).send({ result: allTasks, count: allTasks.length });
    }


});

// PUT /gantt is posted when tasks are dragged or changed

// Warning:: If there are dependencies the dependencies change also
// and need to be updated in the backend.  So iterate all the body tasks

app.put("/gantt", express.json(), (req, res) => {
    console.log("Put With Single Quotes");
    const body = req.body;
    const header = req.headers;
    const path = req.path;
    const id = body[0] ? body[0].TaskID : -1;
    console.log(`Put /gantt id: ${id} path: ${path} body: ${JSON.stringify(body)}:: ${id}`);
    // You might get an empty payload
    if (body.length > 0) {
        /**
            NOTICE that this has sub Tasks.  The Data stricture isn't a list.  It has sub lists.
            WARNING: This does not recurse several levels.  It only recurse the Top Level Parent
            Please change this to a recursive function that walks all tasks/subtasks!!!
        */
        const index = allTasks.findIndex(post => {
            console.log(`looking: ${post.TaskID} ${id}: ${typeof post.TaskID} ${typeof id} :: ${post.TaskID == id}`);
            if (post.TaskID == id) {
                // I don't know why body is an array with one thing in it.
                Object.assign(post, body["0"]);
                console.log(`Found:  ${post.TaskID}`);
                return true;
            }
            if (post.subtasks) {
                const index = post.subtasks.findIndex(post => {
                    console.log(`looking SubTasks: ${post.TaskID} ${id}: ${typeof post.TaskID} ${typeof id} :: ${post.TaskID == id}`);
                    if (post.TaskID == id) {
                        // I don't know why body is an array with one thing in it.
                        Object.assign(post, body["0"]);
                        console.log(`Found: ${post.TaskID}`);
                        return true;
                    }
                })
                return false;
            }
        });
    } else {
        console.log("Empty Payload");
    }
    res.status(201).send({ result: allTasks, count: allTasks.length });
});
// app.use(express.json());




// app.get("/kanban", (req, res) => {
//     res.send("Server is running");  
//     console.log("hello");
// });



// app.listen(port, () => {

//   console.log(`Server is running at [http://localhost:$%7bport%7d%60]http://localhost:${port}`);

// });

app.post('/api/log-performance', express.json(), (req, res) => {
    const performanceMetrics = req.body.metrics;

    // Here you can process, store, or log the metrics
    console.log('Received performance metrics:', performanceMetrics);

    // Send a response back to the client
    res.status(200).send('Metrics received successfully');
});

app.get("/kanban", express.json(), (req, res) => {
    res.send(allTasks);
});
// app.get("/gantt", (req, res) => {
//     console.log("Gantt request received1");
//     // res.send(ganttPosts);

//     res.send(ganttPosts);
//     // res.json(ganttPosts);
// });
// app.get("/gantt/*", (req, res) => {
//     console.log("Gantt request received2");
//     // res.send(ganttPosts);

//     res.status(200).send(ganttPosts);
//     // res.json(ganttPosts);
// });

// Dragging a Task from one column to another
app.put("/kanban\\(':id'\\)", express.json(), (req, res) => {
    console.log("Put With Single Quotes");
    const body = req.body;
    const header = req.headers;
    const path = req.path;
    const id = req.params.id;
    console.log(`id: ${id} path: ${path} body: ${body}`);
    const index = allTasks.findIndex(post => {
        console.log(`looking: ${post.Id} ${req.params.id}: ${typeof req.params.id} ${typeof post.Id} :: ${post.Id == String(req.params.id)}`);
        return (post.Id == String(req.params.id));
    });

    console.log(`Index: ${index}`);
    if (index !== -1) {
        console.log(`Task found: ${index}`);
        body.Id = String(allTasks[index].Id);
        allTasks[index] = Object.assign(allTasks[index], body);
    }
    // posts.push(post);
    res.status(201).send(allTasks);
});
// NOTE Without Quotes
// Update Task Programmatically with updateCard
app.put("/kanban\\(:id\\)", express.json(), (req, res) => {
    console.log("Put Without Quotes");
    const body = req.body;
    const header = req.headers;
    const path = req.path;
    const id = req.params.id;
    console.log(`id: ${id} path: ${path} body: ${body}`);
    // posts.push(post);
    const index = allTasks.findIndex(post => {
        console.log(`looking: ${post.Id} ${req.params.id}: ${typeof req.params.id} ${typeof post.Id} :: ${post.Id == String(req.params.id)}`);
        return (post.Id == String(req.params.id));
    });

    console.log(`Index: ${index}`);
    if (index !== -1) {
        console.log(`Task found: ${index}`);
        body.Id = String(allTasks[index].Id);
        allTasks[index] = Object.assign(allTasks[index], body);
    }
    //    Object.assign(posts[req.params.id.toString()], body);
    res.status(201).send(allTasks);
});
// app.put("/gantt", (req, res) => {
//     console.log("Put");
//     const body = req.body;
//     const header = req.headers;
//     const path = req.path;
//     const id = req.params.id;
//     console.log(`id: ${id} path: ${path} body: ${body}`);
//     // posts.push(post);
//     res.status(201).send(body);
// });

// This is a POST.  I don't think this is being used.
app.post("/kanban\\(':id'\\)", express.json(), (req, res) => {
    const post = req.body;
    const header = req.headers;
    const path = req.path;
    // posts.push(post);
    console.log("Put request to path:", path);
    console.log("Headers:", header);
    // posts.push(post);
    console.log("Post added:", post);
    res.status(201).send(post);

});
// This is a POST.  I don't know whether this is being used
app.post("/kanban\\(':id'\\)", express.json(), (req, res) => {
    const post = req.body;
    const header = req.headers;
    const path = req.path;
    // posts.push(post);
    console.log("Put request to path:", path);
    console.log("Headers:", header);
    // posts.push(post);
    console.log("Post added:", post);
    res.status(201).send(post);

});

// Adding New Task
app.post("/kanban", express.json(), (req, res) => {
    const body = req.body;
    const header = req.headers;
    const path = req.path;
    // posts.push(post);
    console.log("Put request to path:", path);
    console.log("Headers:", header);
    // posts.push(post);
    const index = allTasks.findIndex(post => {
        console.log(`looking: ${post.Id} ${body.Id}: ${typeof body.Id} ${typeof post.Id} :: ${post.Id == String(body.Id)}`);
        return (post.Id == String(body.Id));
    });

    console.log(`Index: ${index}`);
    if (index == -1) {
        console.log(`Task NOT found: ${index}`);
        body.Id = String(body.Id);
        allTasks.push(body);
    } else {
        console.log("Tasks already in list NOT ADDING.  You should probably do something different");
    }
    res.status(201).send(allTasks);

});

// app.all("/gantt", (req, res) => {
//     const post = req.body;
//     const header = req.headers;
//     const path = req.path;
//     // posts.push(post);
//     console.log("Put request to path:", path);  
//     console.log("Headers:", header);
//     // posts.push(post);
//     console.log("Post added:", ganttPosts);
//     res.status(201).send(ganttPosts);
// });

app.listen(3000, () => console.log('Server running on port 3000'));