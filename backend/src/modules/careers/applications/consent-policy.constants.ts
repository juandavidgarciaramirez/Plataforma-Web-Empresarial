/**
 * Texto de consentimiento del formulario "Trabaja con nosotros" (sección 24
 * del encargo: evidencia del consentimiento). Porteado 1:1 desde
 * `src/data/legal/data-policy.ts` (frontend) — es el mismo texto que el
 * postulante ve y acepta en el formulario público; se guarda aquí también
 * porque el backend necesita el snapshot exacto para `consentText`, sin
 * depender de un import cruzado hacia el proyecto Next.js.
 *
 * Si el texto legal cambia, actualizar en AMBOS lugares y subir
 * `DATA_POLICY_VERSION` en los dos (frontend y backend deben coincidir).
 */
export const DATA_POLICY_VERSION = '1.0';

const COMPANY = {
  razonSocial: 'Capital Consulting and Services S.A.S.',
  nit: '902077689-7',
  domicilio: 'Bogotá D.C.',
  direccion: 'CR 73 G No. 60 A - 52',
  correoProteccionDatos: 'protecciondedatos@capitalconsulting.com.co',
};

export const MAIN_CONSENT_PARAGRAPHS: string[] = [
  `De conformidad con la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas concordantes sobre protección de datos personales en Colombia, autorizo de manera previa, expresa e informada a ${COMPANY.razonSocial}, identificada con NIT ${COMPANY.nit}, con domicilio en ${COMPANY.domicilio} y dirección ${COMPANY.direccion}, para recolectar, almacenar, usar, circular, transmitir y en general tratar mis datos personales conforme a su Política de Tratamiento de Datos Personales.`,
  'Los datos suministrados serán utilizados para: (i) adelantar el proceso de selección al que me postulo; (ii) evaluar mi perfil para futuros procesos de selección; (iii) incluir mi información en la Base de Altos Potenciales de la compañía; (iv) verificar la información, referencias y antecedentes que suministro, incluyendo estudios de seguridad cuando la vacante o el perfil lo requieran; y (v) las demás finalidades propias de la gestión de talento humano.',
  'Declaro que la información que suministro voluntariamente, incluyendo aquella que pueda constituir dato sensible (por ejemplo, datos de salud cuando se requieran para procesos de Seguridad y Salud en el Trabajo), es entregada de forma libre, y que no estoy obligado(a) a responder preguntas sobre esta clase de datos.',
  `Como titular de la información tengo derecho a conocer, actualizar, rectificar y suprimir mis datos personales, así como a revocar esta autorización en cualquier momento, salvo que exista un deber legal o contractual que impida su eliminación. Puedo ejercer estos derechos escribiendo a ${COMPANY.correoProteccionDatos}.`,
  'Mis datos personales serán conservados durante el tiempo razonablemente necesario para cumplir las finalidades aquí descritas y, posteriormente, mientras subsista mi inclusión en la Base de Altos Potenciales o exista una obligación legal, contractual o probatoria que justifique su conservación, en los términos de la Política de Tratamiento de Datos Personales de Capital Consulting.',
  'He leído y acepto la Política de Tratamiento de Datos Personales de Capital Consulting and Services S.A.S.',
];
