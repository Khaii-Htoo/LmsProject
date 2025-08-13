import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { getCategories } from "@/app/data/admin/admin-get-categories";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";
import { CreateCategoryButton } from "./_components/create-category-button";

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <CreateCategoryButton />
      </div>

      <DataTable columns={columns} data={categories} />
    </div>
  );
};

export default CategoriesPage;
