"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BatteryFull, ClipboardText, Disc, Drop, Engine, MapPin, NavigationArrow, Phone, Plus, Tire } from "@phosphor-icons/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { Reveal, Wrap, flipTheme, fmtH, useClock, type Hours } from "@/components/kit";
import { T, useLang, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const TEL = "tel:+14697820069", PHONE = "(469) 782-0069";
const DIR = "https://www.google.com/maps/dir/?api=1&destination=3315+S+Shiloh+Rd+Garland+TX+75041";
// From public listings ([open, close], 24h). Saturday close varies by listing (4:00 or 4:30).
const HOURS: Hours = { 0: null, 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 16.5] };
const DAYS = { en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] };
const TX = {
  en: { closed: "Closed", open: (t: string) => "Open now · until " + t, opens: (t: string) => "Opens today at " + t, shut: "Closed now", lang: "Cambiar a español", theme: "Toggle dark mode" },
  es: { closed: "Cerrado", open: (t: string) => "Abierto ahora · hasta las " + t, opens: (t: string) => "Abre hoy a las " + t, shut: "Cerrado ahora", lang: "Switch to English", theme: "Cambiar modo oscuro" },
};
const SERVICES = [
  { k: "c1", Icon: Tire, cls: "md:col-span-7 md:row-span-2", big: true },
  { k: "c2", Icon: Disc, cls: "md:col-span-5" },
  { k: "c3", Icon: Drop, cls: "md:col-span-5" },
  { k: "c4", Icon: ClipboardText, cls: "md:col-span-4" },
  { k: "c5", Icon: BatteryFull, cls: "md:col-span-4" },
  { k: "c6", Icon: Engine, cls: "md:col-span-4" },
];

const btn = "inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] font-bold transition-transform duration-300 ease-spring hover:-translate-y-0.5 active:scale-[.97]";
const yel = cn(btn, "bg-yel text-[#1d1700] shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_14px_30px_-12px_rgba(255,194,26,.7)]");
const dark = cn(btn, "bg-card text-ink shadow-[inset_0_0_0_1px_var(--line)]");

/** Language: a gear shifter in its gate, EN on the left, ES on the right. */
function Shifter() {
  const { lang, setLang } = useLang();
  const es = lang === "es";
  return (
    <button type="button" onClick={() => setLang(es ? "en" : "es")} aria-label={TX[es ? "es" : "en"].lang}
      className="relative h-10 w-[78px] flex-none cursor-pointer rounded-[10px] bg-asphalt shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]">
      <span className="absolute inset-x-[18px] top-1/2 h-1 -translate-y-1/2 rounded-sm bg-[#3a3e45]" />
      <span className={cn("absolute top-[3px] left-[7px] text-[10px] font-bold tracking-wide transition-colors", !es ? "text-yel" : "text-[#8d929a]")}>EN</span>
      <span className={cn("absolute top-[3px] right-[7px] text-[10px] font-bold tracking-wide transition-colors", es ? "text-yel" : "text-[#8d929a]")}>ES</span>
      <motion.span animate={{ x: es ? 32 : 0 }} transition={{ type: "spring", stiffness: 420, damping: 18 }}
        className="absolute top-1/2 left-3 -mt-[11px] size-[22px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0_12%,#ffc21a_30%,#c78f00_100%)] shadow-[0_3px_6px_rgba(0,0,0,.5)]" />
    </button>
  );
}

/** Theme: a rotary headlight knob; dark mode turns the lights on. */
function Headlight() {
  const { resolvedTheme, setTheme } = useTheme();
  const { lang } = useLang();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const on = ready && resolvedTheme === "dark";
  return (
    <button type="button" aria-label={TX[lang === "es" ? "es" : "en"].theme} aria-pressed={on}
      onClick={e => flipTheme(e.currentTarget, () => flushSync(() => setTheme(on ? "light" : "dark")))}
      className="relative size-11 flex-none cursor-pointer rounded-full bg-asphalt shadow-[inset_0_0_0_3px_#3a3e45]">
      <span className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#4b5058,#23262b)] transition-transform duration-500 ease-spring" style={{ transform: on ? "rotate(90deg)" : "none" }}>
        <span className="absolute top-[3px] left-1/2 h-2.5 w-[3px] -translate-x-1/2 rounded-sm bg-yel" />
      </span>
      <svg viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 -right-2.5 size-4 -translate-y-1/2 text-yel transition-all duration-300"
        style={{ opacity: on ? 1 : 0, filter: on ? "drop-shadow(0 0 4px #ffc21a)" : "none" }} aria-hidden="true">
        <path d="M2 4h5M2 8h5M2 12h5M10 3c3 0 4 2.5 4 5s-1 5-4 5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** Speedometer: the needle sweeps to the 4.9 rating as the page loads. */
function Gauge() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".needle", { rotate: -90, svgOrigin: "160 160", duration: 2, ease: "elastic.out(1, 0.55)", delay: 0.4 });
      gsap.from(".arc", { strokeDashoffset: 377, duration: 1.8, ease: "power3.out", delay: 0.3 });
    });
  }, { scope: ref });
  return (
    <div ref={ref} className="relative overflow-hidden rounded-[32px] bg-asphalt p-2 shadow-[0_40px_80px_-40px_var(--shadow)]">
      <BorderBeam size={180} duration={9} colorFrom="#ffc21a" colorTo="#8a6200" borderWidth={1.5} />
      <div className="tread rounded-[26px] px-7 pt-8 pb-7 text-[#f1f0ec] shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]" aria-label="Rated 4.9 out of 5 by about 600 Google reviewers">
        <svg viewBox="0 0 320 200" className="block h-auto w-full" aria-hidden="true">
          <path d="M40 160 A120 120 0 0 1 280 160" fill="none" stroke="#2c3036" strokeWidth="20" strokeLinecap="round" />
          <path className="arc" d="M40 160 A120 120 0 0 1 280 160" fill="none" stroke="#ffc21a" strokeWidth="20" strokeLinecap="round" strokeDasharray="377" strokeDashoffset="8" />
          <g fill="#a3a7ae" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="var(--font-public)">
            <text x="40" y="190">0</text><text x="44" y="76">1</text><text x="160" y="22">2.5</text><text x="276" y="76">4</text><text x="280" y="190">5</text>
          </g>
          <g className="needle" transform="rotate(86.4 160 160)"><path d="M160 160 L160 58" stroke="#f1f0ec" strokeWidth="5" strokeLinecap="round" /></g>
          <circle cx="160" cy="160" r="13" fill="#ffc21a" /><circle cx="160" cy="160" r="5" fill="#17191c" />
        </svg>
        <div className="-mt-4 text-center">
          <b className="block font-display text-[72px] leading-none text-yel">4.9</b>
          <div className="text-lg tracking-[3px] text-yel">★★★★★</div>
          <T k="gaugeSub" className="text-sm text-[#a3a7ae]" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const t = useT();
  const { lang } = useLang();
  const L = lang === "es" ? "es" : "en";
  const clock = useClock(HOURS);
  const [faq, setFaq] = useState(0);
  const status = clock && (() => { const h = HOURS[clock.today]; return clock.open && h ? TX[L].open(fmtH(h[1])) : clock.opensLater && h ? TX[L].opens(fmtH(h[0])) : TX[L].shut; })();

  return (
    <>
      <div className="hazard h-2" />
      <header className="pointer-events-none sticky top-3 z-40 px-4">
        <nav className="glass pointer-events-auto mx-auto flex h-[68px] max-w-[1160px] items-center justify-between gap-3 rounded-2xl border border-line ps-3 pe-2.5 shadow-[inset_0_1px_0_var(--hi),0_20px_50px_-28px_var(--shadow)]">
          <a href="#top" className="flex flex-none items-center gap-2.5" aria-label="Shiloh Auto Repair & Tires">
            <span className="grid size-11 place-items-center rounded-xl bg-asphalt"><Tire size={26} weight="duotone" color="#ffc21a" /></span>
            <span><b className="block font-display text-2xl leading-[.9] font-black uppercase">Shiloh Auto</b><T k="logoSub" className="mt-0.5 block text-[11px] font-bold tracking-[.14em] text-soft uppercase max-sm:hidden" /></span>
          </a>
          <div className="flex items-center gap-1 text-[15px] font-semibold max-[960px]:hidden">
            {["Services", "Why", "Visit"].map(k => <a key={k} href={`#${k.toLowerCase()}`} className="rounded-full px-4 py-2 text-soft transition-colors hover:bg-bg2 hover:text-ink" dangerouslySetInnerHTML={{ __html: t(`nav${k}`) }} />)}
          </div>
          <div className="flex items-center gap-3">
            <Shifter /><Headlight />
            <a href={TEL} className={cn(yel, "px-5 py-2.5 max-sm:hidden")}><Phone size={17} weight="bold" />{PHONE}</a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="relative pt-16 pb-24 max-sm:pt-10">
          <Wrap className="grid grid-cols-[1.1fr_.9fr] items-center gap-14 max-[960px]:grid-cols-1">
            <div>
              <Reveal>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)]">
                  <i className={cn("size-2 rounded-full", clock?.open ? "bg-[#26a65b] shadow-[0_0_0_4px_rgba(38,166,91,.2)]" : "bg-[#9a9ea6]")} />{status ?? " "}
                </span>
              </Reveal>
              <Reveal delay={0.08}><T k="heroTitle" as="h1" className="mb-7 text-[clamp(52px,7vw,100px)] leading-[1.02] [&>span]:block [&_.y]:inline [&_.y]:bg-yel [&_.y]:px-[.12em] [&_.y]:text-[#17191c] [&_.y]:[box-decoration-break:clone]" /></Reveal>
              <Reveal delay={0.16}><T k="heroLead" as="p" className="mb-9 max-w-[48ch] text-lg text-soft" /></Reveal>
              <Reveal delay={0.24} className="flex flex-wrap gap-3">
                <a href={TEL} className={yel}><Phone size={18} weight="bold" /><T k="ctaCall" /></a>
                <a href={DIR} target="_blank" rel="noopener" className={dark}><NavigationArrow size={18} weight="bold" /><T k="ctaDir" /></a>
              </Reveal>
            </div>
            <Reveal delay={0.2} className="w-full max-w-[480px] justify-self-end max-[960px]:justify-self-start"><Gauge /></Reveal>
          </Wrap>
        </section>

        <div className="tread bg-asphalt py-5 text-[#f1f0ec]" aria-hidden="true">
          <Marquee className="[--duration:28s] [--gap:2.5rem]" reverse>
            {["b1", "b2", "b3", "b4", "b5"].map(k => (
              <span key={k} className="flex items-center gap-10 font-display text-3xl font-extrabold tracking-wide uppercase">
                <T k={k} /><i className="size-2.5 rotate-45 bg-yel" />
              </span>
            ))}
          </Marquee>
        </div>

        <section id="services" className="scroll-mt-24 py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="mb-14 max-w-[720px]">
              <T k="svcEyebrow" className="mb-3 inline-flex items-center gap-2 text-[13px] font-bold tracking-[.16em] text-acc uppercase" />
              <T k="svcTitle" as="h2" className="mb-4 text-[clamp(46px,6.4vw,84px)]" />
              <T k="svcLead" as="p" className="max-w-[58ch] text-[17px] text-soft" />
            </Reveal>
            <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-12">
              {SERVICES.map(({ k, Icon, cls, big }, i) => (
                <Reveal key={k} delay={(i % 3) * 0.06} className={cn("bezel rounded-[26px] transition-transform duration-500 ease-silk hover:-translate-y-1", cls)}>
                  <MagicCard gradientSize={240} gradientColor="rgba(255,194,26,.12)" gradientFrom="#ffc21a" gradientTo="#8a6200" className="h-full rounded-[21px] bg-card [&>div:last-child]:h-full">
                    <div className={cn("relative flex h-full flex-col justify-between gap-10 p-7", big && "tread bg-asphalt p-10 text-[#f1f0ec]")}>
                      <div className="flex items-start justify-between gap-4">
                        <span className={cn("grid place-items-center rounded-2xl bg-yel text-[#1d1700]", big ? "size-16" : "size-12")}><Icon size={big ? 34 : 26} weight="duotone" /></span>
                        {big && <T k="tagName" className="rounded-full bg-yel/15 px-3 py-1 text-[11px] font-bold tracking-[.1em] text-yel uppercase" />}
                      </div>
                      <div>
                        <T k={`${k}t`} as="h3" className={cn("mb-2", big ? "text-[clamp(56px,6vw,88px)]" : "text-[34px]")} />
                        <T k={`${k}p`} as="p" className={cn("max-w-[40ch] text-[15px]", big ? "text-[17px] text-[#b9bdc4]" : "text-soft")} />
                      </div>
                    </div>
                  </MagicCard>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        <section id="why" className="scroll-mt-24 bg-bg2 py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="mb-12 max-w-[720px]"><T k="whyTitle" as="h2" className="text-[clamp(46px,6.4vw,84px)]" /></Reveal>
            <Reveal className="relative grid grid-cols-4 overflow-hidden rounded-[28px] bg-asphalt text-[#f1f0ec] max-[960px]:grid-cols-2 max-sm:grid-cols-1">
              <BorderBeam size={240} duration={12} colorFrom="#ffc21a" colorTo="#8a6200" borderWidth={1.5} />
              {["t1", "t2", "t3", "t4"].map((k, i) => (
                <div key={k} className={cn("px-8 py-10", i > 0 && "border-s border-white/8 max-sm:border-s-0 max-sm:border-t")}>
                  <span className="mb-6 block font-display text-[64px] leading-none text-yel/25">0{i + 1}</span>
                  <T k={`${k}t`} as="b" className="mb-2 block font-display text-[32px] leading-none font-black text-yel uppercase" />
                  <T k={`${k}p`} as="p" className="text-[15px] text-[#b9bdc4]" />
                </div>
              ))}
            </Reveal>
          </Wrap>
        </section>

        <section id="visit" className="scroll-mt-24 py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="mb-12"><T k="visitEyebrow" className="mb-3 block text-[13px] font-bold tracking-[.16em] text-acc uppercase" /><T k="visitTitle" as="h2" className="text-[clamp(46px,6.4vw,84px)]" /></Reveal>
            <div className="grid grid-cols-[.9fr_1.1fr] gap-5 max-[960px]:grid-cols-1">
              <Reveal className="bezel rounded-[28px]">
                <div className="grid h-full content-start gap-5 rounded-[23px] bg-card p-8 shadow-[inset_0_1px_0_var(--hi)]">
                  <T k="hoursTitle" as="h3" className="text-[38px]" />
                  <table className="w-full text-[15px]"><tbody>
                    {[1, 2, 3, 4, 5, 6, 0].map(d => { const h = HOURS[d]; return (
                      <tr key={d} className={cn("border-b border-line", clock?.today === d && "text-acc")}>
                        <td className="py-2.5">{DAYS[L][d]}{clock?.today === d && " •"}</td>
                        <td className="py-2.5 text-end font-bold tabular-nums">{h ? `${fmtH(h[0])} - ${fmtH(h[1])}` : TX[L].closed}</td>
                      </tr>); })}
                  </tbody></table>
                  {[[TEL, Phone, PHONE, "callSub"], [DIR, MapPin, "3315 S Shiloh Rd", null]].map(([href, Icon, strong, sub]) => {
                    const I = Icon as typeof Phone;
                    return (
                      <a key={strong as string} href={href as string} target={sub ? undefined : "_blank"} rel="noopener" className="group flex items-start gap-3.5">
                        <span className="grid size-11 flex-none place-items-center rounded-xl bg-yel text-[#1d1700] transition-transform duration-300 ease-spring group-hover:scale-110"><I size={20} weight="bold" /></span>
                        <span><strong className="block">{strong as string}</strong>{sub ? <T k={sub as string} className="text-sm text-soft" /> : <span className="text-sm text-soft">Garland, TX 75041</span>}</span>
                      </a>
                    );
                  })}
                </div>
              </Reveal>
              <Reveal delay={0.08} className="bezel min-h-[440px] overflow-hidden rounded-[28px]">
                <iframe title="Map" loading="lazy" className="size-full min-h-[428px] rounded-[23px] border-0 [filter:var(--map)]" src={`https://maps.google.com/maps?q=3315+S+Shiloh+Rd,+Garland,+TX+75041&z=15&output=embed&hl=${lang}`} />
              </Reveal>
            </div>
          </Wrap>
        </section>

        <section className="bg-bg2 py-32 max-sm:py-20">
          <Wrap className="grid grid-cols-[.8fr_1.2fr] gap-14 max-[960px]:grid-cols-1">
            <Reveal><T k="faqEyebrow" className="mb-3 block text-[13px] font-bold tracking-[.16em] text-acc uppercase" /><T k="faqTitle" as="h2" className="text-[clamp(46px,6vw,76px)]" /></Reveal>
            <div className="grid gap-3">
              {[1, 2, 3, 4].map((n, i) => (
                <Reveal key={n} delay={i * 0.05} className="rounded-2xl bg-card shadow-[inset_0_0_0_1px_var(--line)]">
                  <button type="button" onClick={() => setFaq(faq === i ? -1 : i)} aria-expanded={faq === i}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-start text-[17px] font-bold">
                    <T k={`q${n}`} />
                    <Plus size={20} weight="bold" className="flex-none text-acc transition-transform duration-400 ease-spring" style={{ transform: faq === i ? "rotate(45deg)" : "none" }} />
                  </button>
                  <AnimatePresence initial={false}>
                    {faq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }} className="overflow-hidden">
                        <T k={`a${n}`} as="p" className="px-6 pb-5 text-soft" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        <section className="py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="relative flex items-center justify-between gap-8 overflow-hidden rounded-[32px] bg-yel px-14 pt-16 pb-20 text-[#1d1700] max-[960px]:flex-col max-[960px]:items-start max-sm:px-7">
              <div>
                <T k="ctaTitle" as="h2" className="mb-2 text-[clamp(48px,6.4vw,88px)]" />
                <T k="ctaLead" as="p" className="text-lg font-semibold" />
              </div>
              <a href={TEL} className={cn(btn, "flex-none bg-asphalt px-7 py-4 text-lg text-yel")}><Phone size={20} weight="bold" />{PHONE}</a>
              <div className="hazard absolute inset-x-0 bottom-0 h-3.5" />
            </Reveal>
          </Wrap>
        </section>
      </main>

      <footer className="pb-28 text-sm text-soft">
        <Wrap><div className="flex flex-wrap justify-between gap-3.5 border-t border-line pt-6">
          <span>© {new Date().getFullYear()} Shiloh Auto Repair &amp; Tires · 3315 S Shiloh Rd, Garland, TX 75041</span><a href={TEL}>{PHONE}</a>
        </div></Wrap>
      </footer>
      <div className="glass fixed inset-x-3 bottom-3 z-30 hidden gap-2 rounded-full p-1.5 shadow-[inset_0_0_0_1px_var(--line)] max-sm:flex">
        <a href={TEL} className={cn(yel, "flex-1 py-3")}><T k="barCall" /></a>
        <a href={DIR} target="_blank" rel="noopener" className={cn(dark, "flex-1 py-3")}><T k="barDir" /></a>
      </div>
    </>
  );
}
