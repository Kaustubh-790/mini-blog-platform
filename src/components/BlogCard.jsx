import React from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./FallBackImage";

export function ArticleCard({
  id,
  image,
  title,
  description,
  author,
  category,
  tags = [],
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/blog/${id}`);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-video relative">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {category && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-gray-400 text-xs px-2 py-1">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={author.avatar}
            alt={author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{author.name}</p>
            <p className="text-xs text-gray-500">{author.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
