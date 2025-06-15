import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useArticleCategoryStore } from "@/lib/store/category-store";
import { formatDate } from "@/utils/format/date";
import { CircleX } from "lucide-react";
import { useEffect } from "react";

type FormState = {
  documentId: string;
};

type DetailModalCategoryProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: FormState;
};

export default function DetailModalCategory(props: DetailModalCategoryProps) {
  const { selectedCategory, fetchDetailCategory } = useArticleCategoryStore();

  useEffect(() => {
    if (props.isOpen && props.data.documentId) {
      fetchDetailCategory(props.data?.documentId);
    }
  }, [props.isOpen, props.data.documentId, fetchDetailCategory]);

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <p className="font-bold">Category Details</p>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3  max-h-96 overflow-y-auto px-2">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" value={selectedCategory?.name || ""} readOnly />

          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            value={selectedCategory?.description || ""}
            readOnly
          />

          <Label htmlFor="createdAt" className="text-right">
            Created At
          </Label>
          <Input
            id="createdAt"
            value={formatDate(selectedCategory?.createdAt)}
            readOnly
          />

          <Label htmlFor="updatedAt" className="text-right">
            Updated At
          </Label>
          <Input
            id="updatedAt"
            value={formatDate(selectedCategory?.updatedAt)}
            readOnly
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <CircleX />
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
