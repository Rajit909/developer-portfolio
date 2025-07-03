import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold">Get in Touch</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Have a question or want to work together? Drop me a line.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
