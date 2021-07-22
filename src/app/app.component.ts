import { Component, OnInit } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  todos = [];
  todoList: any[];
  newTodo: any = { task: '' };
  newSubTodo: any = { task: '' };
  editTodo: any = { id: '' };
  selectedTodoIndex: number = null;
  subTodoList: any[]


  constructor() { }

  ngOnInit() {
    this.loadTodo();
  }

  todoName(): string {
    return 'todos';
  }

  stateName(): string {
    return 'nowShowing';
  }

  getState() {
    return localStorage.getItem(this.stateName()) !== null ? localStorage.getItem(this.stateName()) : '';
  }

  getTodos() {
    let todoTasks = [];

    if (localStorage.getItem(this.todoName()) !== null) {
      todoTasks = JSON.parse(localStorage.getItem(this.todoName()));
    }
    return todoTasks;
  }

  setTodos() {
    localStorage.setItem(this.todoName(), JSON.stringify(this.todos));
    this.loadTodo();
  }

  loadTodo() {
    this.todos = this.getTodos();
    this.todoList = this.todos;
    this.subTodoList = this.todos[this.selectedTodoIndex].subTodos;
  }

  addTodo(todoForm: NgForm) {
    const todo = todoForm.value;
    if (todo.task !== '') {
      this.todos.push({
        completed: false,
        id: Math.random().toString(36).substring(7),
        title: todo.task,
        subTodos: []
      });
      this.setTodos();
      todoForm.reset();
    }
  }

  async addSubTodo(subTodoForm: NgForm) {
    const todo = subTodoForm.value;
    if (todo.task !== '') {
      this.todos[this.selectedTodoIndex].subTodos.push(todo.task);
      console.log(this.todos);
      await this.setTodos();
    }
  }

  hasEditTodo(task) {
    this.editTodo = task;
  }

  updateTodo(task) {
    if (task.title !== '') {
      this.todos.forEach((element: any) => {
        if (element.id === task.id) {
          element.title = task.title;
          this.setTodos();
          this.editTodo = {};
        }
      });
    }
  }

  async deleteTodo(task) {
    const index = this.todos.indexOf(task);
    this.todos.splice(index, 1);
    this.selectedTodoIndex = null;
    await this.setTodos();
  }

  viewTodos(index) {
    this.selectedTodoIndex = index;
    this.subTodoList = this.todos[this.selectedTodoIndex].subTodos;
  }

  async deleteSubTodo(index) {
    this.todos[this.selectedTodoIndex].subTodos.splice(index, 1);
    await this.setTodos();
    await this.loadTodo();
  }
}
