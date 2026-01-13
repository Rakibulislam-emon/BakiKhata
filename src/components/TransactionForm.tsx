import React from "react";
import { Plus, User, DollarSign, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    amount: string;
    notes: string;
    type: "lend" | "borrow";
  };
  setFormData: (data: {
    name: string;
    amount: string;
    notes: string;
    type: "lend" | "borrow";
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TransactionForm = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
}: TransactionFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center sm:text-left">
            নতুন লেনদেন যোগ করুন
          </DialogTitle>
          <DialogDescription className="text-center sm:text-left text-secondary-500">
            লেনদেনের বিবরণ নিচে পূরণ করুন
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Type Toggle using Tabs */}
          <Tabs
            defaultValue={formData.type}
            value={formData.type}
            onValueChange={(val) =>
              setFormData({ ...formData, type: val as "lend" | "borrow" })
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="lend"
                className="data-[state=active]:bg-emerald-600 py-2 data-[state=active]:text-white"
              >
                আমি দিয়েছি (পাওনা)
              </TabsTrigger>
              <TabsTrigger
                value="borrow"
                className="data-[state=active]:bg-red-600 py-2 data-[state=active]:text-white"
              >
                আমি নিয়েছি (দেনা)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                নাম <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="উদাহরণ: রাকিব"
                  className="pl-9"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-right">
                টাকার পরিমাণ <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-9 font-mono"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-right">
              নোট (ঐচ্ছিক)
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="notes"
                placeholder="অতিরিক্ত তথ্য..."
                className="pl-9 min-h-[80px]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              বাতিল
            </Button>
            <Button type="submit" className="w-full sm:w-auto btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              যোগ করুন
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
