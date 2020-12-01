import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../shared/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public editMode = false;
  public userList;
  public isLoading;
  public priorityValues;
  public date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public taskData: any
  ) { }

  ngOnInit(): void {

    // priority values list
    this.priorityValues = [
      {value: '1', name: 'Low'},
      {value: '2', name: 'Medium'},
      {value: '3', name: 'High'},
    ]

    // define the form and validate it
    this.taskForm = this.formBuilder.group({
      message: ['', Validators.required],
      priority: [''],
      assigned_to: [''],
      due_date: ['']
    });

    // patch values inside the form on edit 
    if (this.taskData) {
      this.editMode = true;
      this.taskForm.patchValue({
        message: this.taskData.message,
        priority: this.taskData.priority,
        assigned_to: this.taskData.assigned_to,
        due_date: this.taskData.due_date ? new Date((this.taskData.due_date).replace(/-/g,"/")) : ''
      });
    }

    // get list of users
    this.getUserList();
  }


  // get list of all users
  getUserList(): void {
    this.dataService.getUserslist().subscribe((res) => {
      if (res.status === 'success') {
        this.userList = res.users;
      }
    }, (err) => {
      this.isLoading = false;
    });

  }

}
