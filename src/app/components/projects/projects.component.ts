import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { Project } from 'src/app/models/project';
import { Router } from '@angular/router';
import { throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Project[];
  constructor(private appService: AppService,
              private router: Router) { }

  ngOnInit() {
    this.appService.getProjects().subscribe(projects => this.projects = projects);
  }

  showProject(project: Project) {
    this.router.navigate(['/projects', project.id]);
  }

  deleteProject(project: Project) {
    this.appService.deleteProject(project.id).subscribe(success => {
      const index = this.projects.findIndex(p => p === project);
      if (index !== -1) {
        this.projects.splice(index, 1);
      }
    });
  }

  addProject() {
    this.router.navigate(['/projects', 'CREATE']);
  }
}
