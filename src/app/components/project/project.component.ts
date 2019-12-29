import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { Project } from 'src/app/models/project';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { Task } from 'src/app/models/task';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  project: Project;
  mode: string;
  tasks: Task[];
  users: User[];
  projectForm: FormGroup;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private appService: AppService) { }

  ngOnInit() {

    this.appService.getUsers().subscribe(users => this.users = users);

    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id === 'CREATE') {
        this.mode = 'CREATE';
        this.project = new Project();
        this.createForm();
      } else {
        this.mode = 'VIEW';

        forkJoin([this.appService.getProjectById(id),
        this.appService.getTasks(id)
        ]).subscribe(([project, tasks]) => {
          this.project = project;
          this.tasks = tasks;

          if (this.tasks){
            this.tasks.forEach(e => {
              let userObj = this.users.find(d => +e.assignee_id === d.id)
              e['username'] = userObj.username;
            })
          }

          this.createForm();
        });

      }
    });
  }

  createForm() {
    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name),
      description: new FormControl(this.project.description),
      duration: new FormControl(this.project.duration),
      avatar: new FormControl(this.project.avatar)
    });
    if (this.mode === 'VIEW') {
      this.projectForm.disable();
    }
  }

  edit() {
    this.mode = 'EDIT';
    this.projectForm.enable();
  }

  submit() {
    if (this.project.id) {
      this.appService.editProject(this.project.id, this.projectForm.value).subscribe(response => {
        this.mode = 'VIEW';
        this.project = { ...this.project, ...this.projectForm.value };
        this.projectForm.disable();
      });
    } else {
      this.appService.createProject(this.projectForm.value).subscribe(response => {
        this.router.navigate(['/projects']);
      });
    }
  }

  cancel() {
    this.projectForm.patchValue(this.project);
    if (this.project.id) {
      this.mode = 'VIEW';
      this.projectForm.disable();
    } else {
      this.router.navigate(['projects']);
    }
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.project.avatar = myReader.result as string;
      this.projectForm.get('avatar').setValue(this.project.avatar);
    };
    myReader.readAsDataURL(file);
  }

  deleteTask(task: Task) {
    this.appService.deleteTask(task).subscribe(success => {
      const index = this.tasks.findIndex(t => t === task);
      if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  });
}

}
