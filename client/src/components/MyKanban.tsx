
// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import { extend } from '@syncfusion/ej2-base';
// import { KanbanComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-kanban";
// // import { kanbanData } from './datasource';
// const data = [
//     { "ID": 1, "Title": "Design UI1", "Status": "Open" ,"Summary": "summary 1", "Priority": "High","Estimate": 3.5, Assignee: "John1" },
//     { "ID": 2, "Title": "Design UI2", "Status": "In Progress" ,"Summary": "summary 2", "Priority": "Low","Estimate": 4.5, Assignee: "John2" },
//     { "ID": 3, "Title": "Design UI3", "Status": "Open" ,"Summary": "summary 3", "Priority": "High","Estimate": 35, Assignee: "John3" }
//   ];
// export function MyKanban() {
//   // Sample local data for the Kanban board


//   return (
//     <KanbanComponent id="kanban" keyField="Status" dataSource={data} cardSettings={{ contentField: "Summary", headerField: "ID" }} >
//       <ColumnsDirective>
//         <ColumnDirective headerText="To Do" keyField="Open"/>
//         <ColumnDirective headerText="In Progress" keyField="InProgress"/>
//         <ColumnDirective headerText="Testing" keyField="Testing"/>
//         <ColumnDirective headerText="Done" keyField="Close"/>
//       </ColumnsDirective>
//   </KanbanComponent>);
// }

import React, { JSX } from 'react';
import './KanbanStyles.css';
import { ColumnDirective, ColumnsDirective, KanbanComponent } from '@syncfusion/ej2-react-kanban';
import { DataManager, ODataAdaptor } from '@syncfusion/ej2-data';
import { format } from 'date-fns';
import { MyGantt } from "./MyGantt.tsx";

export class MyKanban extends React.Component {
  constructor(props) {
    super(props);
    console.log(`MyKanban Constructor: ${JSON.stringify(props.myState)}`);
    props.myState.KanbanData = "Hello from Kanban";
    // 1. Create the ref
    this.kanbanInstance = React.createRef();

    props.myState.updateKanban = (data) => {
      console.log(`Kanban updateKanban: ${JSON.stringify(data)} AppData: ${props.myState.initial}`);
      this.kanbanInstance.current.refresh();
      // This is where you will update Kanban using Gantt Change Events
    }

    console.log("MyKanban Constructor: ", this);
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
              <td><b>Title : </b></td>
              <td>{data.Title}</td>
            </tr>
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
  public actionBegin(args) {
    // Log the begin action
    console.log('Action Begin:', args.requestType, args);

    if (args.requestType === 'save') {
      // Logic to sync changes with a backend API can go here
      console.log('Data saved/updated:', args.data);
    };
  };
  public actionComplete(args) {
    // Log the completed action
    console.log('Action Complete:', args.requestType, args);

    if (args.requestType === 'save') {
      // Logic to sync changes with a backend API can go here
      console.log('Data saved/updated:', args.data);
      
    };
  };
  updateTask = (e) => {
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


  public onTaskbarEdited = (args) => console.log('taskbarEdited:', args); // after drag/resize/update

  public onCellEdited = (args) => console.log('cellEdited:', args); // after inline cell edit
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
          cardSettings={{ contentField: "Title", headerField: "Id", selectionType: "Multiple" }}
          width="100%" height="100%"
          enableTooltip={true} tooltipTemplate={this.cardTooltipTemplate}
          actionBegin={this.actionBegin}
          actionComplete={this.actionComplete}

          taskbarEdited={this.onTaskbarEdited}

          cellEdited={this.onCellEdited}
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
        <MyGantt myState={this.props.myState} />
      </>);
  }
}
