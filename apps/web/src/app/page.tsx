// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import Link from 'next/link';

const SERVICIOS = [
  {
    icono: '⚖️',
    titulo: 'Asesoría Legal',
    desc: 'Orientación jurídica especializada en materia comercial, contratos mercantiles y litigios empresariales.',
  },
  {
    icono: '📊',
    titulo: 'Capacitación Empresarial',
    desc: 'Talleres, seminarios y programas de formación continua para el crecimiento de tu organización.',
  },
  {
    icono: '🤝',
    titulo: 'Networking Estratégico',
    desc: 'Conéctate con líderes empresariales y amplía tu red de contactos en el estado Zulia y la región.',
  },
  {
    icono: '📢',
    titulo: 'Promoción Comercial',
    desc: 'Visibilidad para tu empresa a través de nuestros canales institucionales y ferias comerciales.',
  },
  {
    icono: '🏛️',
    titulo: 'Representación Gremial',
    desc: 'Defendemos los intereses del sector comercial ante instituciones públicas y organismos nacionales.',
  },
  {
    icono: '📑',
    titulo: 'Trámites y Certificaciones',
    desc: 'Acompañamiento en gestiones administrativas, cartas aval y constancias de afiliación.',
  },
];

const STATS = [
  { valor: '500+', label: 'Empresas Afiliadas' },
  { valor: '+30', label: 'Años de Trayectoria' },
  { valor: '12', label: 'Sectores Representados' },
  { valor: '100%', label: 'Compromiso Gremial' },
];

const EVENTOS = [
  {
    mes: 'JUL',
    dia: '18',
    titulo: 'Feria Comercial Zulia 2026',
    lugar: 'Centro de Convenciones de Maracaibo',
    tipo: 'Feria',
  },
  {
    mes: 'AGO',
    dia: '05',
    titulo: 'Foro de Oportunidades de Inversión',
    lugar: 'Sede UCEZ, Maracaibo',
    tipo: 'Foro',
  },
  {
    mes: 'SEP',
    dia: '22',
    titulo: 'Taller de Transformación Digital',
    lugar: 'Plataforma Virtual UCEZ',
    tipo: 'Taller',
  },
];

const VALORES = [
  { titulo: 'Misión', desc: 'Promover el desarrollo sostenible del comercio zuliano, generando valor para nuestros afiliados y la comunidad.' },
  { titulo: 'Visión', desc: 'Ser la cámara de comercio líder del occidente venezolano, referente de transparencia e innovación gremial.' },
  { titulo: 'Valores', desc: 'Transparencia, integridad, compromiso, solidaridad e innovación como pilares de nuestra gestión institucional.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c1f3d]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#c8932a]">
              <span className="text-white font-black text-base tracking-tight">UC</span>
            </div>
            <div className="leading-tight">
              <p className="text-white font-black text-sm tracking-widest">UCEZ</p>
              <p className="text-[#c8932a] text-[10px] font-medium tracking-wider uppercase hidden sm:block">
                Unión de Comerciantes del Estado Zulia
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/70">
            {['#servicios', '#eventos', '#nosotros', '#contacto'].map((href) => {
              const labels: Record<string, string> = {
                '#servicios': 'Servicios', '#eventos': 'Eventos',
                '#nosotros': 'Nosotros', '#contacto': 'Contacto',
              };
              return (
                <a key={href} href={href}
                  className="hover:text-white transition-colors duration-200 hover:tracking-wide">
                  {labels[href]}
                </a>
              );
            })}
          </nav>

          {/* CTA */}
          <Link href="/login"
            className="flex items-center gap-2 bg-[#c8932a] hover:bg-[#b07d22] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-[#c8932a]/20 hover:shadow-[#c8932a]/40">
            Zona de Afiliados
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0c1f3d] pt-[70px]">
        {/* Grid decorativo */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        {/* Glow izquierda */}
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-[#c8932a]/10 blur-[120px]" />
        {/* Glow derecha */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1a3c6e]/60 blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#c8932a]/10 border border-[#c8932a]/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8932a] animate-pulse" />
              <span className="text-[#c8932a] text-xs font-semibold uppercase tracking-widest">
                Cámara de Comercio · Estado Zulia
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6">
              Impulsando el
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#c8932a] to-[#e8b84b]">
                Comercio Zuliano
              </span>
              desde 1966
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
              Somos la organización gremial que representa, protege y fortalece
              al sector comercial del estado Zulia. Más de 500 empresas confían
              en nosotros para crecer y desarrollarse.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login"
                className="inline-flex items-center justify-center gap-2 bg-[#c8932a] hover:bg-[#b07d22] text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-xl shadow-[#c8932a]/30 hover:shadow-[#c8932a]/50 hover:-translate-y-0.5">
                Zona de Afiliados
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a href="#nosotros"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:bg-white/5">
                Conoce UCEZ
              </a>
            </div>
          </div>

          {/* Panel de stats */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-[#c8932a]/30 transition-all duration-300">
                <p className="text-4xl font-black text-white mb-1">{s.valor}</p>
                <div className="w-8 h-0.5 bg-[#c8932a] mb-3" />
                <p className="text-white/50 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Degradado hacia abajo */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── STATS (mobile) ── */}
      <section className="lg:hidden bg-[#0c1f3d] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 gap-px bg-white/10">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#0c1f3d] p-6 text-center">
              <p className="text-3xl font-black text-white">{s.valor}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-[#c8932a] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Beneficios para tus afiliados
            </p>
            <h2 className="text-4xl font-black text-[#0c1f3d] leading-tight mb-4">
              Todo lo que necesita tu empresa en un solo lugar
            </h2>
            <div className="w-16 h-1 bg-[#c8932a] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICIOS.map((s) => (
              <div key={s.titulo}
                className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:border-[#c8932a]/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#c8932a] to-[#e8b84b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-4xl mb-5 block">{s.icono}</span>
                <h3 className="text-lg font-black text-[#0c1f3d] mb-3">{s.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA AFILIADOS ── */}
      <section className="relative overflow-hidden bg-[#0c1f3d] py-24">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#c8932a]/10 blur-[80px]" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#c8932a]/10 border border-[#c8932a]/20 mb-8">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8932a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
            Tu empresa ya es parte de UCEZ.<br />
            <span className="text-[#c8932a]">Accede a tu zona privada.</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Consulta el estado de tus pagos, descarga recibos oficiales,
            inscríbete en eventos y mantente al día con todas las comunicaciones gremiales.
          </p>
          <Link href="/login"
            className="inline-flex items-center gap-3 bg-[#c8932a] hover:bg-[#b07d22] text-white font-bold px-10 py-5 rounded-xl text-lg transition-all duration-200 shadow-2xl shadow-[#c8932a]/30 hover:shadow-[#c8932a]/50 hover:-translate-y-0.5">
            Entrar a Zona de Afiliados
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── EVENTOS ── */}
      <section id="eventos" className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-[#c8932a] text-xs font-bold uppercase tracking-[0.2em] mb-3">Agenda institucional</p>
            <h2 className="text-4xl font-black text-[#0c1f3d] leading-tight mb-4">Próximos Eventos</h2>
            <div className="w-16 h-1 bg-[#c8932a] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EVENTOS.map((e) => (
              <div key={e.titulo}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-[#0c1f3d] px-6 py-5 flex items-center justify-between">
                  <div className="text-center leading-none">
                    <p className="text-[#c8932a] text-xs font-bold uppercase tracking-widest">{e.mes}</p>
                    <p className="text-white text-4xl font-black">{e.dia}</p>
                    <p className="text-white/30 text-xs">2026</p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c8932a] border border-[#c8932a]/30 rounded-full px-3 py-1">
                    {e.tipo}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-black text-[#0c1f3d] text-lg mb-3 group-hover:text-[#c8932a] transition-colors duration-200">
                    {e.titulo}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z" />
                      <circle cx="7" cy="5" r="1.5" />
                    </svg>
                    {e.lugar}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ── */}
      <section id="nosotros" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Bloque visual izquierdo */}
          <div className="relative">
            <div className="bg-[#0c1f3d] rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#c8932a]/10 -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-[#c8932a] mb-8">
                  <span className="text-white font-black text-3xl">UC</span>
                </div>
                <p className="text-[#c8932a] text-xs font-bold uppercase tracking-[0.2em] mb-2">Desde 1966</p>
                <p className="text-white text-3xl font-black leading-tight mb-6">
                  Más de 30 años<br />al servicio del<br />comercio zuliano
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <p className="text-[#c8932a] text-2xl font-black">{s.valor}</p>
                      <p className="text-white/40 text-xs mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Texto derecho */}
          <div>
            <p className="text-[#c8932a] text-xs font-bold uppercase tracking-[0.2em] mb-3">Quiénes somos</p>
            <h2 className="text-4xl font-black text-[#0c1f3d] leading-tight mb-4">
              La voz del comercio en el estado Zulia
            </h2>
            <div className="w-16 h-1 bg-[#c8932a] rounded-full mb-8" />
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              La Unión de Comerciantes del Estado Zulia (UCEZ) es una organización gremial
              sin fines de lucro dedicada a representar, proteger y promover los intereses
              del sector comercial de nuestra región. Trabajamos con empresas de todos los
              tamaños, desde el pequeño comerciante local hasta grandes corporaciones.
            </p>

            <div className="space-y-5">
              {VALORES.map((v) => (
                <div key={v.titulo}
                  className="flex gap-5 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#c8932a]/20 hover:bg-white transition-all duration-200">
                  <div className="w-1 flex-shrink-0 rounded-full bg-[#c8932a]" />
                  <div>
                    <p className="font-black text-[#0c1f3d] mb-1">{v.titulo}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-[#c8932a] text-xs font-bold uppercase tracking-[0.2em] mb-3">Contáctanos</p>
            <h2 className="text-4xl font-black text-[#0c1f3d] leading-tight mb-4">Estamos para servirte</h2>
            <div className="w-16 h-1 bg-[#c8932a] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icono: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8932a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                ),
                titulo: 'Dirección',
                lineas: ['Av. 5 de Julio, Edificio UCEZ', 'Maracaibo, Estado Zulia', 'Venezuela'],
              },
              {
                icono: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8932a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.9v2.02z" />
                  </svg>
                ),
                titulo: 'Teléfono',
                lineas: ['(0261) 000-0000', 'Lunes a Viernes', '8:00 AM – 5:00 PM'],
              },
              {
                icono: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8932a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
                titulo: 'Correo Electrónico',
                lineas: ['info@ucez.com', 'comercio@ucez.com'],
              },
            ].map((c) => (
              <div key={c.titulo}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#c8932a]/20 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#c8932a]/10 flex items-center justify-center mb-6">
                  {c.icono}
                </div>
                <h3 className="font-black text-[#0c1f3d] text-lg mb-4">{c.titulo}</h3>
                {c.lineas.map((l) => (
                  <p key={l} className="text-gray-500 text-sm leading-loose">{l}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#070f1d] text-white">
        {/* Barra superior */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-[#c8932a] flex items-center justify-center">
                  <span className="text-white font-black text-sm">UC</span>
                </div>
                <div>
                  <p className="text-white font-black text-sm tracking-widest">UCEZ</p>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">Estado Zulia</p>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Organización gremial que representa y fortalece al sector comercial del estado Zulia desde 1966.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-5">Institución</p>
              <ul className="space-y-3">
                {['Quiénes somos', 'Servicios', 'Eventos', 'Contacto'].map((l) => (
                  <li key={l}>
                    <a href="#nosotros" className="text-white/50 text-sm hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Acceso */}
            <div>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-5">Acceso</p>
              <Link href="/login"
                className="inline-flex items-center gap-2 border border-[#c8932a]/50 text-[#c8932a] hover:bg-[#c8932a] hover:text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all duration-200">
                Zona de Afiliados →
              </Link>
              <p className="text-white/30 text-xs mt-5 leading-relaxed">
                Accede a tu portal para gestionar pagos, eventos y comunicaciones gremiales.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">
            © 2026 UCEZ — Unión de Comerciantes del Estado Zulia. Todos los Derechos Reservados.
          </p>
          <p className="text-white/20 text-xs">Diseñado por Edward Labrador</p>
        </div>
      </footer>

    </div>
  );
}
