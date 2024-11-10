import { useState } from 'react'
import { Mail, GitHub, Linkedin } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function PersonalWebsite() {
  const [activeSection, setActiveSection] = useState('home')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Name</h1>
          <ul className="flex space-x-4">
            {['Home', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Button
                  variant={activeSection === item.toLowerCase() ? "default" : "ghost"}
                  onClick={() => setActiveSection(item.toLowerCase())}
                >
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section id="home" className={`py-20 ${activeSection !== 'home' && 'hidden'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to My Personal Website</h2>
            <p className="text-xl mb-8">I'm a [Your Profession] passionate about [Your Interests]</p>
            <Button onClick={() => setActiveSection('about')}>Learn More About Me</Button>
          </div>
        </section>

        <section id="about" className={`py-20 bg-muted ${activeSection !== 'about' && 'hidden'}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Your Name"
                  className="rounded-full w-64 h-64 object-cover mx-auto"
                />
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-lg mb-4">
                  Hello! I'm [Your Name], a [Your Profession] based in [Your Location]. I have a passion for [Your
                  Interests] and I'm always eager to learn and grow in my field.
                </p>
                <p className="text-lg mb-4">
                  With [X] years of experience in [Your Industry], I've had the opportunity to work on a variety of
                  exciting projects and collaborate with talented professionals from all over the world.
                </p>
                <p className="text-lg">
                  When I'm not [Working/Coding/Designing], you can find me [Your Hobbies or Interests outside of work].
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className={`py-20 ${activeSection !== 'contact' && 'hidden'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <p className="text-xl mb-8">I'm always open to new opportunities and collaborations.</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" /> Email Me
              </Button>
              <Button variant="outline">
                <GitHub className="mr-2 h-4 w-4" /> GitHub
              </Button>
              <Button variant="outline">
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-4 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
