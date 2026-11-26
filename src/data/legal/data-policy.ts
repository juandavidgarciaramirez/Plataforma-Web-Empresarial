/**
 * Contenido oficial de la Política de Tratamiento de Datos Personales de
 * Capital Consulting and Services S.A.S., fuente: documento institucional
 * "POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES CAPITAL CONSULTING AND
 * SERVICES S.A.S." (14 secciones, Ley 1581 de 2012 y Decreto 1074 de 2015).
 *
 * `DATA_POLICY_SECTIONS` reproduce el texto literal del documento oficial —
 * no se resume ni se altera su sentido. Las únicas adiciones son frases
 * puramente informativas (el canal de contacto de protección de datos) que
 * concretan, sin contradecir, cláusulas del propio documento que remiten a
 * "los canales... que la compañía disponga y comunique oficialmente"; están
 * señaladas como párrafos independientes, nunca mezcladas con el texto legal.
 *
 * Este mismo archivo alimenta tanto la página pública
 * `/politica-tratamiento-datos` como el bloque de autorización específico
 * del formulario de "Trabaja con nosotros" (`MAIN_CONSENT_PARAGRAPHS` y las
 * autorizaciones opcionales), que es un texto de consentimiento derivado,
 * propio del proceso de selección, y no una sección del documento oficial.
 */

import { LEGAL_ROUTES } from "@/config/legal"

export const COMPANY_LEGAL_INFO = {
  razonSocial: "Capital Consulting and Services S.A.S.",
  nit: "902077689-7",
  domicilio: "Bogotá D.C.",
  direccion: "CR 73 G No. 60 A - 52",
  correoProteccionDatos: "protecciondedatos@capitalconsulting.com.co",
  correoTalentoHumano: "peopleandculture@capitalconsulting.com.co",
} as const

/** Versión de la política publicada. Súbela cuando el documento oficial cambie de forma sustancial. */
export const DATA_POLICY_VERSION = "1.0"
export const DATA_POLICY_LAST_UPDATED = "2026-08-24"
export const DATA_POLICY_PATH = LEGAL_ROUTES.dataPolicyUrl

export interface PolicySection {
  id: string
  title: string
  paragraphs: string[]
}

/**
 * Secciones 1 a 14 del documento oficial, en el mismo orden y con el mismo
 * contenido. Los `id` se usan como anchors para el índice / tabla de
 * contenido de la página.
 */
export const DATA_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "objetivo",
    title: "1. Objetivo",
    paragraphs: [
      "Establecer los lineamientos, criterios y procedimientos aplicables al tratamiento de datos personales recolectados, almacenados, usados, circulados, transmitidos, transferidos o suprimidos por CAPITAL CONSULTING AND SERVICES S.A.S., en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013, compilado en el Decreto 1074 de 2015, y demás normas que los modifiquen, adicionen o complementen.",
    ],
  },
  {
    id: "responsable",
    title: "2. Responsable del tratamiento",
    paragraphs: [
      `La persona jurídica responsable del tratamiento de los datos personales será CAPITAL CONSULTING AND SERVICES S.A.S., identificada con NIT ${COMPANY_LEGAL_INFO.nit}, con domicilio principal en la ciudad de ${COMPANY_LEGAL_INFO.domicilio}, dirección ${COMPANY_LEGAL_INFO.direccion}. La compañía actuará como responsable del tratamiento respecto de la información personal suministrada por clientes, proveedores, contratistas, trabajadores, aspirantes, aliados comerciales y terceros en general.`,
    ],
  },
  {
    id: "area-responsable",
    title: "3. Área responsable de la atención de consultas y reclamos",
    paragraphs: [
      "La atención de consultas, reclamos, solicitudes de actualización, rectificación, supresión o revocatoria de autorización estará a cargo del área administrativa o del área que CAPITAL CONSULTING AND SERVICES S.A.S. designe para la gestión de protección de datos personales. Para estos efectos, el titular podrá presentar sus solicitudes a través de los canales físicos, telefónicos o electrónicos que la compañía disponga y comunique oficialmente.",
      `Canal oficial de contacto para protección de datos personales: ${COMPANY_LEGAL_INFO.correoProteccionDatos}.`,
    ],
  },
  {
    id: "datos-tratados",
    title: "4. Datos personales objeto de tratamiento",
    paragraphs: [
      "La compañía podrá recolectar y tratar datos de identificación, contacto, ubicación, información laboral, académica, comercial, contractual, tributaria, financiera, contable, de seguridad social, datos relacionados con proveedores, clientes, contratistas, hojas de vida, certificaciones, soportes documentales y demás información necesaria para el desarrollo de sus actividades. Cuando se requiera el tratamiento de datos sensibles, tales como información de salud, datos biométricos, fotografías, imágenes, videos o información relacionada con condiciones especiales del titular, la compañía informará previamente su carácter facultativo y solicitará autorización expresa cuando legalmente corresponda.",
    ],
  },
  {
    id: "finalidades",
    title: "5. Tratamiento y finalidades",
    paragraphs: [
      "El tratamiento de los datos personales podrá comprender la recolección, almacenamiento, uso, circulación, transmisión, transferencia, actualización, supresión y conservación de la información, por medios físicos, electrónicos, digitales, telefónicos o cualquier otro mecanismo permitido por la ley. Las finalidades incluyen: gestionar relaciones comerciales, contractuales y administrativas; prestar servicios; atender solicitudes de clientes, proveedores y terceros; adelantar procesos de selección y contratación; administrar información laboral y de seguridad social; realizar facturación, pagos, cobros y reportes contables o tributarios; cumplir obligaciones legales, judiciales, administrativas y contractuales; evaluar calidad del servicio; enviar comunicaciones institucionales o comerciales autorizadas; administrar bases de datos; atender auditorías internas o externas; y conservar soportes documentales conforme a los términos legales aplicables.",
    ],
  },
  {
    id: "autorizacion",
    title: "6. Autorización para el tratamiento",
    paragraphs: [
      "La autorización del titular será previa, expresa e informada, salvo en los casos exceptuados por la ley. Dicha autorización podrá obtenerse por escrito, verbalmente, por medios electrónicos, digitales, telefónicos, formularios físicos o virtuales, contratos, formatos, registros, aceptación expresa o mediante conductas inequívocas que permitan concluir razonablemente que el titular otorgó su consentimiento. La compañía conservará prueba de la autorización otorgada cuando sea exigible.",
    ],
  },
  {
    id: "seguridad",
    title: "7. Seguridad y confidencialidad de la información",
    paragraphs: [
      "CAPITAL CONSULTING AND SERVICES S.A.S. implementará medidas administrativas, técnicas, físicas y organizacionales razonables para proteger los datos personales contra pérdida, acceso no autorizado, uso indebido, adulteración, consulta, circulación o supresión no autorizada. El tratamiento será realizado únicamente por personal autorizado o por terceros encargados bajo obligaciones de confidencialidad y seguridad. La reserva de la información se mantendrá incluso después de finalizada la relación contractual, comercial, laboral o de cualquier otra naturaleza con el titular.",
    ],
  },
  {
    id: "transferencia",
    title: "8. Transferencia y transmisión de datos personales",
    paragraphs: [
      "La compañía podrá transmitir o transferir datos personales a proveedores, aliados, contratistas, asesores, auditores, autoridades administrativas o judiciales, entidades públicas, operadores tecnológicos, entidades financieras, aseguradoras, administradoras de seguridad social y demás terceros que resulten necesarios para cumplir las finalidades autorizadas o las obligaciones legales y contractuales aplicables. Cuando proceda, se suscribirán acuerdos de confidencialidad, contratos de transmisión o documentos equivalentes que impongan al tercero la obligación de proteger la información conforme a la ley y a esta política.",
    ],
  },
  {
    id: "derechos",
    title: "9. Derechos de los titulares",
    paragraphs: [
      "De conformidad con el artículo 8 de la Ley 1581 de 2012, los titulares tienen derecho a conocer, actualizar y rectificar sus datos personales; solicitar prueba de la autorización otorgada, salvo excepción legal; ser informados sobre el uso dado a sus datos; presentar quejas ante la Superintendencia de Industria y Comercio; revocar la autorización y/o solicitar la supresión del dato cuando proceda; y acceder gratuitamente a sus datos personales en los términos previstos por la ley.",
      `Estos derechos pueden ejercerse escribiendo a ${COMPANY_LEGAL_INFO.correoProteccionDatos}.`,
    ],
  },
  {
    id: "procedimiento",
    title: "10. Procedimiento para consultas y reclamos",
    paragraphs: [
      "Las consultas serán atendidas dentro de los diez (10) días hábiles siguientes a su recibo. Cuando no sea posible atenderlas en dicho término, se informará al interesado los motivos de la demora y la fecha de respuesta, la cual no podrá superar los cinco (5) días hábiles siguientes al vencimiento del primer término. Los reclamos relacionados con corrección, actualización, supresión o presunto incumplimiento deberán contener la identificación del titular, descripción de los hechos, dirección o medio de respuesta y documentos soporte. Si el reclamo está incompleto, la compañía podrá requerir al interesado dentro de los cinco (5) días siguientes para que subsane la información. El reclamo será atendido dentro de los quince (15) días hábiles siguientes a su recibo completo; si no fuere posible responder en dicho término, se informará la razón de la demora y se dará respuesta en un plazo máximo de ocho (8) días hábiles adicionales.",
    ],
  },
  {
    id: "cookies",
    title: "11. Cookies y medios digitales",
    paragraphs: [
      "Cuando la compañía utilice páginas web, plataformas digitales, formularios electrónicos o herramientas tecnológicas, podrá emplear cookies u otros mecanismos similares para mejorar la experiencia de navegación, facilitar el uso de los servicios, analizar tendencias, administrar contenidos y fortalecer la seguridad de los canales digitales. El titular podrá configurar su navegador para restringir o bloquear el uso de cookies, sin perjuicio de que algunas funcionalidades puedan verse limitadas.",
    ],
  },
  {
    id: "negativa",
    title: "12. Negativa de acceso, supresión o revocatoria",
    paragraphs: [
      "CAPITAL CONSULTING AND SERVICES S.A.S. podrá negar total o parcialmente el acceso, rectificación, supresión o revocatoria cuando el solicitante no sea el titular o no acredite debidamente su representación; cuando la información no repose en las bases de datos de la compañía; cuando exista deber legal o contractual de conservarla; cuando se afecten derechos de terceros; cuando exista orden de autoridad competente; o cuando la solicitud ya haya sido atendida previamente y carezca de objeto.",
    ],
  },
  {
    id: "cambios",
    title: "13. Cambios a la política",
    paragraphs: [
      "CAPITAL CONSULTING AND SERVICES S.A.S. se reserva el derecho de modificar, actualizar o ajustar la presente política cuando lo considere necesario o cuando existan cambios normativos, operativos, administrativos o tecnológicos. Cuando las modificaciones sean sustanciales y afecten la identificación del responsable o las finalidades del tratamiento, la compañía comunicará dichos cambios a los titulares y, cuando corresponda, solicitará una nueva autorización.",
    ],
  },
  {
    id: "vigencia",
    title: "14. Vigencia",
    paragraphs: [
      "La presente política rige a partir de su publicación y permanecerá vigente mientras CAPITAL CONSULTING AND SERVICES S.A.S. desarrolle las finalidades de tratamiento aquí previstas o mientras exista obligación legal, contractual, contable, administrativa o judicial de conservar la información.",
    ],
  },
]

// ---------------------------------------------------------------------------
// Autorización específica del formulario "Trabaja con nosotros" (Base de
// Altos Potenciales). No es una sección del documento oficial: es el texto
// de consentimiento que se presenta al postulante, redactado conforme a la
// Ley 1581 de 2012 / Decreto 1377 de 2013 y a las finalidades de selección y
// gestión de talento humano descritas en la política oficial (secciones 4-5
// arriba). Se guarda como `consentText` en la evidencia del consentimiento
// (sección 21 del brief) para trazar exactamente lo que el titular aceptó.
// ---------------------------------------------------------------------------

export const MAIN_CONSENT_PARAGRAPHS: string[] = [
  `De conformidad con la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas concordantes sobre protección de datos personales en Colombia, autorizo de manera previa, expresa e informada a ${COMPANY_LEGAL_INFO.razonSocial}, identificada con NIT ${COMPANY_LEGAL_INFO.nit}, con domicilio en ${COMPANY_LEGAL_INFO.domicilio} y dirección ${COMPANY_LEGAL_INFO.direccion}, para recolectar, almacenar, usar, circular, transmitir y en general tratar mis datos personales conforme a su Política de Tratamiento de Datos Personales.`,
  "Los datos suministrados serán utilizados para: (i) adelantar el proceso de selección al que me postulo; (ii) evaluar mi perfil para futuros procesos de selección; (iii) incluir mi información en la Base de Altos Potenciales de la compañía; (iv) verificar la información, referencias y antecedentes que suministro, incluyendo estudios de seguridad cuando la vacante o el perfil lo requieran; y (v) las demás finalidades propias de la gestión de talento humano.",
  "Declaro que la información que suministro voluntariamente, incluyendo aquella que pueda constituir dato sensible (por ejemplo, datos de salud cuando se requieran para procesos de Seguridad y Salud en el Trabajo), es entregada de forma libre, y que no estoy obligado(a) a responder preguntas sobre esta clase de datos.",
  `Como titular de la información tengo derecho a conocer, actualizar, rectificar y suprimir mis datos personales, así como a revocar esta autorización en cualquier momento, salvo que exista un deber legal o contractual que impida su eliminación. Puedo ejercer estos derechos escribiendo a ${COMPANY_LEGAL_INFO.correoProteccionDatos}.`,
  "Mis datos personales serán conservados durante el tiempo razonablemente necesario para cumplir las finalidades aquí descritas y, posteriormente, mientras subsista mi inclusión en la Base de Altos Potenciales o exista una obligación legal, contractual o probatoria que justifique su conservación, en los términos de la Política de Tratamiento de Datos Personales de Capital Consulting.",
  `He leído y acepto la Política de Tratamiento de Datos Personales de Capital Consulting and Services S.A.S., disponible en ${DATA_POLICY_PATH}.`,
]

export const OPTIONAL_CONSENT_COMMS_TEXT =
  "Autorizo el envío de ofertas laborales y comunicaciones comerciales de Capital Consulting and Services S.A.S. por WhatsApp, correo electrónico, SMS y llamadas telefónicas, en los términos de la Ley 2300 de 2023, pudiendo oponerme en cualquier momento por los canales indicados."

export const OPTIONAL_CONSENT_SHARE_TEXT =
  "Autorizo que mi hoja de vida sea compartida con las empresas del grupo empresarial de Capital Consulting and Services S.A.S. y con sus clientes y aliados en Colombia para los cuales adelante procesos de selección."

export const MAIN_CONSENT_CHECKBOX_LABEL = "Sí, autorizo el tratamiento de mis datos personales."
