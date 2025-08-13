"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryForm } from "./category-form";

export const CreateCategoryButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent title="DialogContent">
        <DialogTitle>Create Category</DialogTitle>
        <div className="py-2">
          <CategoryForm onClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};