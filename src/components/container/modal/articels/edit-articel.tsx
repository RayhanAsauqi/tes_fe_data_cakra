import { Dialog, DialogContent } from "@/components/ui/dialog";

type FormState = {
  documentId: string;
  title: string;
};

type EditArticleModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: FormState;
};

export default function EditArticleModal(props: EditArticleModalProps) {
  console.log("EditArticleModal props:", props);
  return (
    <Dialog>
      <DialogContent>
        <h2>Edit Article</h2>
        <form>
          <label>
            Title:
            <input type="text" name="title" />
          </label>
          <label>
            Content:
            <textarea name="content"></textarea>
          </label>
          <button type="submit">Save</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
