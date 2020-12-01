import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { AddTaskComponent } from '../add-task/add-task.component';
import { DataService } from '../shared/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() taskData;
  @Output() updateTaskList = new EventEmitter();
  public priority;
  public isLoading = false;

  constructor(
    public dataService: DataService,
    public dialog: MatDialog
  ) { }

  // oninit
  ngOnInit(): void {

  }

  // edit task
  editTask(task): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      data: task,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTask(task.id, result.value);
      }
    });
  }

  // update task
  updateTask(id, result) : void {
    this.isLoading = true;
    let data = new FormData;
    data.append('taskid', id);
    data.append('message', result.message);
    data.append('assigned_to', result.assigned_to);
    data.append('priority', result.priority);
    data.append('due_date', moment(result.due_date).format('YYYY-MM-DD HH:mm:ss'));

    this.dataService.updateTask(data).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 'success') {
        Swal.fire('Task updated successfully', '', 'success');
        this.updateTaskList.emit();
      } else {
        Swal.fire('Something went wrong', '', 'error');
      }
    }, (err) => {
      this.isLoading = false;
      Swal.fire('Something went wrong', '', 'error');
    })
  }

  // delete task
  deleteTask(task): void {
    this.isLoading = true;
    let data = new FormData;
    data.append('taskid', task.id);

    this.dataService.deleteTask(data).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 'success') {
        Swal.fire('Task deleted successfully', '', 'success');
        this.updateTaskList.emit();
      } else {
        Swal.fire('Something went wrong', '', 'error');
      }
    }, (err) => {
      this.isLoading = false;
      Swal.fire('Something went wrong', '', 'error');
    })
  }

  // get priority
  getPriority(priority): void {
    if (priority == 1) {
      this.priority = 'low';
      return this.priority;
    } else if (priority == 2) {
      this.priority = 'medium';
      return this.priority;
    } else {
      this.priority = 'high';
      return this.priority;
    }
  }

  // sorting
  sortData(sort: Sort): void {
    const data = this.taskData.slice();
    if (!sort.active || sort.direction === '') {
      this.taskData = data;
      return;
    }

    this.taskData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'message': return this.compare(a.message, b.message, isAsc);
        case 'due_date': return this.compare(a.due_date, b.due_date, isAsc);
        case 'assigned_name': return this.compare(a.assigned_name, b.assigned_name, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


}
