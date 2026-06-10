import { Schema, model, Document, Types } from 'mongoose'

export interface ITask extends Document {
  projectId: Types.ObjectId
  userId:    Types.ObjectId
  title:     string
  description?: string
  status:    'todo' | 'in_progress' | 'done'
  priority:  'low' | 'medium' | 'high'
  dueDate?:  Date
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    projectId:   { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    userId:      { type: Schema.Types.ObjectId, ref: 'User',    required: true, index: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status:      { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    priority:    { type: String, enum: ['low', 'medium', 'high'],       default: 'medium' },
    dueDate:     { type: Date },
  },
  { timestamps: true }
)

export const Task = model<ITask>('Task', TaskSchema)
