import { ImageWithFallback } from "../components/FallBackImage";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";

export function BlogDetail() {
  return (
    <article className="max-w-4xl mx-auto px-6 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          The Future of Work: Embracing Remote Collaboration
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc1Nzc2NDc4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Sheila Harper"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">By Sheila Harper</p>
              <p className="text-sm text-gray-500">
                10 minutes ago • 5 min read
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Heart className="w-4 h-4" />
              <span>156</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Share2 className="w-4 h-4" />
              <span>12</span>
            </div>
            <Button variant="ghost" size="sm">
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="mb-8">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1748346918817-0b1b6b2f9bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW1vdGUlMjB3b3JrJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NTc4NTUyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Remote collaboration workspace"
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          The modern workplace is undergoing a seismic shift, driven by
          technological advancements and evolving employee expectations. Remote
          collaboration, once a niche concept, is rapidly becoming the norm,
          offering numerous benefits for both organizations and employees alike.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          The Rise of Remote Collaboration
        </h2>
        <p className="text-gray-700 mb-4">
          Recent trends have revolutionized the way we approach collaborative
          work environments. Traditional office setups are being replaced by
          flexible workspaces that transcend geographical boundaries, fostering
          innovation and productivity like never before.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Key Technologies Driving Change
        </h3>
        <p className="text-gray-700 mb-4">
          Several cutting-edge technologies are transforming how teams
          collaborate:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          <li className="mb-2">
            Cloud-based collaboration platforms that enable real-time document
            sharing and editing
          </li>
          <li className="mb-2">
            Advanced video conferencing tools with immersive features
          </li>
          <li className="mb-2">
            AI-powered project management systems that optimize workflow
          </li>
          <li className="mb-2">
            Virtual reality spaces for enhanced team meetings
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Global Impact and Statistics
        </h3>
        <p className="text-gray-700 mb-4">
          Research indicates a substantial shift in workplace dynamics.
          Companies implementing remote collaboration strategies report
          increased productivity, improved employee satisfaction, and
          significant cost savings.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Implementation Best Practices
        </h3>
        <p className="text-gray-700 mb-4">
          Successful remote collaboration requires strategic planning and the
          right tools:
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Example: A Guide to Setting Up Remote Teams
          </h4>
          <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
            <code>{`// Setup remote team configuration
const remoteTeam = {
  communication: 'Slack, Microsoft Teams',
  projectManagement: 'Asana, Notion',
  codeCollaboration: 'GitHub, GitLab',
  videoConferencing: 'Zoom, Google Meet'
};

// Best practices checklist
const bestPractices = [
  'Regular check-ins',
  'Clear communication protocols', 
  'Flexible working hours',
  'Goal-oriented approach'
];`}</code>
          </pre>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Addressing Common Challenges
        </h3>
        <p className="text-gray-700 mb-4">
          While remote collaboration offers numerous advantages, it also
          presents unique challenges that organizations must address
          proactively. Communication barriers can be overcome through structured
          protocols, while maintaining team cohesion requires intentional
          relationship-building activities.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Future Outlook
        </h3>
        <p className="text-gray-700 mb-4">
          The future of remote collaboration looks increasingly promising.
          Emerging technologies like augmented reality and advanced AI
          assistants will further enhance our ability to work together
          seamlessly, regardless of physical location.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          Conclusion
        </h3>
        <p className="text-gray-700 mb-6">
          Remote collaboration is understanding the way we work, offering new
          opportunities for innovation, productivity, and work-life balance.
          Organizations that embrace these changes and invest in the right
          technologies and practices will be well-positioned to thrive in the
          evolving workplace landscape.
        </p>
      </div>

      {/* Comments Section */}
      <section className="mt-12 border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Comments</h3>

        {/* Add Comment Form */}
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1Nzg1MTI0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <Textarea
                placeholder="Add your comment..."
                className="min-h-20 mb-3"
              />
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Comment
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1719257751404-1dea075324bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NTc3ODEzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Giles Owen"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">Giles Owen</span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Great article! I've been working remotely for 2 years now and
                it's been a game changer for my productivity and work-life
                balance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc1Nzc2NDc4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Alice Peterson"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  Alice Peterson
                </span>
                <span className="text-sm text-gray-500">4 hours ago</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                The section about implementing new technologies was very
                insightful. I'm planning to propose some of these tools to my
                team.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1Nzg1MTI0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Sam Davis"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">Sam Davis</span>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                This article perfectly captures the current state of remote
                work. The statistics you mentioned are fascinating and confirm
                my own experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
