import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { randomUUID } from 'crypto';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    try {
      if (!this.tasks.length) {
        throw new NotFoundException('No tasks found');
      }
      return this.tasks;
    } catch (error) {
      throw error;
    }
  }

  getTaskById(id: string): Task {
    try {
      const task = this.tasks.find((task) => task.id === id);
      if (!task) {
        throw new NotFoundException(`Task with id ${id} not found`);
      }
      return task;
    } catch (error) {
      throw error;
    }
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    try {
      if (status) {
        tasks = tasks.filter((task) => task.status === status);
      }
      if (search) {
        tasks = tasks.filter((task) => {
          if (
            task.title.includes(search) ||
            task.description.includes(search)
          ) {
            return true;
          }
          return false;
        });
      }
      if (!tasks.length) {
        throw new NotFoundException('No tasks match the given filters');
      }
      return tasks;
    } catch (error) {
      throw error;
    }
  }

  createTask(createTaskDto: createTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: randomUUID(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    if (!this.getTaskById(id)) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
