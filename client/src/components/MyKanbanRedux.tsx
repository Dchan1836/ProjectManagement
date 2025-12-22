import React, { JSX } from 'react';
import './KanbanStyles.css';
import { ColumnDirective, ColumnsDirective, KanbanComponent } from '@syncfusion/ej2-react-kanban';
import { DataManager, ODataAdaptor } from '@syncfusion/ej2-data';
import { format } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";

export class MyKanbanRedux extends React.Component {
  constructor(props: {}) {
    super(props);
    console.log(`MyKanban Constructor: ${JSON.stringify(props.myState)}`);
    // props.myState.KanbanData = "Hello from Kanban";

    // props.myState.updateKanban = (data) => {
    //     console.log(`Kanban updateKanban: ${JSON.stringify(data)} AppData: ${props.myState.initial}`);
    //     // This is where you will update Kanban using Gantt Change Events
    // }

    // 1. Create the ref
    this.kanbanInstance = React.createRef();
    console.log("MyKanban Constructor: ", this);

    // props.myState.state = useSelector((state: any) => state);
  }
  public kanbanRemoteDatasource: DataManager = new DataManager(
    {
      url: 'http://localhost:3000/kanban',
      updateUrl: 'http://localhost:3000/kanban',
      insertUrl: 'http://localhost:3000/kanban',
      removeUrl: 'http://localhost:3000/kanban',
      adaptor: new ODataAdaptor,
      crossDomain: true
    }
  );
  // fields = [
  //         { key: 'Id', type: 'Input' },
  //         { key: 'Status', type: 'DropDown' },
  //         { key: 'Estimate', type: 'Numeric' },
  //         { key: 'Summary', type: 'TextArea' }
  //     ];
  //   public kanbanDatasource : Object[] = [
  //     {
  //       "Id": "Task 1",
  //       "Title": "Task - 29001",
  //       "Status": "Open",
  //       "Summary": "ANALYZE the new requirements gathered from the customer..",
  //       "Type": "Story",
  //       "Priority": "Low",
  //       "Estimate": 3.5,
  //       "Assignee": "Nancy Davloio"
  //   },
  //   {
  //       "Id": "Task 2",
  //       "Title": "Task - 29002",
  //       "Status": "In Progress",
  //       "Summary": "Improve application performance",
  //       "Type": "Improvement",
  //       "Priority": "Normal",
  //       "Estimate": 6,
  //       "Assignee": "Andrew Fuller"
  //   },
  //   {
  //       "Id": "Task 3",
  //       "Title": "Task - 29003",
  //       "Status": "Open",
  //       "Summary": "Arrange a web meeting with the customer to get new requirements.",
  //       "Type": "Others",
  //       "Priority": "Critical",
  //       "Estimate": 5.5,
  //       "Assignee": "Janet Leverling"
  //   },
  //   {
  //       "Id": "Task 4",
  //       "Title": "Task - 29004",
  //       "Status": "In Progress",
  //       "Summary": "Fix the issues reported in the IE browser.",
  //       "Type": "Bug",
  //       "Priority": "Critical",
  //       "Estimate": 2.5,
  //       "Assignee": "Janet Leverling"
  //   },
  //   {
  //       "Id": "Task 5",
  //       "Title": "Task - 29005",
  //       "Status": "Review",
  //       "Summary": "Fix the issues reported by the customer.",
  //       "Type": "Bug",
  //       "Priority": "Low",
  //       "Estimate": "3.5",
  //       "Assignee": "Steven walker"
  //   },
  //   {
  //       "Id": "Task 6",
  //       "Title": "Task - 29007",
  //       "Status": "Testing",
  //       "Summary": "Testing new requirements",
  //       "Type": "Improvement",
  //       "Priority": "Low",
  //       "Estimate": 1.5,
  //       "Assignee": "Robert King"
  //   },
  //   {
  //       "Id": "Task 7",
  //       "Title": "Task - 29009",
  //       "Status": "Review",
  //       "Summary": "Fix the issues reported in Safari browser.",
  //       "Type": "Bug",
  //       "Priority": "Critical",
  //       "Estimate": 1.5,
  //       "Assignee": "Nancy Davloio"
  //   },
  //   {
  //       "Id": "Task 8",
  //       "Title": "Task - 29010",
  //       "Status": "Close",
  //       "Summary": "Test the application in the IE browser.",
  //       "Type": "Story",
  //       "Priority": "Low",
  //       "Estimate": 5.5,
  //       "Assignee": "Margaret hamilt"
  //   },
  //   {
  //       "Id": "Task 9",
  //       "Title": "Task - 29011",
  //       "Status": "Testing",
  //       "Summary": "Testing the issues reported by the customer.",
  //       "Type": "Story",
  //       "Priority": "High",
  //       "Estimate": 1,
  //       "Assignee": "Steven walker"
  //   },
  //   {
  //       "Id": "Task 10",
  //       "Title": "Task - 29015",
  //       "Status": "Open",
  //       "Summary": "Show the retrieved data from the server in grid control.",
  //       "Type": "Story",
  //       "Priority": "High",
  //       "Estimate": 5.5,
  //       "Assignee": "Margaret hamilt"
  //   },
  //   {
  //       "Id": "Task 11",
  //       "Title": "Task - 29016",
  //       "Status": "In Progress",
  //       "Summary": "Fix cannot open user’s default database SQL error.",
  //       "Priority": "Critical",
  //       "Type": "Bug",
  //       "Estimate": 2.5,
  //       "Assignee": "Janet Leverling"
  //   },
  //   {
  //       "Id": "Task 12",
  //       "Title": "Task - 29017",
  //       "Status": "Review",
  //       "Summary": "Fix the issues reported in data binding.",
  //       "Type": "Story",
  //       "Priority": "Normal",
  //       "Estimate": "3.5",
  //       "Assignee": "Janet Leverling"
  //   },
  //   {
  //       "Id": "Task 13",
  //       "Title": "Task - 29018",
  //       "Status": "Close",
  //       "Summary": "Analyze SQL server 2008 connection.",
  //       "Type": "Story",
  //       "Priority": "Critical",
  //       "Estimate": 2,
  //       "Assignee": "Andrew Fuller"
  //   },
  //   {
  //       "Id": "Task 14",
  //       "Title": "Task - 29019",
  //       "Status": "Testing",
  //       "Summary": "Testing databinding issues.",
  //       "Type": "Story",
  //       "Priority": "Low",
  //       "Estimate": 1.5,
  //       "Assignee": "Margaret hamilt"
  //   },
  //   {
  //       "Id": "Task 15",
  //       "Title": "Task - 29020",
  //       "Status": "Close",
  //       "Summary": "Analyze grid control.",
  //       "Type": "Story",
  //       "Priority": "High",
  //       "Estimate": 2.5,
  //       "Assignee": "Margaret hamilt"
  //   },
  //   {
  //       "Id": "Task 16",
  //       "Title": "Task - 29021",
  //       "Status": "Close",
  //       "Summary": "Stored procedure for initial data binding of the grid.",
  //       "Type": "Others",
  //       "Priority": "Critical",
  //       "Estimate": 1.5,
  //       "Assignee": "Steven walker"
  //   },
  //   {
  //       "Id": "Task 17",
  //       "Title": "Task - 29022",
  //       "Status": "Close",
  //       "Summary": "Analyze stored procedures.",
  //       "Type": "Story",
  //       "Priority": "Critical",
  //       "Estimate": 5.5,
  //       "Assignee": "Janet Leverling"
  //   },
  //   {
  //       "Id": "Task 18",
  //       "Title": "Task - 29023",
  //       "Status": "Testing",
  //       "Summary": "Testing editing issues.",
  //       "Type": "Story",
  //       "Priority": "Critical",
  //       "Estimate": 1,
  //       "Assignee": "Nancy Davloio"
  //   },
  //   {
  //       "Id": "Task 19",
  //       "Title": "Task - 29024",
  //       "Status": "Review",
  //       "Summary": "Test editing functionality.",
  //       "Type": "Story",
  //       "Priority": "Normal",
  //       "Estimate": 0.5,
  //       "Assignee": "Nancy Davloio"
  //   },
  //   {
  //       "Id": "Task 20",
  //       "Title": "Task - 29025",
  //       "Status": "Open",
  //       "Summary": "Enhance editing functionality.",
  //       "Type": "Improvement",
  //       "Priority": "Low",
  //       "Estimate": 3.5,
  //       "Assignee": "Andrew Fuller"
  //   }
  //   ];
  public cardTooltipTemplate(data: any): JSX.Element {
    const redStyle = {
      color: 'red'
    }
    const formatTime = (dateString: string | undefined) => {
      if (!dateString) return 'N/A';
      const dateObject = new Date(dateString);
      // Format the date object to a readable time string
      // return dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return format(dateObject, "dd/MM/yyyy hh:mm:ssa z");
    };

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td><b>Assignee : </b></td>
              <td>{data.Assignee}</td>
            </tr>
            <tr>
              <td><b>Type : </b></td>
              <td>{data.Type}</td>
            </tr>
            <tr>
              <td><b>Start : </b></td>
              <td style={redStyle}>{formatTime(data.Start)}</td>
            </tr>
            <tr>
              <td><b>Estimate : </b></td>
              <td>{data.Estimate}</td>
            </tr>
            <tr>
              <td><b>Summary : </b></td>
              <td>{data.Summary}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  public actionBegin(args: { requestType: string; data: any; }) {
    // Log the begin action
    console.log('Action Begin:', args.requestType, args);

    if (args.requestType === 'save') {
      // Logic to sync changes with a backend API can go here
      console.log('Data saved/updated:', args.data);
    };
  };
  public actionComplete(args: { requestType: string; data: any; }) {
    // Log the completed action
    console.log('Action Complete:', args.requestType, args);

    if (args.requestType === 'save') {
      // Logic to sync changes with a backend API can go here
      console.log('Data saved/updated:', args.data);
    };
  };
  updateTask = (e: any) => {
    console.log("updateTask: 2", this.kanbanInstance.current);
    if (this.kanbanInstance.current) {
      // New data object with the ID of the record to update
      let updatedData = { Id: 2, Summary: 'Update Task 2 Summary', Status: 'Close', Estimate: 1 }
      // Call the updateRecordByID method
      console.log("updateTask2", this.kanbanInstance);

      // This will post as a PUT
      this.kanbanInstance.current.updateCard(updatedData);
      console.log("updateTask3", this.kanbanInstance);
    }
    console.log("updateTask4", this);
  };
  addNewTask = () => {
    console.log("Add Task 21");
    const newTask = { Id: 'Task 21', Status: 'Open', Summary: 'New programmatic task' };
    // This POST to the backend
    this.kanbanInstance.current.addCard(newTask);
  }
  dialogSettings = {
    fields: [
      { text: 'ID', key: 'Id', type: 'TextBox' },
      { text: 'Status', key: 'Status', type: 'DropDown' },
      { text: 'Estimate', key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 100] } },
      { text: 'Summary', key: 'Summary', type: 'TextArea', validationRules: { required: true } }
    ]
  };
  render() {

    return (
      <>
        <button onClick={this.updateTask} style={{ marginBottom: '10px' }}>
          Update Task 2
        </button>
        <button onClick={this.addNewTask}>Add New Task 21</button>
        <KanbanComponent
          ref={this.kanbanInstance}
          dataSource={this.kanbanRemoteDatasource} keyField="Status"
          dialogSettings={this.dialogSettings}
          cardSettings={{ contentField: "Summary", headerField: "Id", selectionType: "Multiple" }}
          width="100%" height="100%"
          enableTooltip={true} tooltipTemplate={this.cardTooltipTemplate}
          actionBegin={this.actionBegin}
          actionComplete={this.actionComplete}
        >
          <ColumnsDirective>
            <ColumnDirective headerText='To Do' keyField="Open"></ColumnDirective>
            <ColumnDirective headerText='In Progress' keyField="In Progress"></ColumnDirective>
            <ColumnDirective headerText='Review' keyField="Review"
              minCount={1} maxCount={3}></ColumnDirective>
            <ColumnDirective headerText='Testing' keyField="Testing"
              minCount={5} maxCount={8}></ColumnDirective>
            <ColumnDirective headerText='Close' keyField="Close"></ColumnDirective>
          </ColumnsDirective>
        </KanbanComponent>
      </>);
  }
}
