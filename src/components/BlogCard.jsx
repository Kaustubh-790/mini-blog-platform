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
      className="group bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 overflow-hidden hover:shadow-2xl hover:shadow-river-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
      onClick={handleClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {category && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200 text-lg leading-tight">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-river-50 text-river-700 text-xs px-2.5 py-1 rounded-full font-medium border border-river-200/50"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-muted-foreground text-xs px-2.5 py-1 bg-muted rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-border/30">
          <ImageWithFallback
            src={author.avatar}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-border/50 group-hover:border-primary/50 transition-colors duration-200"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {author.name}
            </p>
            <p className="text-xs text-muted-foreground">{author.date}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-river-50 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-river-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
