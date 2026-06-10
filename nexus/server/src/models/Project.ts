import { Schema, model, Document, Types } from 'mongoose'

export interface IProject extends Document {
  userId:         Types.ObjectId
  name:           string
  description?:   string
  status:         'active' | 'paused' | 'completed' | 'archived'
  color:          string
  icon:           string
  tags:           string[]
  memberCount:    number
  taskCount:      number
  completedTasks: number
  createdAt:      Date
  updatedAt:      Date
}

const ProjectSchema = new Schema<IProject>(
  {
    userId:         { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name:           { type: String, required: true, trim: true },
    description:    { type: String, trim: true },
    status:         { type: String, enum: ['active', 'paused', 'completed', 'archived'], default: 'active' },
    color:          { type: String, default: '#6366f1' },
    icon:           { type: String, default: 'folder' },
    tags:           [{ type: String }],
    memberCount:    { type: Number, default: 1 },
    taskCount:      { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Project = model<IProject>('Project', ProjectSchema)
