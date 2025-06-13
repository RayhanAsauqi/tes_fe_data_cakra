import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function EditArticleModal() {
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
