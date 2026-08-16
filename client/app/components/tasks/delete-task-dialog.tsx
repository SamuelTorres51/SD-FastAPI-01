import { Loader2 } from "lucide-react";
import type { Task } from "~/lib/schemas/tasks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface DeleteTaskDialogProps {
  isDeleting: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function DeleteTaskDialog({
  isDeleting,
  onConfirm,
  onOpenChange,
  task,
}: DeleteTaskDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={Boolean(task)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir</AlertDialogTitle>
          <AlertDialogDescription>
            A tarefa "{task?.title}" será removida para sempre! Você TEM CERTEZA
            QUE QUER ISSO?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="flex items-center gap-1.5"
            disabled={isDeleting}
            onClick={onConfirm}
            variant="destructive"
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : null}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
