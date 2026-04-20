"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Contact Us" subtitle="Get In Touch" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-heading text-2xl text-primary mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 p-8 text-center">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <p className="font-body text-green-700">Thank you! We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none resize-none" />
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-body">{error}</p>
                )}

                <button type="submit" disabled={loading} className="bg-accent text-white px-8 py-3 font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors disabled:opacity-50">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="font-heading text-2xl text-primary mb-6">Contact Information</h2>
            {[
              { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", icon2: "M15 11a3 3 0 11-6 0 3 3 0 016 0z", title: "Address", text: "Main Market, Lahore, Pakistan" },
              { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "Phone", text: "+92 300 1234567" },
              { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Email", text: "info@aamirfabrics.com" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Hours", text: "Mon - Sat: 10:00 AM - 9:00 PM" },
            ].map((item) => (
              <div key={item.title} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />{item.icon2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon2} />}</svg>
                </div>
                <div>
                  <h3 className="font-body text-sm font-medium text-primary">{item.title}</h3>
                  <p className="font-body text-sm text-gray-500 mt-1">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
