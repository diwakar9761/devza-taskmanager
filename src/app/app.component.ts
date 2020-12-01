import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './add-task/add-task.component';
import { DataService } from './shared/data.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as moment from 'moment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'devza';
  public isLoading = false;
  public searchText = '';
  public taskData = [];
  // public lowPriorityData = [];
  // public mediumPriorityData = [];
  // public highPriorityData = [];
  public lowPriorityTotalData = [];
  public mediumPriorityTotalData = [];
  public highPriorityTotalData = [];

  constructor(
    public dialog: MatDialog,
    public dataService: DataService
  ) {

  }

  // oninit
  ngOnInit(): void {
    this.getTasksList();
  }

  // get all tasks lists
  getTasksList(): void {
    this.isLoading = true;
    this.taskData = [];
    this.dataService.getTasksList().subscribe((res) => {
      this.isLoading = false;
      if (res.status === 'success') {
        this.taskData = res.tasks;
        this.taskData['low'] = this.taskData.filter(it => it.priority == 1);
        this.lowPriorityTotalData = this.taskData['low'];
        this.taskData['medium'] = this.taskData.filter(it => it.priority == 2);
        this.mediumPriorityTotalData = this.taskData['medium'];
        this.taskData['high'] = this.taskData.filter(it => it.priority == 3);
        this.highPriorityTotalData = this.taskData['high'];        
      }
    }, (err) => {
      this.isLoading = false;
    })
  }

  // add new task popup
  addNewTask(): void {
    const dialogRef = this.dialog.open(AddTaskComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addTask(result.value);
      }
    });
  }

  // add new task api call
  addTask(result): void {
    this.isLoading = true;
    let data = new FormData;
    data.append('message', result.message);
    data.append('assigned_to', result.assigned_to);
    data.append('priority', result.priority);
    data.append('due_date', moment(result.due_date).format('YYYY-MM-DD HH:mm:ss'));

    this.dataService.createTask(data).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 'success') {
        Swal.fire('Task created successfully', '', 'success');
        this.getTasksList();
      } else {
        Swal.fire('Something went wrong', '', 'error');
      }
    }, (err) => {
      this.isLoading = false;
      Swal.fire('Something went wrong', '', 'error');
    })
  }

  // filter listing
  filterList(event) : void {
    if(event.target.value) {
      let searchText = event.target.value.toLowerCase();
      this.taskData['low'] = this.lowPriorityTotalData.filter(it => it.message.includes(searchText));
      this.taskData['medium'] = this.mediumPriorityTotalData.filter(it => it.message.includes(searchText));
      this.taskData['high'] = this.highPriorityTotalData.filter(it => it.message.includes(searchText));
    } else {
      this.taskData['low'] = this.lowPriorityTotalData; 
      this.taskData['medium'] = this.mediumPriorityTotalData; 
      this.taskData['high'] = this.highPriorityTotalData; 
    }
  }

  // drag and drop
  drop(event: CdkDragDrop<string[]>) {
    let result = event.item.data;
    let priority = event.container.data;
    
    this.isLoading = true;
    let data = new FormData;
    data.append('taskid', result.id);
    data.append('message', result.message);
    data.append('assigned_to', result.assigned_to);
    data.append('priority', JSON.stringify(priority));
    data.append('due_date', moment(result.due_date).format('YYYY-MM-DD HH:mm:ss'));

    this.dataService.updateTask(data).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 'success') {
        Swal.fire('Task updated successfully', '', 'success');
        this.getTasksList();
      } else {
        Swal.fire('Something went wrong', '', 'error');
      }
    }, (err) => {
      this.isLoading = false;
      Swal.fire('Something went wrong', '', 'error');
    })
  }
  
}
