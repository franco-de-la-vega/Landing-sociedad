import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Instituto Latinoamericano de Formación Comercial",
  description: "Términos y condiciones del servicio de formación del Instituto Latinoamericano de Formación Comercial (ILFC).",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-[19px] font-bold tracking-tight">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-text-secondary">
        {children}
      </div>
    </section>
  );
}

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-[2.4rem]">
            Términos y Condiciones
          </h1>
          <p className="mt-3 text-[14px] text-text-muted">
            Última actualización: septiembre de 2026.
          </p>

          <Section title="Quiénes somos">
            <p>
              El Instituto Latinoamericano de Formación Comercial (en adelante,
              &quot;ILFC&quot; o &quot;el Instituto&quot;) es un servicio de
              formación práctica orientado a preparar profesionales para
              trabajar como Closers y Setters de ventas remotas B2B en
              mercados internacionales.
            </p>
          </Section>

          <Section title="Cómo se contrata el servicio">
            <p>
              La inscripción se realiza completando la ficha de inscripción
              disponible en{" "}
              <a href="/fichadeinscripcion" className="text-accent hover:underline">
                formlat.com/fichadeinscripcion
              </a>
              , donde la persona interesada selecciona el plan de formación
              que quiere cursar (Comercial Junior, Comercial High Ticket o
              Carrera Completa) y coordina el pago con el equipo comercial de
              ILFC. El acceso a la formación se habilita una vez confirmado
              el pago correspondiente al plan elegido.
            </p>
            <p>
              La formación es 100% online y se desarrolla mediante clases
              prácticas, simulaciones de llamadas de venta y evaluación de
              desempeño, de acuerdo al programa y la duración de cada plan.
            </p>
          </Section>

          <Section title="Cancelaciones y devoluciones">
            <p>
              Una vez confirmada la inscripción y el pago, no se realizan
              devoluciones por arrepentimiento o desistimiento voluntario del
              alumno.
            </p>
            <p>
              Si el Instituto no llega a cumplir con lo comprometido para el
              plan contratado (por ejemplo, falta de acceso al contenido o al
              acompañamiento incluido en el programa), el alumno puede
              solicitar la revisión de su caso escribiendo a{" "}
              <a href="mailto:ilfcformacion@gmail.com" className="text-accent hover:underline">
                ilfcformacion@gmail.com
              </a>{" "}
              o a través del{" "}
              <a href="/contacto" className="text-accent hover:underline">
                formulario de contacto
              </a>
              . Cada caso se evalúa de forma individual junto a la Dirección
              Comercial de ILFC, y de corresponder, se define un reembolso
              total o parcial, o una solución alternativa (por ejemplo, el
              pase a otra cohorte).
            </p>
            <p>
              Si un alumno no puede asistir a la fecha de inicio de su
              cohorte, puede solicitar el cambio a una cohorte posterior
              escribiendo con anticipación por los mismos canales de
              contacto.
            </p>
          </Section>

          <Section title="Contacto">
            <p>
              Ante cualquier consulta sobre estos Términos y Condiciones o
              sobre el servicio contratado, podés escribirnos a{" "}
              <a href="mailto:ilfcformacion@gmail.com" className="text-accent hover:underline">
                ilfcformacion@gmail.com
              </a>{" "}
              o completar el{" "}
              <a href="/contacto" className="text-accent hover:underline">
                formulario de contacto
              </a>
              .
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
