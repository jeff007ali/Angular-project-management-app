import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';
import { SubTask } from 'src/app/models/subtask';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/models/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  providers: [ DatePipe ]
})
export class TaskComponent implements OnInit {

  task: Task;
  mode: string;
  subTasks: SubTask[];
  users: User[];
  projectId: string;

  taskForm: FormGroup;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private appService: AppService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      const id = params.get('id');
      if (id === 'CREATE') {
        this.mode = 'CREATE';
        this.task = new Task();
        this.createForm();
      } else {
        this.mode = 'VIEW';

        forkJoin([this.appService.getTaskById(this.projectId, id),
        this.appService.getSubTasks(this.projectId, id),
        ]).subscribe(([task, subTasks]) => {
          this.task = task;
          this.subTasks = subTasks;
          this.createForm();
        });

      }
      this.appService.getUsers().subscribe(users => this.users = users);
    });
  }

  createForm() {
    this.taskForm = new FormGroup({
      name: new FormControl(this.task.name),
      description: new FormControl(this.task.description),
      startDate: new FormControl(this.datePipe.transform(this.task.startDate, 'yyyy-MM-dd')),
      endDate: new FormControl(this.datePipe.transform(this.task.endDate, 'yyyy-MM-dd')),
      assignee_id: new FormControl(this.task.assignee_id)
    });
    if (this.mode === 'VIEW') {
      this.taskForm.disable();
    }
  }

  edit() {
    this.mode = 'EDIT';
    this.taskForm.enable();
  }

  submit() {
    const task: Task = this.taskForm.value;
    task.startDate = new Date(this.taskForm.value.startDate).getTime();
    task.endDate = new Date(this.taskForm.value.endDate).getTime();
    if (this.task.id) {
      this.appService.editTask(this.task.project_id, this.task.id, this.taskForm.value).subscribe(response => {
        this.mode = 'VIEW';
        this.task = { ...this.task, ...this.taskForm.value };
        this.taskForm.disable();
      });
    } else {
      this.appService.createTask(this.projectId, this.taskForm.value).subscribe(response => {
        this.router.navigate(['/projects', this.projectId]);
      });
    }
  }

  cancel() {
    this.taskForm.patchValue(this.task);
    if (this.task.id) {
      this.mode = 'VIEW';
      this.taskForm.disable();
    } else {
      this.router.navigate(['projects',this.projectId]);
    }
  }
}
