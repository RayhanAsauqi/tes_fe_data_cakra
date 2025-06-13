import { useParams } from "react-router-dom";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Article Detail</h1>
      <p>This is the article detail page {id}</p>
      {/* Add your article detail content here */}
    </div>
  );
}
