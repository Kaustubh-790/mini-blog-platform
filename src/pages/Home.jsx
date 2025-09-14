import { ArticleCard } from "../components/BlogCard";

const articles = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1612969306393-ba0aaef5ed90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHJlYWRpbmclMjBib29rJTIwc3Rvcnl0ZWxsaW5nfGVufDF8fHx8MTc1Nzg1MTIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "The Art of Storytelling",
    description:
      "Explore the power of narratives and how to craft compelling stories that captivate and inspire.",
    author: {
      name: "Jane Doe",
      avatar:
        "https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc1Nzc2NDc4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      date: "Oct 28, 2023",
    },
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1515018993613-681b765562d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neSUyMGJsdWV8ZW58MXx8fHwxNzU3ODUxMjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Tech Trends in 2024",
    description:
      "Stay updated with the latest technological advancements shaping our future, from AI to quantum computing.",
    author: {
      name: "John Smith",
      avatar:
        "https://images.unsplash.com/photo-1719257751404-1dea075324bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NTc3ODEzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      date: "Oct 29, 2023",
    },
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1668962225017-12ef9d7981c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGxpdmluZyUyMHBsYW50JTIwZW52aXJvbm1lbnR8ZW58MXx8fHwxNzU3ODUxMjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Sustainable Living Tips",
    description:
      "Discover practical ways to live a more eco-friendly and sustainable lifestyle every day.",
    author: {
      name: "Emily Green",
      avatar:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1Nzg1MTI0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      date: "Oct 24, 2023",
    },
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1599372176713-97bc5c2bd4a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGUlMjB0cmF2ZWwlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU3ODUxMjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Travel Adventures in Europe",
    description:
      "Embark on virtual journeys through Europe's most captivating destinations and hidden gems.",
    author: {
      name: "Alex Rover",
      avatar:
        "https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc1Nzc2NDc4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      date: "Oct 23, 2023",
    },
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1573285702030-f7952e595655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwbWluZGZ1bG5lc3MlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NTc3OTE3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Mindfulness and Meditation",
    description:
      "Find inner peace and reduce stress with guided mindfulness and meditation practices for beginners.",
    author: {
      name: "Clara Mind",
      avatar:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1Nzg1MTI0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      date: "Oct 22, 2023",
    },
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1689023540541-59aa2513b750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdyaXRpbmclMjBub3RlYm9va3xlbnwxfHx8fDE3NTc4MzI4MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Creative Writing Prompts",
    description:
      "Unleash your creativity with inspiring writing prompts and exercises to get your stories flowing.",
    author: {
      name: "Leo Writer",
      avatar:
        "https://images.unsplash.com/photo-1719257751404-1dea075324bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NTc3ODEzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      date: "Oct 21, 2023",
    },
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Stories
        </h1>
        <p className="text-gray-600">
          Explore compelling articles from our community of writers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
}
