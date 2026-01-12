import { Layout } from "@/components/Layout";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useState, useRef, useEffect} from "react";
import { useToast } from "@/hooks/use-toast";
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';
import { 
  GanttComponent, 
  Inject, 
  Selection, 
  Toolbar, 
  Edit, 
  Filter, 
  Sort, 
  Resize, 
  DayMarkers,
  ColumnsDirective,
  ColumnDirective,
  ContextMenu,
} from '@syncfusion/ej2-react-gantt';
import { DialogComponent } from '@syncfusion/ej2-react-popups'
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import './GanttChart.css';
import styled from 'styled-components';


const MyButton = styled.button`
  background: blue;
  color: white;
  padding: 10px 20px;
`;


export const taskFields = {
  id: 'id',
  name: 'taskName',
  startDate: 'startDate',
  endDate: 'endDate',
  duration: 'duration',
  progress: 'progress',
  parentID: 'parentId',
  dependency: 'predecessor',
  status: 'status',
  wbs: 'wbs',
  priority: 'priority',
  resourceInfo: 'assignee',
  info: 'info'
};

export const editSettings = {
  allowAdding: true,
  allowEditing: true,
  allowDeleting: true,
  allowTaskbarEditing: true,
  showDeleteConfirmDialog: true
};

export const toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'];

export const progressTemplate = (props: any) => {
  return (
    <div className="w-full flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${
            props.progress === 100 ? 'bg-green-500' : 
            props.progress > 50 ? 'bg-blue-500' : 'bg-orange-400'
          }`}
          style={{ width: `${props.progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8">{props.progress}%</span>
    </div>
  );
};

// Your Custom Dialog Component
  const CustomDialog = ({ isOpen, data, title, onSave, onClose }) => {
    const [taskName, setTaskName] = useState(data?.taskName || '');
    const [resource, setResource] = useState(data?.resource || '');
    const [parentId, setParentId] = useState(data?.parentId || '');
    const [wbs, setWbs] = useState(data?.wbs || '');

    useEffect(() => {
        setTaskName(data?.taskName || '');
        setResource(data?.resource || '');
        setParentId(data?.parentId || '');
        setWbs(data?.wbs || '');
    }, [data]);

    const saveHandler = () => {
        console.log(`Saving: taskName: ${taskName } resource: ${resource}  parentId: ${parentId} wbs: ${wbs}`);
        onSave();
    };

    return (
      <DialogComponent
        visible={isOpen}
        header={title}
        showCloseIcon={true}
        width="350px"
        buttons={[{ buttonModel: { content: 'Save', isPrimary: true }, click: saveHandler }, { buttonModel: { content: 'Cancel' }, click: onClose }]}
        target=".e-gantt" // Ensure dialog is modal to the gantt
        overlayClick={onClose}
      >
        <div>
            <div>
          <label>Task Name: </label>
          <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>
          <div>
              <label>Resource: </label>
              <input type="text" value={resource} onChange={(e) => setResource(e.target.value)} />
            </div>
            <div>
                          <label>Parent: </label>
                          <input type="text" value={parentId} onChange={(e) => setResource(e.target.value)} />
                        </div>
            <div>
                          <label>WBS: </label>
                          <input type="text" value={wbs} onChange={(e) => setResource(e.target.value)} />
                        </div>
        </div>
      </DialogComponent>
    );
  }

interface GanttChartCoreProps {
  showHeader?: boolean;
}

export function GanttChartCore({ showHeader = false }: GanttChartCoreProps) {
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { toast } = useToast();
  const ganttInstance = useRef<GanttComponent>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTaskData, setCurrentTaskData] = useState(null)
    const [dialogTitle, setDialogTitle] = useState('');

const handleDoubleClick = (args: any) => {
  console.log('Row double-clicked!', args.rowData);
  // use this to figure out the wbs, parentid, dependency
  const taskName = ganttInstance.current.updatedRecords[0].taskName;

        //args.cancel = true; // Prevents default Syncfusion dialog
        args.rowData.resource = 'Resource';
        args.rowData.parentId = 3;
        args.rowData.wbs = '1.3.3';
        setCurrentTaskData(args.rowData);
        setDialogTitle('New Task' );
        setIsDialogOpen(true);

   return;
};


  const actionBegin = (args: any) => {

  console.log(`actionBegin name: ${args?.name} requestType: ${args?.requestType} action: ${args?.action}`);




    if(args.requestType === 'refresh') {

    } else if(args.requestType === 'beforeOpenAddDialog') {
           //        args.rowData.parentId = null; Not Needed
               }
    if(args.requestType === 'beforeAdd' && args.action === 'beforeAdd') {
            // Here is how we can get the TaskRecords
            const taskName = ganttInstance.current.updatedRecords[0].taskName;

            let taskId = 6;
            args.newTaskData.taskName = `child of: ${taskId} ${args.data.taskName}`
            args.newTaskData.parentId = taskId; //args.modifiedTaskData[0]?.id;
            args.newTaskData.predecessor = `1FS`;


//    args.newTaskData.parentId = null;
//args.rowPosition = 'Top'
        }
    // const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('e-rhandler e-rcursor');
    // console.log(elements);
    // const targetString = 'e-rhandler e-rcursor';
    // if(document.getElementsByClassName() === targetString){
    //   console.log("found component");
    // }
  }
  const handleActionComplete = (args: any) => {
    // if(args.requestType !== 'scroll'){
    //   console.log(`requesti Type: ${args.requestType}   action: ${args.action}`);
    // }
    console.log(`actionComplete name: ${args?.name} type: ${args?.type} requestType: ${args?.requestType} action: ${args?.action}`);

    if((args.requestType ==='scroll' && args.action === 'HorizontalScroll')
    || args.requestType === 'scroll'
    || args.requestType === 'refresh'
    || args.type === 'refresh'
    || args.requestType === 'openEditDialog') {
//     } else if (args.requestType === 'add' && args.action === 'add')
//     {
//        args.newTaskData.taskName = `child of: ${args.data.id} ${args.data.taskName}`
//        args.newTaskData.parentId = args.modifiedTaskData[0].id;
//        args.newTaskData.predecessor = `${args.modifiedTaskData[0].id}FS`;

    } else if (args.requestType === 'openAddDialog' && args.action === 'OpenDialog')
    {
    // Here is where I can set some stuff
    } else if ((args.requestType === 'add' && args.action === 'add')
    ||/*args.requestType === 'save' && */args.action === 'add')
    {

      const taskData = args.newTaskData;
      createTask.mutate({
        taskName: taskData.taskName,
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        duration: taskData.duration,
        progress: taskData.progress || 0,
        status: taskData.status || 'Open',
        priority: taskData.priority,
        parentId: Number(taskData.parentId),
        wbs: taskData.wbs,
        assignee: taskData.assignee,
        predecessor: taskData.predecessor,
        info: taskData.info,
      }, {
        onSuccess: () => toast({ title: "Task created successfully" }),
        onError: () => toast({ title: "Failed to create task", variant: "destructive" }),
      });

    } else if (args.requestType === 'save' && (
    args.action === 'DialogEditing'
    || args.action === 'TaskbarEditing'
    || args.action === 'CellEditing'))
    {
      const taskData = args.data;
      console.log(`duration: ${args.data.duration} typeofduration: ${typeof(args.data.duration)} startdate: ${args.data.startDate} typeofstartdate: ${typeof(args.data.startDate)} id: ${args.data.id} typeofid: ${typeof(args.data.id)} `);
      updateTask.mutate({
        id: taskData.id,
        data: {
          taskName: taskData.taskName,
          startDate: taskData.startDate,
          endDate: taskData.endDate,
          duration: taskData.duration,
          progress: taskData.progress,
          status: taskData.status,
          priority: taskData.priority,
          parentId: taskData.parentId,
          wbs: taskData.wbs,
          assignee: taskData.assignee,
        predecessor: taskData.predecessor,
          info: taskData.info,
        },
      }, {
        onSuccess: () => toast({ title: "Task updated successfully" }),
        onError: () => toast({ title: "Failed to update task", variant: "destructive" }),
      });
    } else if (args.requestType === 'delete') {
      const taskData = args.data?.[0];
      if (taskData?.id) {
        deleteTask.mutate(taskData.id, {
          onSuccess: () => toast({ title: "Task deleted successfully" }),
          onError: () => toast({ title: "Failed to delete task", variant: "destructive" }),
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredTasks = tasks?.filter((task: any) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter;
    const matchesSearch = !searchTerm || (
      (task.taskName && task.taskName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (task.wbs && task.wbs.includes(searchTerm)) ||
      (task.id && task.id.toString() === searchTerm) ||
      (task.id && task.id.toString().includes(searchTerm))
    );

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
  };
const contextMenuOpen = (args) => {
            let record = args.rowData;
            console.log(`contextMenuOpen`);
            if(args.name === 'contextMenuOpen' && args.type === 'Content') {
                if(args.items[0].text === 'Task Information') {
                // Here we show that the dialog objects are backed by
                // Javascript objects.  We change attributes to affect
                // the dialog
                    args.items[0].text = `Edit Selected`;
                }
            }
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
            if (args.item.id === 'hidecols') {
                ganttInstance.current.hideColumn(args.column!.headerText);
            }
        };
        const contextMenuItems = ['AutoFitAll', 'AutoFit', 'TaskInformation', 'DeleteTask', 'Save', 'Cancel',
            'SortAscending', 'SortDescending', 'Add', 'DeleteDependency', 'Convert', 'Indent', 'Outdent',
            { text: 'Collapse the Row', target: '.e-content', id: 'collapserow' },
            { text: 'Expand the Row', target: '.e-content', id: 'expandrow' },
            { text: 'Hide Column', target: '.e-gridheader', id: 'hidecols' } as ContextMenuItemModel];
        function change() {
            const ganttDependencyViewContainer = document.querySelector('.e-gantt-dependency-view-container');
            if (switchRef.checked) {
                ganttDependencyViewContainer.style.visibility = 'hidden';
            } else {
                ganttDependencyViewContainer.style.visibility  = 'visible';
            }
        }
         const openAddDialog = () => {
                ganttInstance.current.editModule.dialogModule.openAddDialog();
            };
const handleCustomSave = (updatedData) => {
    if (ganttInstance.current) {
    //  You can do this, but I suggest creating the args for Handle Complete

      if (currentTaskData.TaskID) { // Check if it's an existing task
//        ganttInstance.current.updateRecordByID(updatedData);
      } else { // It's a new task
//        ganttInstance.current.addRecord(updatedData, 'Top');
      }
    }
    setIsDialogOpen(false);
    setCurrentTaskData(null);
  };

  const handleCustomClose = () => {
    setIsDialogOpen(false);
    setCurrentTaskData(null);
  }
  return (
    <div className="h-full flex flex-col space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Timeline</h1>
            <p className="text-muted-foreground">Manage project schedules and dependencies.</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary/30 transition-all active:scale-95">
            Export Report
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, WBS or ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-gantt"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-status-filter-gantt">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
              <SelectItem value="Close">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-priority-filter-gantt">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-assignee-filter-gantt">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="Jane Doe">Jane Doe</SelectItem>
              <SelectItem value="Alex Smith">Alex Smith</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-reset-filters-gantt"
          >
            <FilterX className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredTasks?.length} tasks
          </div>
        </div>
        <ButtonComponent onClick={openAddDialog}>Open Add Dialog</ButtonComponent>
      </div>

      <div className="flex-1 bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden p-1">
        <GanttComponent
          ref={ganttInstance}
          dataSource={filteredTasks}
          key={JSON.stringify({ searchTerm, statusFilter, priorityFilter, assigneeFilter })}
          taskFields={taskFields}
          height="100%"
          treeColumnIndex={2}
          allowSelection={true}
          allowFiltering={true}
          allowSorting={true}
          allowResizing={true}
          highlightWeekends={true}
          toolbar={toolbar}
          editSettings={editSettings}
          enableContextMenu={true}  // Right click on a Gantt task
          contextMenuItems={contextMenuItems}
          contextMenuOpen={contextMenuOpen.bind(this)}
          contextMenuClick={contextMenuClick.bind(this)}
          projectStartDate={new Date('2024-04-01')}
          projectEndDate={new Date('2024-12-31')}
          gridLines="Both"
          labelSettings={{ leftLabel: 'taskName' }}
          splitterSettings={{ position: '45%' }}
          rowHeight={45}
          taskbarHeight={30}
          actionBegin={actionBegin}
          actionComplete={handleActionComplete}
          beginEdit={(args: any) => {
            if (args.columnIndex !== undefined) {
              args.cancel = true;
            }
          }}
        >
          <ColumnsDirective>
            <ColumnDirective field='wbs' headerText='WBS' width='70' textAlign='Left'></ColumnDirective>
            <ColumnDirective field='id' headerText='ID' width='70' textAlign='Left'></ColumnDirective>
            <ColumnDirective field='taskName' headerText='Task Name' width='250' clipMode='EllipsisWithTooltip'></ColumnDirective>
            <ColumnDirective field='assignee' headerText='Assignee' width='120'></ColumnDirective>
            <ColumnDirective field='info' headerText='Info' width='200' clipMode='EllipsisWithTooltip'></ColumnDirective>
            <ColumnDirective field='priority' headerText='Priority' width='100'></ColumnDirective>
            <ColumnDirective field='status' headerText='Status' width='120'></ColumnDirective>
            <ColumnDirective field='startDate' headerText='Start Date' width='120' format='yMd' textAlign='Right'></ColumnDirective>
            <ColumnDirective field='endDate' headerText='End Date' width='120' format='yMd' textAlign='Right'></ColumnDirective>
            <ColumnDirective field='duration' headerText='Duration' width='90' textAlign='Right'></ColumnDirective>
            <ColumnDirective field='progress' headerText='Progress' width='120' template={progressTemplate} textAlign='Left'></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Selection, Toolbar, Edit, Filter, Sort, Resize, DayMarkers, ContextMenu]} />
        </GanttComponent>
      </div>
      <CustomDialog
              isOpen={isDialogOpen}
              data={currentTaskData}
              title={dialogTitle}
              onSave={handleCustomSave}
              onClose={handleCustomClose}
            />
    </div>
  );
}

export default function GanttChart() {
  return (
    <Layout>
      <GanttChartCore showHeader={true} />
    </Layout>
  );
}
