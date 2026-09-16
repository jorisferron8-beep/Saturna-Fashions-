import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Shield, Cookie, FileText } from 'lucide-react';

/* ------------------------------- legal texts ------------------------------- */

const POLICIES = [
    {
        id: 'privacidad',
        icon: Shield,
        title: 'Política de Privacidad',
        subtitle: 'Colombia · Ley 1581 · EE. UU. · CCPA · Hong Kong · PDPO · China · PIPL',
        intro:
            'La presente Política de Privacidad describe cómo SATURNA™ recopila, trata, almacena y comparte los datos personales de sus clientas y visitantes, en cumplimiento de la legislación aplicable en cada jurisdicción.',
        sections: [
            {
                h: '1. Responsable del Tratamiento',
                p: 'SATURNA™ — Dark Fashion, operada por SWU-VISION GROUP LIMITED (Hong Kong S.A.R.) bajo licencia de SWU-VISION CORPORATION (EE. UU.). Para consultas: customerservice@saturna-fashions.com · servicelegals@saturna-fashions.com.',
            },
            {
                h: '2. Datos Recopilados',
                p: 'Recopilamos: datos de identificación (nombre, nacionalidad); datos de contacto (correo, teléfono, dirección); datos de medida y preferencia; datos de navegación (IP, navegador, páginas visitadas) mediante cookies; y datos de pago tratados por proveedores certificados (PCI-DSS).',
            },
            {
                h: '3. Finalidad del Tratamiento',
                p: 'Los datos se utilizan para: gestionar pedidos y envíos; atender solicitudes y reclamaciones; enviar comunicaciones comerciales (previo consentimiento); cumplir obligaciones legales, fiscales y aduaneras; y salvaguardar los intereses del responsable.',
            },
            {
                h: '4. Base Legal — Colombia (Ley 1581 / Decreto 1377 de 2013)',
                p: 'El tratamiento se realiza con base en la autorización previa, expresa e informada de la titular. Para datos sensibles se exige autorización reforzada. Se garantiza la confidencialidad, seguridad y finalidad legítima del tratamiento.',
            },
            {
                h: '5. Base Legal — Estados Unidos (CCPA)',
                p: 'Para residentes de California, el consumidor dispone de los derechos de acceso, eliminación, rectificación y exclusión de la venta de datos. SATURNA™ no vende datos personales a terceros.',
            },
            {
                h: '6. Base Legal — Hong Kong (PDPO)',
                p: 'El tratamiento de datos de residentes de Hong Kong se rige por la Ordenanza de Protección de Datos Personales (Cap. 486). Los datos se recopilan con finalidades determinadas y se protegen contra el acceso, tratamiento, borrado, pérdida o uso no autorizado o accidental, conforme a los Principios de Protección de Datos del PDPO (pcpd.org.hk).',
            },
            {
                h: '7. Base Legal — China continental (PIPL)',
                p: 'Para residentes de China continental, el tratamiento se rige por la Ley de Protección de Información Personal (PIPL). La transferencia transfronteriza de datos personales a Hong Kong u otras jurisdicciones se realiza conforme a la sección de Transferencia de Datos. Se obtiene el consentimiento por separado cuando la ley lo exige.',
            },
            {
                h: '8. Derechos de la Titular',
                p: 'Conforme a la legislación aplicable, la titular puede ejercer los derechos de: acceso, rectificación, supresión, oposición, portabilidad y revocación del consentimiento. Las solicitudes se tramitan en los plazos legalmente establecidos en cada jurisdicción.',
            },
            {
                h: '9. Transferencia y Transmisión',
                p: 'Los datos pueden transferirse a proveedores de servicios (logística, pago, mensajería) bajo contratos de encargado de tratamiento. Las transferencias internacionales se realizan con garantías adecuadas conforme a la legislación de cada jurisdicción.',
            },
            {
                h: '10. Conservación y Seguridad',
                p: 'Los datos se conservan durante el tiempo necesario para cumplir la finalidad y los plazos legales. Implementamos cifrado en tránsito (TLS), control de accesos por roles, registros de auditoría y revisiones periódicas. Las vulneraciones se notifican conforme a la ley.',
            },
            {
                h: '11. Modificaciones',
                p: 'La presente política puede actualizarse. La fecha de última revisión figura al pie del documento. El uso continuado del sitio tras las modificaciones implica la aceptación de la política actualizada.',
            },
        ],
    },
    {
        id: 'terminos',
        icon: Scale,
        title: 'Términos y Condiciones',
        subtitle: 'Colombia · Ley 1480 de 2011 · EE. UU. · UCC · Hong Kong · Cap. 623',
        intro:
            'Los presentes Términos y Condiciones regulan el acceso, uso y compra de productos en el sitio de SATURNA™ — Dark Fashion, en cumplimiento de la legislación aplicable en cada jurisdicción.',
        sections: [
            {
                h: '1. Aceptación',
                p: 'El acceso al sitio y la solicitud de cualquier producto implica la aceptación plena de los presentes términos. Si no está de acuerdo, le rogamos no utilizar el sitio ni nuestros servicios.',
            },
            {
                h: '2. Objeto',
                p: 'SATURNA™ ofrece moda femenina de lujo: prendas de confección, colecciones de edición limitada y piezas a medida. La disponibilidad de cada producto se indica en su ficha.',
            },
            {
                h: '3. Pedidos',
                p: 'Cada pedido se formaliza a través del carrito y el proceso de pago. La confirmación del pedido no garantiza disponibilidad; en caso de agotamiento, SATURNA™ comunicará la situación y reembolsará el importe abonado.',
            },
            {
                h: '4. Precios y Pagos',
                p: 'Los precios se expresan en la moneda del mercado activo (USD, COP, HKD, CNY) y pueden variar según la región. El pago se realiza a través de pasarelas certificadas (PCI-DSS). Los precios pueden modificarse sin previo aviso, salvo para pedidos ya confirmados.',
            },
            {
                h: '5. Garantía — Colombia (Ley 1480 de 2011)',
                p: 'Las prendas cuentan con garantía legal de calidad frente a defectos de fabricación. La garantía no cubre desgaste por uso, alteraciones no autorizadas o negligencia. El consumidor dispone de las acciones de reparación, reposición y devolución conforme al Estatuto del Consumidor.',
            },
            {
                h: '6. Garantía — Estados Unidos (UCC)',
                p: 'Las prendas se ajustan a las garantías implícitas de comerciabilidad y adecuación al uso particular conforme al Uniform Commercial Code. Cualquier reclamación se tramitará conforme a la legislación del estado de entrega.',
            },
            {
                h: '7. Garantía — Hong Kong (Cap. 623 — TCO)',
                p: 'Para entregas en Hong Kong, se aplica la Ordenanza sobre Bienes de Consumo y Servicios (Trade Descriptions Ordinance, Cap. 623), que prohíbe las indicaciones comerciales falsas y exige conformidad del producto con la descripción.',
            },
            {
                h: '8. Propiedad Intelectual',
                p: 'Todos los diseños, patrones, imágenes y textos del sitio son propiedad exclusiva de SATURNA™. Queda prohibida su reproducción, distribución o uso comercial sin autorización escrita.',
            },
            {
                h: '9. Ley Aplicable y Jurisdicción',
                p: 'Los presentes términos se rigen por la legislación de la jurisdicción de entrega del producto. Las controversias se someterán a los tribunales competentes, sin perjuicio de los mecanismos de mediación obligatoria que la ley disponga.',
            },
        ],
    },
    {
        id: 'cookies',
        icon: Cookie,
        title: 'Política de Cookies',
        subtitle: 'Colombia · Decreto 1377 · EE. UU. · CCPA · Hong Kong · PDPO',
        intro:
            'La presente Política de Cookies informa sobre el uso de cookies y tecnologías similares en el sitio de SATURNA™ — Dark Fashion, conforme a la legislación aplicable.',
        sections: [
            {
                h: '1. Qué son las Cookies',
                p: 'Las cookies son pequeños archivos de texto que el sitio web almacena en el dispositivo del usuario para recordar preferencias, analizar el uso y mejorar la experiencia de navegación.',
            },
            {
                h: '2. Tipos de Cookies Utilizadas',
                p: 'Cookies técnicas: indispensables para el funcionamiento del sitio. Cookies de preferencia: recuerdan idioma y mercado. Cookies analíticas: miden el uso del sitio de forma anónima. No utilizamos cookies publicitarias de terceros.',
            },
            {
                h: '3. Consentimiento',
                p: 'Al continuar navegando tras el banner inicial, el usuario presta su consentimiento informado para el uso de cookies no esenciales. El consentimiento puede retirarse en cualquier momento borrando las cookies del navegador.',
            },
            {
                h: '4. Gestión y Desactivación',
                p: 'El usuario puede gestionar, aceptar o rechazar las cookies desde la configuración de su navegador. La desactivación de cookies técnicas puede afectar al funcionamiento del sitio.',
            },
            {
                h: '5. Conservación',
                p: 'Las cookies técnicas persisten durante la sesión. Las cookies analíticas se conservan un máximo de trece (13) meses, tras lo cual se eliminan automáticamente.',
            },
            {
                h: '6. Actualizaciones',
                p: 'Esta política puede actualizarse para reflejar cambios en el uso de cookies. La fecha de última revisión figura al pie del documento.',
            },
        ],
    },
    {
        id: 'aviso',
        icon: FileText,
        title: 'Aviso Legal',
        subtitle: 'Información general · Condiciones de uso',
        intro:
            'El presente Aviso Legal regula el acceso y uso del sitio web de SATURNA™ — Dark Fashion, en cumplimiento de la legislación aplicable en cada jurisdicción de operación.',
        sections: [
            {
                h: '1. Titular del Sitio',
                p: 'SATURNA™ — Dark Fashion, marca comercial propiedad de SWU-VISION CORPORATION (N.º de registro 32-0853153, Miami, Florida, EE. UU.), operada comercialmente por SWU-VISION GROUP LIMITED (N.º de registro 80605496, Hong Kong S.A.R.). Correo: customerservice@saturna-fashions.com.',
            },
            {
                h: '2. Condiciones de Uso',
                p: 'El usuario se compromete a utilizar el sitio de forma lícita, respetando los derechos de propiedad intelectual, la intimidad y la legislación vigente. Queda prohibido cualquier uso que pueda dañar, sobrecargar o impedir el normal funcionamiento del sitio.',
            },
            {
                h: '3. Propiedad Intelectual',
                p: 'Los contenidos del sitio —textos, imágenes, diseños, logotipos y código— son titularidad de SATURNA™ o de terceros que han autorizado su uso. Su reproducción total o parcial requiere autorización escrita.',
            },
            {
                h: '4. Exención de Responsabilidad',
                p: 'SATURNA™ no se responsabiliza de los posibles errores de contenido, indisponibilidad temporal del sitio ni de los contenidos de sitios de terceros enlazados. Las imágenes de las prendas son orientativas; el producto final puede variar.',
            },
            {
                h: '5. Protección de Datos',
                p: 'El tratamiento de datos personales se rige por la Política de Privacidad, en cumplimiento de la Ley 1581 de 2012 (Colombia), la CCPA (Estados Unidos), el PDPO (Hong Kong) y la PIPL (China continental).',
            },
            {
                h: '6. Legislación Aplicable',
                p: 'El presente aviso se rige por la legislación aplicable en cada jurisdicción: Colombia (Ley 1480 de 2011), Estados Unidos (UCC), Hong Kong (Cap. 623 — TCO) y China continental (Ley de Protección de Derechos del Consumidor). Cualquier controversia se someterá a los tribunales competentes.',
            },
        ],
    },
];

/* -------------------------------- component -------------------------------- */

export default function LegalPolicies() {
    const [active, setActive] = useState(null);

    useEffect(() => {
        document.body.style.overflow = active ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [active]);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setActive(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const policy = POLICIES.find((p) => p.id === active);

    return (
        <section id="legal" className="border-t border-black/10 bg-[#F7F5F0]">
            <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-7">
                <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
                    <p className="shrink-0 text-[10px] font-medium uppercase tracking-[0.3em] text-[#5A1825]">
                        Información Legal
                    </p>

                    <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        {POLICIES.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setActive(p.id)}
                                className="group inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:text-[#5A1825]"
                            >
                                <p.icon className="h-3 w-3 text-[#5A1825] opacity-60 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
                                {p.title}
                            </button>
                        ))}
                        <Link
                            to="/legal"
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-black underline-offset-4 transition-colors hover:text-[#5A1825] hover:underline"
                        >
                            <Scale className="h-3 w-3" strokeWidth={1.5} />
                            Centro Legal
                        </Link>
                    </nav>
                </div>
            </div>

            <AnimatePresence>
                {policy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm"
                        onClick={() => setActive(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative my-8 w-full max-w-3xl border border-black/10 bg-white"
                        >
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white/95 px-6 py-4 backdrop-blur md:px-8">
                                <div className="flex items-center gap-4">
                                    <span className="flex h-9 w-9 items-center justify-center border border-black/15 bg-[#F7F5F0]">
                                        <policy.icon className="h-4 w-4 text-[#5A1825]" strokeWidth={1.5} />
                                    </span>
                                    <div>
                                        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-black md:text-2xl">
                                            {policy.title}
                                        </h3>
                                        <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-neutral-400">
                                            {policy.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActive(null)}
                                    aria-label="Cerrar"
                                    className="flex h-9 w-9 items-center justify-center border border-black/15 text-neutral-600 transition-colors hover:border-black hover:text-black"
                                >
                                    <X className="h-4 w-4" strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="max-h-[75vh] overflow-y-auto px-6 py-7 md:px-10 md:py-9">
                                <p className="mb-7 border-l-2 border-[#5A1825] pl-4 text-sm font-light italic leading-relaxed text-neutral-600">
                                    {policy.intro}
                                </p>
                                <div className="space-y-6">
                                    {policy.sections.map((s) => (
                                        <div key={s.h}>
                                            <h4 className="mb-2 font-display text-base font-semibold uppercase tracking-wide text-black">
                                                {s.h}
                                            </h4>
                                            <p className="text-sm font-light leading-relaxed text-neutral-600">
                                                {s.p}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-9 border-t border-black/10 pt-5 text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                                    Última revisión: {new Date().getFullYear()} · SATURNA — Dark Fashion
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
