import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Scale,
    Shield,
    Cookie,
    FileText,
    BadgeCheck,
    Copyright,
    MessageSquareWarning,
    Lock,
    Truck,
    RotateCcw,
    CreditCard,
    Ruler,
    Globe2,
    Plane,
    Database,
    Building2,
    ArrowRight,
    ChevronRight,
} from 'lucide-react';
import LaceDivider from '@/components/LaceDivider';

/* ------------------------------------------------------------------ */
/*  Legal documents — organised by the SATURNA™ legal architecture     */
/*  LEGAL · SHOPPING · CHINA / HONG KONG · CORPORATE                   */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
    {
        id: 'legal',
        label: 'Legal',
        zh: '法律',
        blurb:
            'Avisos, condiciones, privacidad, propiedad intelectual, reclamaciones y seguridad del sitio.',
    },
    {
        id: 'shopping',
        label: 'Shopping',
        zh: '购物',
        blurb:
            'Políticas operativas de la boutique: envíos, devoluciones, pagos y guía de tallas.',
    },
    {
        id: 'china',
        label: 'China / Hong Kong',
        zh: '中国 / 香港',
        blurb:
            'Cumplimiento específico para clientas de China continental y Hong Kong (PIPL,跨境电子商务).',
    },
    {
        id: 'corporate',
        label: 'Corporate',
        zh: '企业',
        blurb:
            'Información corporativa de SATURNA™ y del operador comercial SWU-VISION GROUP LIMITED.',
    },
];

const DOCS = {
    /* ----------------------------- LEGAL ----------------------------- */
    'aviso-legal': {
        cat: 'legal',
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
    terminos: {
        cat: 'legal',
        icon: Scale,
        title: 'Términos y Condiciones',
        subtitle: 'Colombia · Ley 1480 de 2011 · Estados Unidos · UCC · Hong Kong · Cap. 623',
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
    privacidad: {
        cat: 'legal',
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
    cookies: {
        cat: 'legal',
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
    consumidor: {
        cat: 'legal',
        icon: BadgeCheck,
        title: 'Protección al Consumidor',
        subtitle: 'Publicidad veraz · Sin afirmaciones comerciales falsas',
        intro:
            'SATURNA™ se compromete a una publicidad veraz y transparente. Toda afirmación comercial publicada en este sitio —reducciones, número de ventas, valoraciones— debe poder justificarse y corresponderse con la realidad.',
        sections: [
            {
                h: '1. Principio de Veracidad Comercial',
                p: 'Conforme a la legislación de protección al consumidor aplicable en cada jurisdicción (Colombia — Ley 1480 de 2011; EE. UU. — FTC Act; Hong Kong — Cap. 623 TCO; China — Ley de Protección de Derechos del Consumidor), SATURNA™ prohíbe toda indicación comercial falsa, engañosa o susceptible de inducir a error.',
            },
            {
                h: '2. Reducciones y Descuentos',
                p: 'Las reducciones de precio anunciadas se basan en un precio de referencia real y verificable, previamente mantenido durante un período razonable. No se publican descuentos ficticios ni rebajas sobre precios inflados artificialmente. El precio anterior y el precio rebajado se muestran de forma clara cuando aplica.',
            },
            {
                h: '3. Número de Ventas',
                p: 'Cualquier indicación sobre el número de unidades vendidas, existencias limitadas o demanda de un producto refleja datos reales del sistema de pedidos de SATURNA™. No se inflan artificialmente las cifras de ventas para crear una sensación de escasez o popularidad.',
            },
            {
                h: '4. Valoraciones y Reseñas',
                p: 'Las valoraciones y reseñas publicadas provienen de clientas reales que han adquirido el producto. SATURNA™ no fabrica reseñas falsas, no compra valoraciones y no elimina reseñas negativas legítimas. Las reseñas verificadas se identifican como tales.',
            },
            {
                h: '5. Justificación de Afirmaciones',
                p: 'Toda afirmación comercial —sobre materiales, origen, propiedades de las prendas, plazos de entrega o garantías— debe poder justificarse documentalmente. SATURNA™ conserva los soportes que respaldan cada afirmación publicada.',
            },
            {
                h: '6. Derechos del Consumidor',
                p: 'Los derechos del consumidor reconocidos por la legislación aplicable no pueden ser excluidos ni limitados por la presente política. En caso de discrepancia entre esta política y la ley, prevalece la ley.',
            },
        ],
    },
    'propiedad-intelectual': {
        cat: 'legal',
        icon: Copyright,
        title: 'Propiedad Intelectual',
        subtitle: 'SATURNA™ · Marca · Logo · Diseños · Contenidos',
        intro:
            'SATURNA™ protege su propiedad intelectual en todas las jurisdicciones de operación. El presente documento describe los elementos protegidos y las recomendaciones de depósito de marca.',
        sections: [
            {
                h: '1. Elementos Protegidos',
                p: 'SATURNA™ protege: la marca SATURNA™; el logotipo y la identidad visual de marca; la fotografía editorial y de producto; los diseños de producto y patrones; el contenido del sitio web (textos, maquetación, código); los materiales de marketing; el embalaje; y los recursos de redes sociales.',
            },
            {
                h: '2. Titularidad',
                p: 'La marca SATURNA™ es titularidad de SWU-VISION CORPORATION, que la licencia a SWU-VISION GROUP LIMITED para su explotación comercial. SATURNA™ no es una entidad jurídica independiente registrada, salvo indicación en contrario.',
            },
            {
                h: '3. Depósito de Marca — Recomendaciones',
                p: 'Se recomienda verificar y formalizar el depósito de marca en cada jurisdicción de operación: Hong Kong — SATURNA (denominativa); China continental — SATURNA + logotipo (mixta); Estados Unidos — SATURNA + logotipo (mixta). Esta verificación es especialmente importante antes de desarrollar la red de distribuidores chinos.',
            },
            {
                h: '4. Prohibiciones',
                p: 'Queda prohibida la reproducción, imitación, distribución o uso comercial de la marca, el logotipo, los diseños o cualquier elemento protegido sin autorización escrita de SATURNA™. Las infracciones serán perseguidas conforme a la legislación aplicable.',
            },
            {
                h: '5. Diseños de Producto',
                p: 'Los diseños de las prendas, patrones de confección y elementos ornamentales originales están protegidos como diseños industriales o como obras de propiedad intelectual, según la jurisdicción. La copia o falsificación de productos SATURNA™ constituye una infracción.',
            },
            {
                h: '6. Contenido del Sitio',
                p: 'El contenido de este sitio —textos, imágenes, código, maquetación— está protegido por derechos de autor. Queda prohibida la extracción, reutilización o republicación total o parcial sin autorización.',
            },
            {
                h: '7. Reclamaciones por Infracción',
                p: 'Si considera que un tercero infringe los derechos de propiedad intelectual de SATURNA™, o si SATURNA™ le reclama una infracción, la comunicación se dirige a servicelegals@saturna-fashions.com.',
            },
        ],
    },
    reclamaciones: {
        cat: 'legal',
        icon: MessageSquareWarning,
        title: 'Reclamaciones y Disputas',
        subtitle: 'SATURNA™ · Customer Complaints & Dispute Resolution Policy',
        intro:
            'SATURNA™ se compromete a tratar las reclamaciones de las clientas de forma justa, transparente y en un plazo razonable.',
        sections: [
            {
                h: '1. Presentación de la Reclamación',
                p: 'La clienta debe contactar primero con el servicio de atención al cliente de SATURNA™ facilitando: número de pedido; nombre de la clienta; descripción del problema; y fotografías o pruebas pertinentes cuando proceda.',
            },
            {
                h: '2. Revisión y Respuesta',
                p: 'SATURNA™ revisará la reclamación y determinará la respuesta adecuada según la transacción, la legislación aplicable y las normas de la plataforma correspondiente. La respuesta se comunica en un plazo razonable.',
            },
            {
                h: '3. Derechos del Consumidor',
                p: 'Cuando apliquen derechos del consumidor de carácter obligatorio, dichos derechos no quedan excluidos por la presente política. Nada en esta política impide a un consumidor ejercer los derechos reconocidos por la ley imperativa.',
            },
            {
                h: '4. Escalado y Mediación',
                p: 'Cuando una disputa no pueda resolverse directamente, la clienta podrá utilizar cualquier mecanismo legal de reclamación, mediación, administrativo o judicial disponible conforme a la legislación aplicable.',
            },
            {
                h: '5. Contacto',
                p: 'Las reclamaciones se dirigen a customerservice@saturna-fashions.com. Para asuntos legales: servicelegals@saturna-fashions.com.',
            },
        ],
    },
    seguridad: {
        cat: 'legal',
        icon: Lock,
        title: 'Accesibilidad y Ciberseguridad',
        subtitle: 'SSL/TLS · 2FA · Seguridad del sitio · Violación de datos',
        intro:
            'SATURNA™ implementa medidas técnicas y organizativas para proteger el sitio web, los datos de las clientas y la continuidad del servicio, conforme al PDPO de Hong Kong y a las mejores prácticas de ciberseguridad.',
        sections: [
            {
                h: '1. Cifrado SSL/TLS',
                p: 'Todo el tráfico del sitio se transmite cifrado mediante certificados SSL/TLS. Los datos de pago no se almacenan en los servidores de SATURNA™; se tratan exclusivamente a través de pasarelas certificadas (PCI-DSS).',
            },
            {
                h: '2. Plataforma Segura',
                p: 'La plataforma de comercio electrónico se mantiene actualizada, con control de plugins, parches de seguridad y revisiones periódicas de vulnerabilidades.',
            },
            {
                h: '3. Autenticación de Administradores (2FA)',
                p: 'El acceso al panel de administración requiere autenticación de dos factores (2FA). Las credenciales de administrador se rotan periódicamente y se restringen al personal autorizado.',
            },
            {
                h: '4. Copias de Seguridad',
                p: 'Se realizan copias de seguridad periódicas y cifradas de los datos y del sitio. Las copias se almacenan de forma redundante para garantizar la recuperación ante incidentes.',
            },
            {
                h: '5. Control de Accesos y Registro',
                p: 'El acceso a los sistemas se controla por roles y privilegios mínimos. Se mantiene un registro de auditoría de las acciones administrativas y de acceso a datos personales.',
            },
            {
                h: '6. Anti-Malware y Limitación de Intentos',
                p: 'Se despliegan medidas anti-malware, escaneos periódicos y limitación de intentos de conexión para prevenir accesos no autorizados y ataques de fuerza bruta.',
            },
            {
                h: '7. Procedimiento de Violación de Datos',
                p: 'En caso de violación de datos personales, SATURNA™ notificará a la autoridad competente y a las personas afectadas en los plazos legalmente establecidos, conforme al PDPO de Hong Kong y a la legislación aplicable de cada jurisdicción. El PDPO exige que los datos estén protegidos contra el acceso, tratamiento, borrado, pérdida o uso no autorizado o accidental (pcpd.org.hk).',
            },
            {
                h: '8. Accesibilidad',
                p: 'SATURNA™ procura que el sitio sea accesible, con contraste adecuado, navegación por teclado y textos alternativos en las imágenes. Se realizan mejoras continuas conforme a las pautas de accesibilidad reconocidas.',
            },
        ],
    },

    /* ---------------------------- SHOPPING --------------------------- */
    envios: {
        cat: 'shopping',
        icon: Truck,
        title: 'Política de Envíos',
        subtitle: 'Cobertura global · Plazos · Seguimiento',
        intro:
            'SATURNA™ realiza envíos a nivel global desde Hong Kong. Los plazos, costes y condiciones varían según el mercado de destino.',
        sections: [
            {
                h: '1. Cobertura',
                p: 'Realizamos envíos a Estados Unidos, Colombia, Hong Kong, China continental y otros destinos internacionales. La disponibilidad y los costes se calculan en el checkout según la dirección de entrega.',
            },
            {
                h: '2. Plazos de Entrega',
                p: 'Los plazos estimados son: Hong Kong 2–4 días laborables; China continental 5–10 días laborables (envío transfronterizo); Estados Unidos 5–10 días laborables; Colombia 7–14 días laborables. Los plazos son orientativos y pueden variar por trámites aduaneros.',
            },
            {
                h: '3. Costes y Umbral de Envío Gratuito',
                p: 'El coste de envío se calcula en el checkout. SATURNA™ ofrece envío gratuito a partir del umbral configurado por mercado, mostrado en la barra superior de cada boutique regional.',
            },
            {
                h: '4. Seguimiento',
                p: 'Una vez despachado el pedido, la clienta recibe un número de seguimiento por correo electrónico para consultar el estado del envío en tiempo real.',
            },
            {
                h: '5. Aduanas y Aranceles',
                p: 'Para envíos transfronterizos, los posibles aranceles, impuestos de importación y tasas aduaneras corren por cuenta de la destinataria, salvo que la ley disponga lo contrario. SATURNA™ declara el valor real del envío.',
            },
            {
                h: '6. Entregas no Completadas',
                p: 'Si un envío no puede entregarse, se intentará una segunda entrega o se devolverá al origen. SATURNA™ coordinará con la clienta el reenvío o el reembolso según corresponda.',
            },
        ],
    },
    devoluciones: {
        cat: 'shopping',
        icon: RotateCcw,
        title: 'Devoluciones y Reembolsos',
        subtitle: 'Condiciones · Plazos · Reembolso',
        intro:
            'SATURNA™ acepta devoluciones de prendas en su estado original dentro del plazo legal aplicable. Las piezas a medida o de edición limitada pueden tener condiciones específicas.',
        sections: [
            {
                h: '1. Plazo de Devolución',
                p: 'La clienta dispone de catorce (14) días naturales desde la recepción para solicitar la devolución, conforme a la legislación aplicable. Las piezas confeccionadas a medida se excluyen del derecho de desistimiento salvo defecto de fabricación.',
            },
            {
                h: '2. Condiciones del Producto',
                p: 'La prenda debe devolverse sin usar, con todas las etiquetas y embalaje original. SATURNA™ se reserva el derecho de rechazar devoluciones de productos dañados por uso indebido.',
            },
            {
                h: '3. Procedimiento',
                p: 'La clienta debe contactar con customerservice@saturna-fashions.com indicando el número de pedido y el motivo. SATURNA™ facilita las instrucciones y, cuando procede, la etiqueta de devolución.',
            },
            {
                h: '4. Reembolso',
                p: 'El reembolso se efectúa en el mismo medio de pago utilizado en la compra, en un plazo máximo de catorce (14) días desde la recepción de la prenda devuelta. Los gastos de envío de devolución pueden correr por cuenta de la clienta salvo defecto o error de SATURNA™.',
            },
            {
                h: '5. Defectos de Fabricación',
                p: 'Los productos con defecto de fabricación se reponen, reparan o reembolsan íntegramente, con gastos de envío a cargo de SATURNA™, conforme a la garantía legal aplicable.',
            },
        ],
    },
    pago: {
        cat: 'shopping',
        icon: CreditCard,
        title: 'Política de Pago y Antifraude',
        subtitle: 'Pagos seguros · Prevención de fraude · AML',
        intro:
            'SATURNA™ procesa los pagos a través de pasarelas certificadas y aplica medidas de prevención de fraude proporcionadas a una boutique de moda, sin sobrecargar el sitio con políticas bancarias de tipo institución financiera.',
        sections: [
            {
                h: '1. Métodos de Pago',
                p: 'Los métodos de pago disponibles varían según el mercado: tarjetas (Visa, Mastercard, American Express); PayPal; Apple Pay; y métodos locales (Alipay / WeChat Pay para China y Hong Kong). Todos se procesan a través de pasarelas certificadas PCI-DSS.',
            },
            {
                h: '2. Seguridad del Pago',
                p: 'Los datos de tarjeta no se almacenan en los servidores de SATURNA™. La transacción se cifra de extremo a extremo y se tokeniza por la pasarela de pago.',
            },
            {
                h: '3. Prevención de Fraude de Pago',
                p: 'SATURNA™ aplica sistemas de detección de fraude: análisis de riesgo por transacción, verificación de dirección (AVS), código de seguridad (CVV) y autenticación reforzada (3-D Secure) cuando la pasarela lo requiere.',
            },
            {
                h: '4. Comportamientos Sospechosos',
                p: 'Se monitorizan patrones sospechosos: pedidos con tarjetas de alto riesgo, direcciones de envío inconsistentes, múltiples intentos de pago fallidos o pedidos atípicos por volumen. SATURNA™ puede solicitar verificación adicional antes de despachar.',
            },
            {
                h: '5. Abuso Multi-Cuenta',
                p: 'La creación de múltiples cuentas para abusar de promociones, cupones o pruebas gratuitas está prohibida. SATURNA™ puede cancelar pedidos y desactivar cuentas en caso de abuso detectado.',
            },
            {
                h: '6. Contracargos (Chargebacks)',
                p: 'Ante un contracargo, SATURNA™ facilita la documentación de la transacción (prueba de entrega, IP, registro de pedido) para disputarlo. Se insta a las clientas a contactar primero con customerservice@saturna-fashions.com antes de iniciar un contracargo.',
            },
            {
                h: '7. Abuso de Cupones',
                p: 'Los cupones y códigos promocionales son de uso único salvo indicación. Su uso fraudulento, reventa o combinación no autorizada conlleva la anulación del pedido y, en su caso, de la cuenta.',
            },
            {
                h: '8. Devoluciones Falsas',
                p: 'Las devoluciones fraudulentas —envío de productos distintos, vacíos o usados— se investigan y pueden derivar en la desactivación de la cuenta y acciones legales.',
            },
            {
                h: '9. Verificación de Identidad y Pago',
                p: 'Cuando esté legalmente justificado, SATURNA™ puede solicitar verificación de identidad o de la titularidad del medio de pago antes de despachar pedidos de importe elevado o riesgo detectado.',
            },
        ],
    },
    tallas: {
        cat: 'shopping',
        icon: Ruler,
        title: 'Guía de Tallas',
        subtitle: 'Medidas · Ajuste · Recomendaciones',
        intro:
            'Consulte la guía de tallas antes de realizar su pedido. Las prendas SATURNA™ siguen una tabla de medidas estándar; las piezas a medida se confeccionan según las medidas facilitadas por la clienta.',
        sections: [
            {
                h: '1. Cómo Medirse',
                p: 'Tome las medidas sobre ropa interior ajustada, de pie y relajada: busto (parte más amplia del pecho); cintura (parte más estrecha); cadera (parte más amplia). Utilice una cinta métrica flexible y paralela al suelo.',
            },
            {
                h: '2. Tabla General (XS–XL)',
                p: 'XS: busto 80–84 cm, cintura 60–64 cm, cadera 86–90 cm. S: busto 84–88, cintura 64–68, cadera 90–94. M: busto 88–92, cintura 68–72, cadera 94–98. L: busto 92–96, cintura 72–76, cadera 98–102. XL: busto 96–100, cintura 76–80, cadera 102–106.',
            },
            {
                h: '3. Ajuste y Tolerancia',
                p: 'Las prendas de confección admiten una tolerancia de ±2 cm respecto a la tabla. Los corsets y bodysuits ajustados pueden requerir una talla superior para comodidad.',
            },
            {
                h: '4. Piezas a Medida',
                p: 'Para piezas a medida, SATURNA™ facilita una ficha de medidas tras la cita o el pedido. Las rectificaciones de ajuste dentro de los treinta (30) días posteriores a la entrega son gratuitas.',
            },
            {
                h: '5. Dudas de Talla',
                p: 'Si tiene dudas sobre la talla adecuada, contacte con customerservice@saturna-fashions.com indicando sus medidas y la prenda de interés; le asesoraremos antes de la compra.',
            },
        ],
    },

    /* ------------------------ CHINA / HONG KONG ---------------------- */
    'china-ecommerce': {
        cat: 'china',
        icon: Globe2,
        title: 'Comercio Electrónico China Continental',
        subtitle: '中国大陆电子商务 · Cumplimiento PIPL · Derechos del consumidor',
        intro:
            'Para clientas de China continental, los productos y servicios se prestan conforme a la legislación de comercio electrónico transfronterizo, protección de derechos del consumidor, aduanas, fiscalidad y protección de información personal aplicable.',
        sections: [
            {
                h: '1. Marco Aplicable',
                p: 'La venta a China continental se rige por la Ley de Comercio Electrónico de la República Popular China, la Ley de Protección de Derechos del Consumidor, la Ley de Ciberseguridad, la PIPL y la normativa de comercio transfronterizo aplicable.',
            },
            {
                h: '2. Operador Comercial',
                p: 'SATURNA™ es operada comercialmente por SWU-VISION GROUP LIMITED (N.º de registro 80605496, Hong Kong S.A.R.), bajo licencia de SWU-VISION CORPORATION. SATURNA™ no es una entidad jurídica independiente registrada, salvo indicación en contrario.',
            },
            {
                h: '3. Información del Producto',
                p: 'Cada ficha de producto muestra de forma veraz la descripción, materiales, origen, precio y disponibilidad, conforme a las obligaciones de información del operador de plataforma.',
            },
            {
                h: '4. Derechos del Consumidor',
                p: 'Las clientas de China continental disponen de los derechos reconocidos por la Ley de Protección de Derechos del Consumidor, incluido el derecho de devolución en siete (7) días para compras a distancia, salvo excepciones legales.',
            },
            {
                h: '5. Aduanas e Impuestos',
                p: 'Los pedidos transfronterizos pueden estar sujetos a aranceles, impuestos de importación y límites de valor personal conforme a la normativa aduanera china. La destinataria es responsable del cumplimiento de los límites de importación personal.',
            },
        ],
    },
    'cross-border': {
        cat: 'china',
        icon: Plane,
        title: 'Comercio Electrónico Transfronterizo',
        subtitle: '跨境电子商务 · Modelo operativo · Logística',
        intro:
            'SATURNA™ opera el modelo de comercio electrónico transfronterizo desde Hong Kong hacia China continental. El modelo exacto (WooCommerce desde Hong Kong, marketplace china o importador / entidad local) debe determinarse antes del despliegue de distribuidores.',
        sections: [
            {
                h: '1. Modelo Operativo',
                p: 'El envío a China continental se realiza desde Hong Kong como comercio transfronterizo de venta al por menor. SATURNA™ declara el valor real del envío y facilita la documentación aduanera necesaria.',
            },
            {
                h: '2. Logística Transfronteriza',
                p: 'Los pedidos se despachan desde Hong Kong y se entregan a través de operadores logísticos autorizados. El plazo estimado es de 5–10 días laborables, sujeto a despacho aduanero.',
            },
            {
                h: '3. Puntos a Validar',
                p: 'Antes del despliegue de distribuidores chinos, se recomienda: verificar el estatuto exacto de SWU-VISION GROUP LIMITED en el Companies Registry; formalizar la resolución/licencia SATURNA de SWU-VISION CORPORATION; determinar el modelo chino exacto; y realizar un análisis PIPL / transferencia de datos antes de centralizar los datos de clientas chinas en Hong Kong.',
            },
            {
                h: '4. Plataformas de Marketplace',
                p: 'Si SATURNA™ opera adicionalmente a través de marketplaces chinas autorizadas, las condiciones específicas de cada plataforma se comunicarán en la ficha correspondiente y prevalecerán en lo no dispuesto por la presente política.',
            },
        ],
    },
    'transferencia-datos': {
        cat: 'china',
        icon: Database,
        title: 'Política de Transferencia de Datos',
        subtitle: 'PIPL · Transferencia transfronteriza · China → Hong Kong',
        intro:
            'Para residentes de China continental, la transferencia transfronteriza de datos personales a Hong Kong u otras jurisdicciones se realiza conforme a la Ley de Protección de Información Personal (PIPL) de la República Popular China.',
        sections: [
            {
                h: '1. Base de la Transferencia',
                p: 'La transferencia de datos personales de residentes en China continental a Hong Kong se realiza con el consentimiento por separado de la titular, conforme al artículo 39 de la PIPL, y con las garantías adecuadas exigidas por la ley.',
            },
            {
                h: '2. Finalidad de la Transferencia',
                p: 'Los datos se transfieren a Hong Kong para la gestión de pedidos, logística transfronteriza, atención al cliente y cumplimiento de obligaciones legales y aduaneras.',
            },
            {
                h: '3. Protección en Destino',
                p: 'En Hong Kong, los datos se tratan conforme al PDPO (Cap. 486), que exige la protección de los datos contra el acceso, tratamiento, borrado, pérdida o uso no autorizado o accidental (pcpd.org.hk).',
            },
            {
                h: '4. Análisis Previo Recomendado',
                p: 'Se recomienda realizar un análisis PIPL / transferencia de datos antes de centralizar los datos de las clientas chinas en Hong Kong, evaluando la necesidad, proporcionalidad y garantías de la transferencia.',
            },
            {
                h: '5. Derechos de la Titular',
                p: 'La titular puede ejercer sus derechos conforme a la PIPL: acceso, rectificación, supresión, portabilidad y retirada del consentimiento a la transferencia. Las solicitudes se dirigen a servicelegals@saturna-fashions.com.',
            },
        ],
    },
    'devoluciones-china': {
        cat: 'china',
        icon: RotateCcw,
        title: 'Política de Devoluciones China',
        subtitle: '退货与退款政策 · 7 días · Condiciones',
        intro:
            'Para clientas de China continental, se aplica el derecho de devolución en siete (7) días para compras a distancia, conforme a la Ley de Protección de Derechos del Consumidor, sin perjuicio de las excepciones legales.',
        sections: [
            {
                h: '1. Derecho de Devolución de 7 Días',
                p: 'La clienta dispone de siete (7) días desde la recepción del producto para devolverlo sin necesidad de justificación, conforme a la Ley de Protección de Derechos del Consumidor de China, salvo que el producto esté excluido por la ley.',
            },
            {
                h: '2. Condiciones del Producto',
                p: 'El producto debe devolverse en su estado original, sin usar y con embalaje y etiquetas intactos. La calidad del producto no debe haberse visto afectada por el uso de la clienta.',
            },
            {
                h: '3. Costes de Devolución',
                p: 'Los gastos de envío de la devolución corren por cuenta de la clienta salvo defecto de fabricación o error atribuible a SATURNA™.',
            },
            {
                h: '4. Reembolso',
                p: 'El reembolso se efectúa en el plazo legal a través del medio de pago original. SATURNA™ no impone condiciones injustas ni razonables para el reembolso.',
            },
            {
                h: '5. Exclusiones Legales',
                p: 'Las piezas confeccionadas a medida pueden estar excluidas del derecho de devolución de 7 días conforme a la ley, salvo defecto de fabricación o no conformidad.',
            },
        ],
    },

    /* ---------------------------- CORPORATE -------------------------- */
    corporativa: {
        cat: 'corporate',
        icon: Building2,
        title: 'Información Corporativa',
        subtitle: 'SATURNA™ · Estructura · Jurisdicciones',
        intro:
            'SATURNA™ es una marca comercial de moda femenina operada por SWU-VISION GROUP LIMITED bajo licencia de SWU-VISION CORPORATION. La presente sección detalla la estructura corporativa y las jurisdicciones de operación.',
        sections: [
            {
                h: '1. Marca',
                p: 'SATURNA™ — Dark Fashion. Marca comercial de moda femenina de lujo, con estética oscura y femenina, dirigida a mujeres jóvenes. Tagline: ESTÉTICA · PODER · LIBERTAD.',
            },
            {
                h: '2. Titular de la Marca',
                p: 'SWU-VISION CORPORATION · N.º de registro 32-0853153 · Miami, Florida, Estados Unidos. Correo: servicelegals@saturna-fashions.com.',
            },
            {
                h: '3. Operador Comercial',
                p: 'SWU-VISION GROUP LIMITED · N.º de registro 80605496 · Unit 2904-05, 29/F, Universal Trade Centre, 3 Arbuthnot Road, Central, Hong Kong S.A.R. SWU-VISION GROUP LIMITED es responsable de la operación comercial, el desarrollo de mercados, el comercio electrónico y las actividades comerciales conexas, dentro del ámbito de la licencia concedida por SWU-VISION CORPORATION.',
            },
            {
                h: '4. Naturaleza de SATURNA™',
                p: 'SATURNA™ es una marca comercial del grupo SWU-VISION CORPORATION. SATURNA™ no es una entidad jurídica independiente registrada, salvo indicación expresa en contrario.',
            },
            {
                h: '5. Jurisdicciones de Operación',
                p: 'Estados Unidos (USD), Colombia (COP), Hong Kong (HKD) y China continental (CNY). Cada mercado aplica su legislación local en materia de consumo, privacidad, aduanas y comercio electrónico.',
            },
            {
                h: '6. Contacto',
                p: 'Atención al cliente: customerservice@saturna-fashions.com · Asuntos legales: servicelegals@saturna-fashions.com · Soporte técnico: support@saturna-fashions.com.',
            },
        ],
    },
    'swu-vision': {
        cat: 'corporate',
        icon: Building2,
        title: 'SWU-VISION GROUP LIMITED',
        subtitle: 'Operador comercial · Hong Kong S.A.R.',
        intro:
            'SWU-VISION GROUP LIMITED es la entidad comercial que opera la marca SATURNA™ bajo licencia de SWU-VISION CORPORATION, dentro del ámbito de su autorización.',
        sections: [
            {
                h: '1. Razón Social',
                p: 'SWU-VISION GROUP LIMITED · 公司注册编号: 80605496.',
            },
            {
                h: '2. Domicilio Social',
                p: 'Unit 2904-05, 29/F, Universal Trade Centre, 3 Arbuthnot Road, Central, Hong Kong S.A.R.',
            },
            {
                h: '3. Función',
                p: 'SWU-VISION GROUP LIMITED es responsable, dentro del ámbito de la autorización del grupo, de la operación comercial, el desarrollo de mercados, el comercio electrónico y las actividades comerciales conexas de SATURNA™.',
            },
            {
                h: '4. Relación con SWU-VISION CORPORATION',
                p: 'SATURNA™ es una marca comercial de moda del grupo SWU-VISION CORPORATION, operada comercialmente por SWU-VISION GROUP LIMITED bajo licencia. SATURNA™ no es una entidad jurídica independiente registrada, salvo indicación expresa en contrario.',
            },
            {
                h: '5. Cumplimiento China Continental',
                p: 'Los productos y servicios prestados a la región continental de China se ejecutan conforme a la legislación aplicable de comercio electrónico transfronterizo, protección de derechos del consumidor, aduanas, fiscalidad, protección de información personal y demás normativas pertinentes.',
            },
            {
                h: '6. Verificación del Estatuto',
                p: 'Se recomienda verificar el estatuto exacto de SWU-VISION GROUP LIMITED y la información oficial en el Companies Registry de Hong Kong antes del despliegue de distribuidores.',
            },
        ],
    },
};

/* Documents that are links to other pages instead of modals */
const LINK_DOCS = {
    about: { cat: 'corporate', title: 'Sobre SATURNA', zh: '关于 SATURNA', to: '/about' },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LegalPage() {
    const [active, setActive] = useState(null);

    useEffect(() => {
        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [active]);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setActive(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const doc = DOCS[active];

    return (
        <div className="min-h-screen bg-ink text-paper">
            <Helmet>
                <title>SATURNA™ — Centro Legal · Documentos y Políticas</title>
                <meta
                    name="description"
                    content="Centro legal SATURNA™: aviso legal, términos, privacidad, cookies, protección al consumidor, propiedad intelectual, reclamaciones, envíos, devoluciones, pagos, China/Hong Kong e información corporativa."
                />
                <meta name="robots" content="index,follow" />
            </Helmet>

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border bg-ink/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
                    <Link
                        to="/"
                        className="font-display text-xl font-bold uppercase tracking-[0.3em] text-paper transition-colors hover:text-violet-bright"
                    >
                        SATURNA<sup className="ml-0.5 text-[0.5em] text-violet-bright">™</sup>
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-smoke transition-colors hover:text-violet-bright"
                    >
                        <ChevronRight className="h-3.5 w-3.5 rotate-180" strokeWidth={1.5} />
                        Volver al inicio
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-border">
                <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
                    <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.4em] text-violet-bright">
                        <span className="inline-block h-px w-10 bg-violet-bright" />
                        Centro Legal
                        <span className="inline-block h-px w-10 bg-violet-bright" />
                    </p>
                    <h1 className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-paper md:text-7xl">
                        Documentos <span className="text-violet-bright">legales</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-silver md:text-base">
                        Arquitectura legal completa de SATURNA™. Cumplimiento normativo conforme a la
                        legislación de Colombia (Ley 1581, Ley 1480), Estados Unidos (CCPA, UCC, FTC),
                        Hong Kong (PDPO, Cap. 623) y China continental (PIPL, Ley del Consumidor).
                        Toda afirmación comercial publicada en este sitio puede justificarse.
                    </p>
                </div>
            </section>

            {/* Categories */}
            <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
                <div className="space-y-20">
                    {CATEGORIES.map((cat) => {
                        const docs = Object.entries(DOCS).filter(([, d]) => d.cat === cat.id);
                        const links = Object.entries(LINK_DOCS).filter(([, d]) => d.cat === cat.id);
                        return (
                            <div key={cat.id} id={cat.id}>
                                <div className="mb-8 flex flex-col gap-2 border-l-2 border-violet-bright pl-5">
                                    <div className="flex items-baseline gap-3">
                                        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-paper md:text-4xl">
                                            {cat.label}
                                        </h2>
                                        <span className="text-sm tracking-[0.2em] text-smoke">
                                            {cat.zh}
                                        </span>
                                    </div>
                                    <p className="max-w-2xl text-sm font-light leading-relaxed text-silver">
                                        {cat.blurb}
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {docs.map(([id, d], i) => (
                                        <motion.button
                                            key={id}
                                            onClick={() => setActive(id)}
                                            initial={{ opacity: 0, y: 16 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05, duration: 0.4 }}
                                            className="group relative flex items-start gap-4 border border-border bg-charcoal p-6 text-left transition-colors duration-300 hover:border-violet-bright/60"
                                        >
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-violet/40 bg-ink transition-colors duration-300 group-hover:border-violet-bright">
                                                <d.icon
                                                    className="h-5 w-5 text-violet-bright"
                                                    strokeWidth={1.5}
                                                />
                                            </span>
                                            <span className="flex-1">
                                                <span className="block font-display text-lg font-semibold uppercase tracking-tight text-paper transition-colors group-hover:text-violet-bright">
                                                    {d.title}
                                                </span>
                                                <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-smoke">
                                                    {d.subtitle}
                                                </span>
                                                <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-silver transition-colors group-hover:text-violet-bright">
                                                    Leer
                                                    <span className="h-px w-5 bg-violet-bright transition-all duration-300 group-hover:w-9" />
                                                </span>
                                            </span>
                                        </motion.button>
                                    ))}

                                    {links.map(([id, l]) => (
                                        <Link
                                            key={id}
                                            to={l.to}
                                            className="group relative flex items-start gap-4 border border-border bg-charcoal p-6 text-left transition-colors duration-300 hover:border-violet-bright/60"
                                        >
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-violet/40 bg-ink transition-colors duration-300 group-hover:border-violet-bright">
                                                <ArrowRight
                                                    className="h-5 w-5 text-violet-bright"
                                                    strokeWidth={1.5}
                                                />
                                            </span>
                                            <span className="flex-1">
                                                <span className="block font-display text-lg font-semibold uppercase tracking-tight text-paper transition-colors group-hover:text-violet-bright">
                                                    {l.title}
                                                </span>
                                                <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-smoke">
                                                    {l.zh}
                                                </span>
                                                <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-silver transition-colors group-hover:text-violet-bright">
                                                    Visitar
                                                    <span className="h-px w-5 bg-violet-bright transition-all duration-300 group-hover:w-9" />
                                                </span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <LaceDivider />

            {/* Footer note */}
            <section className="border-t border-border bg-charcoal">
                <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
                    <p className="text-center text-[11px] font-light leading-relaxed text-smoke">
                        SATURNA™ — Dark Fashion · Operada por SWU-VISION GROUP LIMITED (N.º 80605496,
                        Hong Kong S.A.R.) bajo licencia de SWU-VISION CORPORATION (N.º 32-0853153,
                        Miami, Florida, EE. UU.).
                    </p>
                    <p className="mt-3 text-center text-[10px] uppercase tracking-[0.25em] text-smoke/70">
                        © 2026 SATURNA™. Todos los derechos reservados.
                    </p>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {doc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/90 backdrop-blur-sm"
                        onClick={() => setActive(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative my-8 w-full max-w-3xl border border-border bg-charcoal"
                        >
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-charcoal/95 px-6 py-5 backdrop-blur md:px-8">
                                <div className="flex items-center gap-4">
                                    <span className="flex h-10 w-10 items-center justify-center border border-violet/40 bg-ink">
                                        <doc.icon
                                            className="h-5 w-5 text-violet-bright"
                                            strokeWidth={1.5}
                                        />
                                    </span>
                                    <div>
                                        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-paper md:text-3xl">
                                            {doc.title}
                                        </h3>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-smoke">
                                            {doc.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActive(null)}
                                    aria-label="Cerrar"
                                    className="flex h-10 w-10 items-center justify-center border border-border text-silver transition-colors hover:border-violet-bright hover:text-violet-bright"
                                >
                                    <X className="h-5 w-5" strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="max-h-[75vh] overflow-y-auto px-6 py-8 md:px-10 md:py-10">
                                <p className="mb-8 border-l-2 border-violet-bright pl-5 text-sm font-light italic leading-relaxed text-silver">
                                    {doc.intro}
                                </p>
                                <div className="space-y-7">
                                    {doc.sections.map((s) => (
                                        <div key={s.h}>
                                            <h4 className="mb-2 font-display text-lg font-semibold uppercase tracking-wide text-paper">
                                                {s.h}
                                            </h4>
                                            <p className="text-sm font-light leading-relaxed text-silver">
                                                {s.p}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-10 border-t border-border pt-6 text-[10px] uppercase tracking-[0.25em] text-smoke">
                                    Última revisión: {new Date().getFullYear()} · SATURNA™ — Dark
                                    Fashion
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
