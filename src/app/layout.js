import React from "react";
import Header from "../components/header"; // Ensure the path is correct
import "./globals.css"; // Ensure styles are correctly applied
import { AppSidebar } from "../components/sidebar/appsidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Mail, Phone } from "lucide-react";

export const metadata = {
  title: "My Application",
  description: "A Next.js App with Header and Footer",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-grow">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
        <footer className="mt-auto bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 flex justify-end items-center space-x-8">
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubLogoIcon className="w-6 h-6 text-white hover:text-gray-400" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterLogoIcon className="w-6 h-6 text-white hover:text-gray-400" />
              </a>
            </div>
            <div className="text-sm">
              <p>
                &copy; {new Date().getFullYear()} nextBlog. All rights reserved.
                A project by Sachetan, Vedant, Ayush and Aman!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="mailto:amanx.432.kp@gmail.com"
                className="flex items-center space-x-1"
              >
                <Mail className="w-5 h-5 text-white" />
                <span>amanx.432.kp@gmail.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center space-x-1">
                <Phone className="w-5 h-5 text-white" />
                <span>+1 234 567 890</span>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
