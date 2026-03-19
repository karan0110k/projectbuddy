import { Rocket, Instagram, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer id="footer" className="border-t border-border bg-card">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold gradient-text">ProjectBuddy</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Helping students ace their college tech projects with professional-grade solutions.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-display font-semibold text-foreground">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#services" className="hover:text-foreground">Services</a></li>
            <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
            <li><Link to="/signup" className="hover:text-foreground">Sign Up</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display font-semibold text-foreground">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>AI & Machine Learning</li>
            <li>MERN Stack</li>
            <li>Python & Java</li>
            <li>Web Development</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display font-semibold text-foreground">Contact Us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-primary" />
              <a href="https://www.instagram.com/projecttbuddy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">@projectbuddy</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>karankalra428@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>+91 83071303**</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ProjectBuddy. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
