import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project';
import { Task } from '../models/task';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SubTask } from '../models/subtask';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  BASE_URL = '/api/';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<any>(this.BASE_URL + 'project/').pipe(map(response => response.Projects));
  }

  getProjectById(id: string) {
    return this.http.get<Project>(`${this.BASE_URL}project/${id}`);
  }

  createProject(project: Project) {
    return this.http.post(`${this.BASE_URL}project/create/`, project);
  }

  editProject(id: string, project: Project) {
    return this.http.put(`${this.BASE_URL}project/${id}/`, project);
  }

  deleteProject(id: string) {
    return this.http.delete(`${this.BASE_URL}project/${id}`);
  }

  getTasks(projectId: string): Observable<Task[]> {
    return this.http.get<any>(`${this.BASE_URL}project/${projectId}/task/`).pipe(map(response => response.Tasks));
  }

  getTaskById(projectId: string, taskId: string) {
    return this.http.get<Task>(`${this.BASE_URL}project/${projectId}/task/${taskId}`);
  }

  createTask(projectId: string, task: Task) {
    return this.http.post(`${this.BASE_URL}project/${projectId}/task/create/`, task);
  }

  editTask(projectId: string, taskId: string, task: Task) {
    return this.http.put(`${this.BASE_URL}project/${projectId}/task/${taskId}/`, task);
  }

  deleteTask(task: Task) {
    return this.http.delete(`${this.BASE_URL}project/${task.project_id}/task/${task.id}`);
  }

  getUsers(): Observable<User[]>{
    return this.http.get<any>(`${this.BASE_URL}user/`).pipe(map(response => response.Users));
  }

  getSubTasks(projectId: string, taskId: string): Observable<SubTask[]> {
    return this.http.get<any>(`${this.BASE_URL}project/${projectId}/task/${taskId}/subtask/`).pipe(map(response => response.Subtasks));
  }

}
