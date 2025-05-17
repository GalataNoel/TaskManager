const Task = require('../models/Task');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllTasks = catchAsync(async (req, res, next) => {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: {
            tasks
        }
    });
});

exports.createTask = catchAsync(async (req, res, next) => {
    const { title, description } = req.body;

    const newTask = await Task.create({
        title,
        description,
        user: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: {
            task: newTask
        }
    });
});

exports.updateTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const task = await Task.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { title, description },
        { new: true, runValidators: true }
    );

    if (!task) {
        return next(new AppError('No task found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            task
        }
    });
});

exports.toggleTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
        return next(new AppError('No task found with that ID', 404));
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
        status: 'success',
        data: {
            task
        }
    });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!task) {
        return next(new AppError('No task found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});