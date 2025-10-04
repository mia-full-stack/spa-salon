import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthForm } from "@/components/auth-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AuthForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
