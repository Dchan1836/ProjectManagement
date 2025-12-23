import { createRoot } from 'react-dom/client';
import React from 'react';
import './GanttStyles.css';
import { useEffect, useState, useRef } from 'react';
import {
    GanttComponent, Inject, Selection, DayMarkers, ColumnsDirective, ColumnDirective,
    EditDialogFieldDirective, EditDialogFieldsDirective, Edit,
    Toolbar, Resize, ContextMenu, Filter
} from '@syncfusion/ej2-react-gantt';
import { DataManager, WebApiAdaptor, UrlAdaptor } from '@syncfusion/ej2-data';
import { SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';


/**
    Using WebApiAdapter, the Gantt Component
    Will post PUT changes to the server.
*/
const dataManager = new DataManager({
    url: 'http://localhost:3000/gantt',
    updateUrl: 'http://localhost:3000/gantt',
    insertUrl: 'http://localhost:3000/gantt',
    removeUrl: 'http://localhost:3000/gantt',
    //          batchUrl: "http://localhost:3000/gantt/batchUrl",
    // The payload changes when using UrlAdapter.  It includes an action and changed.  This might be a good thing
    adaptor: new WebApiAdaptor(),
    crossDomain: true
});
const editingResources = [
    { resourceId: 1, resourceName: 'Martin Tamer' },
    { resourceId: 2, resourceName: 'Rose Fuller' },
    { resourceId: 3, resourceName: 'Margaret Buchanan' },
    { resourceId: 4, resourceName: 'Fuller King' },
    { resourceId: 5, resourceName: 'Davolio Fuller' },
    { resourceId: 6, resourceName: 'Van Jack' },
    { resourceId: 7, resourceName: 'Fuller Buchanan' },
    { resourceId: 8, resourceName: 'Jack Davolio' },
    { resourceId: 9, resourceName: 'Tamer Vinet' },
    { resourceId: 10, resourceName: 'Vinet Fuller' },
    { resourceId: 11, resourceName: 'Bergs Anton' },
    { resourceId: 12, resourceName: 'Construction Supervisor' }
];
export const MyGantt = (props) => {
    let myProps = props;
    let ganttInstance = React.useRef(null)
    const [data, setData] = useState([]);
    let switchRef: any;
    const taskFields = {
        id: 'Id',
        name: 'Title',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
        parentID: 'ParentId',
        notes: 'info',
        resourceInfo: 'resources'
    };
    const resourceFields = {
        id: 'resourceId',
        name: 'resourceName'
    };
    const labelSettings = {
        leftLabel: 'Title',
        rightLabel: 'resources',
    };
    const splitterSettings = {
        position: "35%"
    };
    const projectStartDate = new Date('03/26/2025');
    const projectEndDate = new Date('07/20/2025');
    const toolbarOptions: string[] = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExpandAll', 'CollapseAll'];

    const editSettings: object = {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true,
        mode: 'Auto' // 'Auto' enables cell editing on double-click
    }
    const actionBegin = (args) => {
        // Log the type of action being performed (e.g., 'editing', 'adding', 'deleting', 'dependencyUpdate')
        console.log('Action Begins:', args.requestType);

        if (args.requestType === 'beforeOpenEditDialog') {
            // Example: access and customize the edit dialog
        }

        // You can inspect args.data here to see the proposed changes
        // if (args.requestType === 'save' && args.data.taskName === '') {
        //   args.cancel = true; // Cancel the save action
        // }
    }
    const actionComplete = (args) => {
        // Log the completed action
        console.log('Action Complete:', args.requestType, args.data);
        /**
            I don't think you can trust the PUT or POST.  It only shows the
            Changes for the first task.  It doesn't include the changes
            for the dependents
        */
        if (args.requestType == 'add') {
            console.log("Added new record values available in the 'args' variable as 'newTaskData'", args);
        }
        if (args.requestType === 'save') {
            // Logic to sync changes with a backend API can go here
            console.log('Data saved/updated:', args.data);
            if (props.myState && props.myState.updateKanban) {
                myProps.myState.updateKanban();
            }
        }
        if (args.requestType == 'delete') {
            console.log("Modified Records after Delete action", args);
        }
    }
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/gantt');
            const jsonData = await response.json();
            setData(jsonData);
        }
        catch (error) {
            console.error('Error fetching local data:', error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const updateTask = () => {
        console.log("updateTask1", ganttInstance);
        if (ganttInstance.current) {
            // New data object with the ID of the record to update
            const updatedData = {
                Id: 2,
                StartDate: new Date("04/08/2025"),
                Duration: 5,
                Title: 'Updated Site Location'
            };
            // Call the updateRecordByID method
            console.log("updateTask2", ganttInstance);
            ganttInstance.current.updateRecordByID(updatedData);
            console.log("updateTask3", ganttInstance);
        }
        console.log("updateTask4", ganttInstance);
    };
    const updateTaskUsingSetData = () => {
        console.log("updateTask2a", data);
        if (ganttInstance.current) {
            // New data object with the ID of the record to update
            data[1] = {
                Id: 2,
                StartDate: new Date("04/08/2025"),
                Duration: 5,
                Title: 'Updated Using setData'
            };
            // Call the updateRecordByID method
            console.log("updateTask2b", data);
            setData(data);
            console.log("updateTask3c", data);
        }
        console.log("updateTask4", data);
    };
    const handleGetValues = () => {
        // Returns an array of selected task objects
        const selectedRecords = ganttInstance.current.selectionModule.getSelectedRecords();
        console.log(selectedRecords);
    }
    const updateKanban = () => {
        console.log("Gantt calling update Kanban");
        if (props.myState && props.myState.updateKanban) {
            console.log("Gantt calling update Kanban: My State: ", props.myState, " Kanban Data: ", props.myState.KanbanData);
            // Get the Gantt chart instance
            // var ganttChartInstance = document.getElementById("GanttContainer").ej2_instances[0];

            // Retrieve the entire data source
            var allGanttData = ganttInstance.current.currentViewData;
            props.myState.updateKanban({ Id: "1", Title: 'Message from Gantt' });
        } else {
            console.log("Gantt calling update Kanban failed because Kanban has not been clicked");
        }
    }
    const contextMenuOpen = (args) => {
        let record = args.rowData;
        console.log(`contextMenuOpen`);
        if (args.type !== 'Header' && record) {
            if (!record.hasChildRecords) {
                args.hideItems.push('Collapse the Row');
                args.hideItems.push('Expand the Row');
            }
            else {
                if (record.expanded) {
                    args.hideItems.push('Expand the Row');
                }
                else {
                    args.hideItems.push('Collapse the Row');
                }
            }
        }
    };
    const contextMenuClick = (args) => {
        console.log(`contentMenuClick`);
        let record = args.rowData;
        if (args.item.id === 'collapserow') {
            ganttInstance.current.collapseByID(Number(record.ganttProperties.taskId));
        }
        if (args.item.id === 'expandrow') {
            ganttInstance.current.expandByID(Number(record.ganttProperties.taskId));
        }
    };
    const contextMenuItems = ['AutoFitAll', 'AutoFit', 'TaskInformation', 'DeleteTask', 'Save', 'Cancel',
        'SortAscending', 'SortDescending', 'Add', 'DeleteDependency', 'Convert', 'Indent', 'Outdent',
        { text: 'Collapse the Row', target: '.e-content', id: 'collapserow' },
        { text: 'Expand the Row', target: '.e-content', id: 'expandrow' }];
    function change() {
        const ganttDependencyViewContainer = document.querySelector('.e-gantt-dependency-view-container');
        if (switchRef.checked) {
            ganttDependencyViewContainer.style.visibility = 'hidden';
        } else {
            ganttDependencyViewContainer.style.visibility = 'visible';
        }
    }
    //        const GanttDataSourceEntities db = new GanttDataSourceEntities();
    function getAllData() {
        // I suggest using currentViewData.  I don't know what updatedRecord is
        console.log(`getAllData: ids: ${ganttInstance.current.ids.length} ${ganttInstance.current.updatedRecords[ganttInstance.current.ids.length - 1].Id}  ${ganttInstance.current.currentViewData[ganttInstance.current.ids.length - 1].Id}`);

    }
    const formatOption: Object = { type: 'date', format: 'dd/MM/yyyy' };
    const gridLines = 'Both';

    // Styles for the main container div
    const containerStyle = {
        display: 'flex',         // Use flexbox for layout control
        justifyContent: 'flex-start', // Explicitly left-align items (default behavior)
        gap: '10px',             // Add some space between buttons
        padding: '20px',
        border: '1px solid #ccc',
        width: '100%'
    };

    // Styles for the buttons
    const buttonStyle = {
        padding: '10px 15px',
        // React inline styles use camelCase properties and string values for units
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };
    const alignmentData = [
        { text: 'Left', value: 'Left' },
        { text: 'Right', value: 'Right' },
        { text: 'Center', value: 'Center' },
        { text: 'Justify', value: 'Justify' },
    ];

    const changeAlignment = ((args) => {
        ganttInstance.current.treeGrid.grid.columns.forEach((col) => {
            col.headerTextAlign = args.value;
        });
        ganttInstance.current.treeGrid.grid.refreshHeader();
    })
    const dropDownData = [
        { text: 'Header', value: 'Header' },
        { text: 'Content', value: 'Content' },
        { text: 'Both', value: 'Both' },
    ];
    const valueChange = ((args) => {
        ganttInstance.current.treeGrid.textWrapSettings.wrapMode = args.value;
        ganttInstance.current.treeGrid.allowTextWrap = true;
    })

    //=========================
    let dropDown = null;
    let textBox = null;

    const field = { text: 'text', value: 'value' };

    const alignmentData2 = [
        { text: 'Title', value: 'Title' },
        { text: 'StartDate', value: 'StartDate' },
        { text: 'Duration', value: 'Duration' },
        { text: 'Progress', value: 'Progress' },
    ];
    const changeHeaderText = () => {
        if (dropDown && textBox && ganttInstance.current) {
            const selectedField = dropDown.value;
            const column = ganttInstance.current.treeGrid.grid.getColumnByField(selectedField);
            if (column && textBox.element.value.trim() !== '') {
                column.headerText = textBox.element.value;
                ganttInstance.current.treeGrid.grid.refreshHeader();
            }
        }
    };
    //=========================
    const customizeCell = (args) => {
        const cell = args.cell;
        if (args.column.field === 'Progress' && +cell.innerHTML > 30 &&
            +cell.innerHTML <= 32) {
            cell.setAttribute('style', 'background-color:#336c12;color:white;');
        }
        else if (+cell.innerHTML > 40 && args.column.field === 'Progress') {
            cell.setAttribute('style', 'background-color:#7b2b1d;color:white;');
        }
    };
    //=========================
    return (
        <>
            <div>
                <div style={containerStyle}>
                    <button onClick={updateTask} style={buttonStyle}>
                        Update Task 2
                    </button>
                    <button onClick={updateTaskUsingSetData} style={buttonStyle}>
                        Update Task 2 using setData
                    </button>
                    <button onClick={handleGetValues} style={buttonStyle}>Get Selected Task Value</button>
                    <button onClick={updateKanban} style={buttonStyle}>Update Kanban</button>
                    <button onClick={getAllData} style={buttonStyle}>GetAllData</button>
                    <div >
                        <label htmlFor="switch" >Show/Hide Dependency Line</label>
                        <SwitchComponent id="switch" ref={(scope) => { switchRef = scope; }} checked={false} change={change} />
                    </div>
                    <DropDownListComponent dataSource={alignmentData} index={0} width="100" change={changeAlignment}></DropDownListComponent>
                    <DropDownListComponent dataSource={dropDownData} index={0} width="100" change={valueChange}></DropDownListComponent>
                </div>
                <div>
                    <label style={null}>Select column name:</label>
                    <DropDownListComponent dataSource={alignmentData2} ref={d => dropDown = d} index={0} width="150" fields={field} />
                    <br />
                    <label style={null}>Enter new header text:</label>
                    <TextBoxComponent ref={t => textBox = t} placeholder="Enter new header text" width='200' />
                    <br />
                    <label style={null}>Click the change button:</label>
                    <ButtonComponent id="button" style={buttonStyle} onClick={changeHeaderText}>Change</ButtonComponent>
                </div>
            </div>
            <div className='control-pane'>
                <div className='control-section'>
                    <GanttComponent
                        ref={ganttInstance}
                        id='LocalData' dataSource={dataManager} highlightWeekends={true}
                        treeColumnIndex={1}
                        dateFormat={'MMM dd, y'} gridLines={gridLines}
                        allowResizing={true}
                        allowFiltering={true}
                        showColumnMenu={false}
                        enableContextMenu={true}  // Right click on a Gantt task
                        contextMenuItems={contextMenuItems} contextMenuOpen={contextMenuOpen.bind(this)} contextMenuClick={contextMenuClick.bind(this)}
                        allowSelection={true} taskFields={taskFields}
                        labelSettings={labelSettings}
                        height='650px' taskbarHeight={25} rowHeight={46}
                        splitterSettings={splitterSettings}
                        projectStartDate={projectStartDate} projectEndDate={projectEndDate}
                        editSettings={editSettings}
                        toolbar={toolbarOptions}
                        actionBegin={actionBegin}
                        actionComplete={actionComplete}
                        resourceFields={resourceFields} resources={editingResources}
                        queryCellInfo={customizeCell}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field='Id' width='80'></ColumnDirective>
                            <ColumnDirective field='Title' width='250' headerText="Title" clipMode="EllipsisWithTooltip"></ColumnDirective>
                            <ColumnDirective field='StartDate' width='130' headerText="Start Date" format={formatOption} clipMode="EllipsisWithTooltip" ></ColumnDirective>
                            <ColumnDirective field='EndDate' width='130' format={formatOption} clipMode="EllipsisWithTooltip"></ColumnDirective>
                            <ColumnDirective field='Duration'></ColumnDirective>
                            <ColumnDirective field='Predecessor'></ColumnDirective>
                            <ColumnDirective field='Progress'></ColumnDirective>
                            <ColumnDirective field='Summary'></ColumnDirective>
                        </ColumnsDirective>
                        <EditDialogFieldsDirective>
                            <EditDialogFieldDirective type='General' headerText='General'></EditDialogFieldDirective>
                            <EditDialogFieldDirective type='Dependency'></EditDialogFieldDirective>
                            <EditDialogFieldDirective type='Resources'></EditDialogFieldDirective>
                            <EditDialogFieldDirective type='Notes'></EditDialogFieldDirective>
                        </EditDialogFieldsDirective>
                        <Inject services={[Selection, DayMarkers, Edit, Toolbar, Resize, ContextMenu, Filter]} />
                    </GanttComponent>
                </div>

            </div>
        </>);
};