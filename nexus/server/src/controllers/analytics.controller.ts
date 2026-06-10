import { Response } from 'express'
import { AuthRequest } from '../middleware/firebaseAuth'
import { User } from '../models/User'
import { Project } from '../models/Project'
import { Task } from '../models/Task'

export async function getDashboardStats(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!._id

    const [
      totalProjects,
      activeProjects,
      pausedProjects,
      completedProjects,
      archivedProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      highPriorityTasks,
      recentProjects,
    ] = await Promise.all([
      Project.countDocuments({ userId }),
      Project.countDocuments({ userId, status: 'active' }),
      Project.countDocuments({ userId, status: 'paused' }),
      Project.countDocuments({ userId, status: 'completed' }),
      Project.countDocuments({ userId, status: 'archived' }),
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'done' }),
      Task.countDocuments({ userId, status: 'in_progress' }),
      Task.countDocuments({ userId, status: 'todo' }),
      Task.countDocuments({ userId, priority: 'high', status: { $ne: 'done' } }),
      Project.find({ userId }).sort({ updatedAt: -1 }).limit(5).select('name status color updatedAt taskCount completedTasks'),
    ])

    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

    // Tasks created per day for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const taskTrend = await Task.aggregate([
      { $match: { userId, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          created:   { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ])

    return res.json({
      success: true,
      data: {
        // Counts
        totalProjects,
        activeProjects,
        pausedProjects,
        completedProjects,
        archivedProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        highPriorityTasks,
        completionRate,
        // Charts
        projectsByStatus: [
          { name: 'Active',    value: activeProjects,    color: '#22c55e' },
          { name: 'Paused',    value: pausedProjects,    color: '#eab308' },
          { name: 'Completed', value: completedProjects, color: '#6366f1' },
          { name: 'Archived',  value: archivedProjects,  color: '#374151' },
        ],
        tasksByStatus: [
          { name: 'To Do',       value: todoTasks,        color: '#6b7280' },
          { name: 'In Progress', value: inProgressTasks,  color: '#eab308' },
          { name: 'Done',        value: completedTasks,   color: '#22c55e' },
        ],
        taskTrend,
        recentProjects,
      },
    })
  } catch (err) {
    console.error('getDashboardStats error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

export async function getAdminStats(req: AuthRequest, res: Response) {
  try {
    const [totalUsers, totalProjects, proUsers, enterpriseUsers] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      User.countDocuments({ plan: 'pro' }),
      User.countDocuments({ plan: 'enterprise' }),
    ])

    return res.json({
      success: true,
      data: { totalUsers, totalProjects, proUsers, enterpriseUsers },
    })
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}
