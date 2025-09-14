import React from "react";
import { ImageWithFallback } from "./FallBackImage";

export function ArticleCard({ image, title, description, author }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>

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
