export enum TaskPriority {
  HIGH = 'HIGH',
  STANDARD = 'STANDARD',
  LOW = 'LOW'
}

export enum TaskType {
  AAP = 'AAP',
  AO = 'AO',
  OTHER = 'OTHER'
}

export interface Task {
  id: string;
  type: TaskType;
  deadline?: Date;
  budget?: number;
}