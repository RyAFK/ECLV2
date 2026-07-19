"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { PriorityBadge } from "@/components/referrals/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { useTasks } from "@/lib/supabase/hooks";
import type { TaskItem } from "@/lib/types";

export default function TasksPage() {
  const { showToast } = useToast();
  const { tasks, toggleComplete: toggleTaskComplete, removeTask: removeTaskById, createTask: createTaskRemote } = useTasks();
  const [createOpen, setCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", reason: "", due: "", priority: "Medium" as TaskItem["priority"], partnerName: "" });

  const overdue = tasks.filter((t) => !t.completed && t.dueSort < 0);
  const today = tasks.filter((t) => !t.completed && t.dueSort === 0);
  const upcoming = tasks.filter((t) => !t.completed && t.dueSort > 0);
  const completed = tasks.filter((t) => t.completed);

  function toggleComplete(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (task) toggleTaskComplete(id, !task.completed);
  }

  function removeTask(id: string) {
    removeTaskById(id);
    showToast({ variant: "info", title: "Task deleted" });
  }

  async function createTask() {
    if (!newTask.title.trim()) return;
    await createTaskRemote(newTask);
    setCreateOpen(false);
    setNewTask({ title: "", reason: "", due: "", priority: "Medium", partnerName: "" });
    showToast({ variant: "success", title: "Task created" });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">Tasks</h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Business development and relationship follow-up tasks.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create task
        </Button>
      </div>

      <TaskSection title="Overdue" items={overdue} onToggle={toggleComplete} onDelete={removeTask} />
      <TaskSection title="Today" items={today} onToggle={toggleComplete} onDelete={removeTask} />
      <TaskSection title="Upcoming" items={upcoming} onToggle={toggleComplete} onDelete={removeTask} />
      <TaskSection title="Completed" items={completed} onToggle={toggleComplete} onDelete={removeTask} />

      {tasks.length === 0 && <p className="text-sm text-[var(--text-secondary)]">No tasks yet.</p>}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create task"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createTask}>Create task</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Task title" htmlFor="task-title" required>
            <Input id="task-title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
          </Field>
          <Field label="Reason" htmlFor="task-reason">
            <Textarea id="task-reason" value={newTask.reason} onChange={(e) => setNewTask({ ...newTask, reason: e.target.value })} />
          </Field>
          <Field label="Linked partner" htmlFor="task-partner">
            <Input id="task-partner" value={newTask.partnerName} onChange={(e) => setNewTask({ ...newTask, partnerName: e.target.value })} />
          </Field>
          <Field label="Due date" htmlFor="task-due">
            <Input id="task-due" value={newTask.due} onChange={(e) => setNewTask({ ...newTask, due: e.target.value })} placeholder="e.g. Tomorrow" />
          </Field>
          <Field label="Priority" htmlFor="task-priority">
            <Select id="task-priority" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskItem["priority"] })}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </Select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}

function TaskSection({
  title,
  items,
  onToggle,
  onDelete,
}: {
  title: string;
  items: TaskItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-3 font-serif-display text-lg font-semibold text-[var(--text)]">
        {title} <span className="text-sm font-normal text-[var(--text-secondary)]">({items.length})</span>
      </p>
      <div className="flex flex-col gap-3">
        {items.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-start gap-3">
              <button
                aria-label={task.completed ? "Reopen task" : "Complete task"}
                onClick={() => onToggle(task.id)}
                className="mt-0.5 shrink-0 text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
              >
                {task.completed ? <CheckCircle2 className="h-5 w-5 text-[var(--success)]" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={`text-sm font-medium ${task.completed ? "text-[var(--text-secondary)] line-through" : "text-[var(--text)]"}`}>
                    {task.title}
                  </p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{task.reason}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
                  <span>Due: {task.due}</span>
                  {task.partnerName && <span>Partner: {task.partnerName}</span>}
                </div>
              </div>
              <button
                aria-label="Delete task"
                onClick={() => onDelete(task.id)}
                className="shrink-0 rounded-full p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--danger)]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
