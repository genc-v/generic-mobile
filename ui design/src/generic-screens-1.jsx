
// Screens 1–10: Auth, Orgs, Org Dashboard, Content
// Production-grade refinement: Geist + zinc neutrals, list-style rows, dot statuses

// shadcn/ui dark theme tokens — solid borders, no rgba transparency
const DS = {
  bg: '#09090B',           // background
  surface: '#09090B',      // card (same as bg + border)
  surface2: '#18181B',     // input / muted bg
  surface3: '#27272A',     // accent / hover
  border: '#27272A',       // border (solid)
  border2: '#3F3F46',      // border emphasis
  divider: '#27272A',
  text1: '#FAFAFA',        // foreground
  text2: '#A1A1AA',        // muted-foreground
  text3: '#71717A',
  text4: '#52525B',
  accent: '#A78BFA',
  accentStrong: '#8B5CF6',
  accentDim: 'rgba(167,139,250,0.10)',
  accentBorder: 'rgba(167,139,250,0.28)',
  green: '#22C55E', greenDim: 'rgba(34,197,94,0.10)',
  amber: '#EAB308', amberDim: 'rgba(234,179,8,0.10)',
  orange: '#F97316', orangeDim: 'rgba(249,115,22,0.10)',
  red: '#EF4444', redDim: 'rgba(239,68,68,0.10)',
  grey: '#71717A', greyDim: 'rgba(113,113,122,0.10)',
};

const mono = "'Geist Mono', 'SF Mono', monospace";
const sans = "'Geist', -apple-system, sans-serif";

// ── Shared primitives ─────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'14px 22px 8px', fontFamily:sans, fontSize:14, fontWeight:600, color:DS.text1, letterSpacing:'-0.01em' }}>
      <span>9:41</span>
      <div style={{ display:'flex', gap:5, alignItems:'center', opacity:0.85 }}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill={DS.text1}>
          <rect x="0" y="6" width="3" height="5" rx="0.5"/>
          <rect x="4.5" y="3.5" width="3" height="7.5" rx="0.5"/>
          <rect x="9" y="1" width="3" height="10" rx="0.5"/>
          <rect x="13" y="-1" width="3" height="12" rx="0.5"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill={DS.text1}>
          <path d="M7.5 2.2c2 0 3.9.8 5.3 2.2L14 3.2A8.5 8.5 0 0 0 1 3.2l1.2 1.2A7.5 7.5 0 0 1 7.5 2.2Z"/>
          <path d="M7.5 5c1.3 0 2.6.5 3.5 1.4l1.1-1.1A6 6 0 0 0 3.4 5.3l1.1 1.1A5 5 0 0 1 7.5 5Z"/>
          <circle cx="7.5" cy="9" r="1.5"/>
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.8" fill="none" stroke={DS.text1} strokeOpacity="0.4"/>
          <rect x="2" y="2" width="19" height="8" rx="1.6" fill={DS.text1}/>
          <path d="M24 4v4c0.7-0.3 1-0.9 1-2s-0.3-1.7-1-2Z" fill={DS.text1} opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

function Dot({ color }) {
  return <span style={{ display:'inline-block', width:6, height:6, borderRadius:3, background:color, flexShrink:0 }} />;
}

// shadcn Badge: rounded-md px-2.5 py-0.5 text-xs font-semibold, with variants
function StatusPill({ label, color }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6,
      padding:'2px 8px', borderRadius:6,
      background:DS.surface2, border:`1px solid ${DS.border}`,
      fontFamily:sans, fontSize:11, fontWeight:600, color:DS.text1, letterSpacing:'-0.005em' }}>
      <Dot color={color} />{label}
    </span>
  );
}

function RoleTag({ role }) {
  const map = { Admin: DS.accent, Editor: DS.green, Viewer: DS.text3, SYS_ADMIN: DS.accent, USER: DS.text3 };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6,
      padding:'2px 8px', borderRadius:6,
      background:DS.surface2, border:`1px solid ${DS.border}`,
      fontFamily:sans, fontSize:11, fontWeight:600, color:DS.text1, letterSpacing:'-0.005em' }}>
      <Dot color={map[role] || DS.text3} />
      {role}
    </span>
  );
}

// shadcn Badge secondary variant — used in detail headers
function Badge({ label, color, dimColor, small }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6,
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius:6, background:DS.surface2, color:DS.text1,
      fontFamily:sans, fontSize: small ? 11 : 12, fontWeight:600, letterSpacing:'-0.005em',
      border:`1px solid ${DS.border}` }}>
      <Dot color={color} />{label}
    </span>
  );
}

// shadcn Input: h-9, border, rounded-md, focus ring
function Input({ label, value, placeholder, type='text', note }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <div style={{ fontFamily:sans, fontSize:13, color:DS.text1, marginBottom:6, fontWeight:500, letterSpacing:'-0.005em' }}>{label}</div>}
      <div style={{ background:'transparent', border:`1px solid ${DS.border}`,
        borderRadius:6, padding:'0 12px', height:36,
        fontFamily:sans, fontSize:14, color: value ? DS.text1 : DS.text3,
        display:'flex', justifyContent:'space-between', alignItems:'center', letterSpacing:'-0.005em' }}>
        <span>{value || placeholder}</span>
        {type==='password' && <span style={{ fontFamily:mono, fontSize:12, color:DS.text3, letterSpacing:'0.1em' }}>••••••••</span>}
      </div>
      {note && <div style={{ fontFamily:sans, fontSize:13, color:DS.red, marginTop:6, fontWeight:500 }}>{note}</div>}
    </div>
  );
}

// shadcn Button default: h-9, bg-primary (white in dark), rounded-md
function PrimaryBtn({ label, full, small }) {
  return (
    <button style={{ background:DS.text1, color:'#0A0A0A',
      border:'none', borderRadius:6,
      height: small ? 32 : 36, padding: small ? '0 12px' : '0 16px',
      fontFamily:sans, fontSize: small ? 13 : 14, fontWeight:500,
      width: full ? '100%' : 'auto', letterSpacing:'-0.005em', cursor:'pointer',
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8 }}>
      {label}
    </button>
  );
}

// shadcn Button secondary: bg-secondary (zinc-800-ish), rounded-md
function GhostBtn({ label, full, small }) {
  return (
    <button style={{ background:DS.surface2, color:DS.text1,
      border:`1px solid ${DS.border}`, borderRadius:6,
      height: small ? 32 : 36, padding: small ? '0 12px' : '0 16px',
      fontFamily:sans, fontSize: small ? 13 : 14, fontWeight:500,
      width: full ? '100%' : 'auto', letterSpacing:'-0.005em', cursor:'pointer',
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8 }}>
      {label}
    </button>
  );
}

function TopBar({ title, back, right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'10px 18px 14px', borderBottom:`1px solid ${DS.divider}`, minHeight:46 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        {back && (
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" style={{cursor:'pointer'}}>
            <path d="M7.5 1L1.5 7L7.5 13" stroke={DS.text2} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span style={{ fontFamily:sans, fontSize:16, fontWeight:600, color:DS.text1, letterSpacing:'-0.02em' }}>{title}</span>
      </div>
      {right}
    </div>
  );
}

function IconBtn({ children, size=30 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:6,
      display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
      {children}
    </div>
  );
}

function BottomTabs({ active, adminView }) {
  const tabs = adminView
    ? ['Content','Categories','Tags','Media','Members','Keys']
    : ['Content','Categories','Tags','Media'];
  const icon = (name, c) => {
    const props = { width:18, height:18, viewBox:"0 0 18 18", fill:"none", stroke:c, strokeWidth:1.4, strokeLinecap:"round", strokeLinejoin:"round" };
    switch (name) {
      case 'Content': return <svg {...props}><path d="M3 4h12M3 9h12M3 14h8"/></svg>;
      case 'Categories': return <svg {...props}><rect x="2.5" y="2.5" width="5.5" height="5.5" rx="1"/><rect x="10" y="2.5" width="5.5" height="5.5" rx="1"/><rect x="2.5" y="10" width="5.5" height="5.5" rx="1"/><rect x="10" y="10" width="5.5" height="5.5" rx="1"/></svg>;
      case 'Tags': return <svg {...props}><path d="M9 2.5H3.5a1 1 0 0 0-1 1V9a1 1 0 0 0 .3.7l6 6a1 1 0 0 0 1.4 0l5.5-5.5a1 1 0 0 0 0-1.4l-6-6A1 1 0 0 0 9 2.5Z"/><circle cx="6" cy="6" r="0.8" fill={c} stroke="none"/></svg>;
      case 'Media': return <svg {...props}><rect x="2" y="3.5" width="14" height="11" rx="1.4"/><circle cx="6.5" cy="7.5" r="1.3"/><path d="M2.5 13l3.5-3 3 2.5 2.5-2 4 3.5"/></svg>;
      case 'Members': return <svg {...props}><circle cx="7" cy="6" r="2.5"/><path d="M2.5 14a4.5 4.5 0 0 1 9 0"/><circle cx="13" cy="6.5" r="1.8"/><path d="M11 14a3.5 3.5 0 0 1 5 0"/></svg>;
      case 'Keys': return <svg {...props}><circle cx="6" cy="9" r="3"/><path d="M9 9h7M13.5 9v2.5M16 9v2.5"/></svg>;
      default: return null;
    }
  };
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0,
      background:'rgba(9,9,11,0.85)', backdropFilter:'blur(12px)',
      borderTop:`1px solid ${DS.divider}`,
      padding:'9px 0 26px', display:'flex' }}>
      {tabs.map(t => {
        const isActive = active===t || (active==='API Keys' && t==='Keys');
        const c = isActive ? DS.text1 : DS.text4;
        return (
          <div key={t} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
            {icon(t, c)}
            <span style={{ fontFamily:sans, fontSize: 10, color:c, fontWeight: isActive ? 600 : 400, letterSpacing:'-0.01em' }}>{t}</span>
          </div>
        );
      })}
    </div>
  );
}

// shadcn-style floating action: white button, h-9, rounded-md, subtle shadow
function FAB({ label }) {
  return (
    <div style={{ position:'absolute', bottom:96, right:16,
      background:DS.text1, color:'#0A0A0A', border:'none', borderRadius:6,
      height:36, padding:'0 14px',
      display:'inline-flex', alignItems:'center', gap:7,
      fontFamily:sans, fontSize:13, fontWeight:500, letterSpacing:'-0.005em',
      boxShadow:`0 4px 16px rgba(0,0,0,0.5)` }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 1.5V10.5M1.5 6H10.5" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
      <span>{label}</span>
    </div>
  );
}

// shadcn Input pattern with search icon
function SearchBar({ placeholder }) {
  return (
    <div style={{ margin:'10px 16px 0', background:'transparent',
      border:`1px solid ${DS.border}`, borderRadius:6, height:36,
      padding:'0 12px', display:'flex', alignItems:'center', gap:10 }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke={DS.text3} strokeWidth="1.3"/>
        <path d="M9.5 9.5L12 12" stroke={DS.text3} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
      <span style={{ fontFamily:sans, fontSize:14, color:DS.text3, letterSpacing:'-0.005em' }}>{placeholder}</span>
    </div>
  );
}

// Section label — small, all caps
function SectionLabel({ children, padding='14px 20px 10px' }) {
  return (
    <div style={{ padding, fontFamily:sans, fontSize:11, fontWeight:500,
      color:DS.text3, letterSpacing:'0.04em', textTransform:'uppercase' }}>{children}</div>
  );
}

// Brand mark used in headers
function Brand({ size=24 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:6,
      background:`linear-gradient(135deg, ${DS.accent} 0%, ${DS.accentStrong} 100%)`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:sans, fontSize: size*0.5, fontWeight:700, color:'#fff', letterSpacing:'-0.04em' }}>g</div>
  );
}

// ── Screen 1 — Splash ────────────────────────────────────────────────────────
function S1_Splash() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, position:'relative', overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start',
        padding:'56px 32px 0', height:'calc(100% - 50px)', justifyContent:'space-between' }}>
        <div>
          <Brand size={36} />
          <div style={{ fontFamily:sans, fontSize:38, fontWeight:600, color:DS.text1,
            letterSpacing:'-0.04em', marginTop:140, lineHeight:1.05 }}>
            Your content,<br/>your control.
          </div>
          <div style={{ fontFamily:sans, fontSize:15, color:DS.text2, marginTop:18, lineHeight:1.5,
            letterSpacing:'-0.01em', maxWidth:280 }}>
            A headless CMS for teams that ship.
          </div>
        </div>
        <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:10, paddingBottom:56 }}>
          <PrimaryBtn label="Log in" full />
          <GhostBtn label="Create account" full />
          <div style={{ fontFamily:mono, fontSize:10, color:DS.text4, textAlign:'center', marginTop:6 }}>
            v0.1.0 · generic.io
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Screen 2 — Register ──────────────────────────────────────────────────────
function S2_Register() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <div style={{ padding:'24px 24px 0' }}>
        <Brand size={28} />
        <div style={{ fontFamily:sans, fontSize:24, fontWeight:600, color:DS.text1, marginTop:24, letterSpacing:'-0.03em' }}>Create your account</div>
        <div style={{ fontFamily:sans, fontSize:14, color:DS.text2, marginTop:6, marginBottom:28, letterSpacing:'-0.01em' }}>Free for personal projects.</div>
        <Input label="Email" placeholder="you@example.com" value="ada@example.com" />
        <Input label="Username" placeholder="username" value="ada_lovelace" />
        <Input label="Password" placeholder="••••••••" type="password" />
        <Input label="Confirm password" placeholder="••••••••" type="password"
          note="Passwords don't match." />
        <div style={{ marginTop:6, marginBottom:20 }}>
          <PrimaryBtn label="Create account" full />
        </div>
        <div style={{ textAlign:'center', fontFamily:sans, fontSize:13, color:DS.text2, letterSpacing:'-0.01em' }}>
          Already have an account?{' '}
          <span style={{ color:DS.text1, fontWeight:500, textDecoration:'underline', textUnderlineOffset:3 }}>Log in</span>
        </div>
      </div>
    </div>
  );
}

// ── Screen 3 — Login ─────────────────────────────────────────────────────────
function S3_Login() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <div style={{ padding:'24px 24px 0' }}>
        <Brand size={28} />
        <div style={{ fontFamily:sans, fontSize:24, fontWeight:600, color:DS.text1, marginTop:24, letterSpacing:'-0.03em' }}>Welcome back</div>
        <div style={{ fontFamily:sans, fontSize:14, color:DS.text2, marginTop:6, marginBottom:28, letterSpacing:'-0.01em' }}>Sign in to continue.</div>
        <Input label="Email" value="ada@example.com" placeholder="you@example.com" />
        <div style={{ marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
            <span style={{ fontFamily:sans, fontSize:12, color:DS.text2, fontWeight:500, letterSpacing:'-0.005em' }}>Password</span>
            <span style={{ fontFamily:sans, fontSize:12, color:DS.text2, textDecoration:'underline', textUnderlineOffset:3 }}>Forgot?</span>
          </div>
          <div style={{ background:DS.surface2, border:`1px solid ${DS.border2}`,
            borderRadius:6, padding:'11px 13px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:mono, fontSize:13, color:DS.text2, letterSpacing:'0.1em' }}>••••••••</span>
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
              <path d="M1 7s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" stroke={DS.text3} strokeWidth="1.3"/>
              <circle cx="8" cy="7" r="2" stroke={DS.text3} strokeWidth="1.3"/>
            </svg>
          </div>
        </div>
        <div style={{ marginTop:6, marginBottom:20 }}>
          <PrimaryBtn label="Log in" full />
        </div>
        <div style={{ textAlign:'center', fontFamily:sans, fontSize:13, color:DS.text2, letterSpacing:'-0.01em' }}>
          Don't have an account?{' '}
          <span style={{ color:DS.text1, fontWeight:500, textDecoration:'underline', textUnderlineOffset:3 }}>Sign up</span>
        </div>
      </div>
    </div>
  );
}

// ── Screen 4 — 2FA ───────────────────────────────────────────────────────────
function S4_TwoFA() {
  const digits = ['3','7','2','','',''];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <div style={{ padding:'24px 24px 0' }}>
        <Brand size={28} />
        <div style={{ fontFamily:sans, fontSize:24, fontWeight:600, color:DS.text1, marginTop:24, letterSpacing:'-0.03em' }}>Two-factor authentication</div>
        <div style={{ fontFamily:sans, fontSize:14, color:DS.text2, marginTop:6, marginBottom:36, letterSpacing:'-0.01em' }}>
          Enter the 6-digit code from your authenticator app.
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'space-between', marginBottom:32 }}>
          {digits.map((d, i) => (
            <div key={i} style={{ width:50, height:60, borderRadius:8,
              background:DS.surface2,
              border:`1px solid ${i===3 ? 'rgba(255,255,255,0.35)' : DS.border2}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:mono, fontSize:22, fontWeight:500,
              color: d ? DS.text1 : DS.text3 }}>
              {d || (i===3 ? <span style={{ width:1.5, height:24, background:DS.text1, animation:'none' }} /> : '')}
            </div>
          ))}
        </div>
        <PrimaryBtn label="Verify" full />
        <div style={{ textAlign:'center', marginTop:18, fontFamily:sans, fontSize:13, color:DS.text2, letterSpacing:'-0.01em' }}>
          <span style={{ color:DS.text1, textDecoration:'underline', textUnderlineOffset:3 }}>Back to log in</span>
        </div>
      </div>
    </div>
  );
}

// ── Screen 5 — My Organisations ──────────────────────────────────────────────
function S5_MyOrgs() {
  const orgs = [
    { name:'Acme Corp', role:'Admin', members:12, slug:'acme' },
    { name:'Personal Blog', role:'Editor', members:1, slug:'personal' },
    { name:'OpenDocs Project', role:'Viewer', members:34, slug:'opendocs' },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 18px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <Brand size={26} />
          <span style={{ fontFamily:sans, fontSize:16, fontWeight:600, color:DS.text1, letterSpacing:'-0.02em' }}>Generic</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <IconBtn>
            <div style={{ position:'relative' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2a5 5 0 0 0-5 5v2.5l-1.5 3h13L14 9.5V7a5 5 0 0 0-5-5ZM7 14.5a2 2 0 0 0 4 0" stroke={DS.text2} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ position:'absolute', top:-1, right:-1, width:7, height:7,
                borderRadius:'50%', background:DS.accent, border:`1.5px solid ${DS.bg}` }} />
            </div>
          </IconBtn>
          <div style={{ width:30, height:30, borderRadius:15, background:DS.surface2,
            border:`1px solid ${DS.border2}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:sans, fontSize:11, fontWeight:600, color:DS.text1, letterSpacing:'-0.02em' }}>
            AL
          </div>
        </div>
      </div>
      <div style={{ padding:'4px 22px 16px' }}>
        <div style={{ fontFamily:sans, fontSize:26, fontWeight:600, color:DS.text1, letterSpacing:'-0.03em' }}>Organisations</div>
        <div style={{ fontFamily:sans, fontSize:13, color:DS.text2, marginTop:4, letterSpacing:'-0.01em' }}>3 orgs · 47 members total</div>
      </div>
      {/* Org list — single bordered container with row dividers */}
      <div style={{ margin:'0 16px', background:DS.surface,
        border:`1px solid ${DS.border}`, borderRadius:8, overflow:'hidden' }}>
        {orgs.map((o, i) => (
          <div key={i} style={{ padding:'14px 16px',
            borderBottom: i < orgs.length-1 ? `1px solid ${DS.divider}` : 'none',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:13, flex:1 }}>
              <div style={{ width:36, height:36, borderRadius:8,
                background:DS.surface2, border:`1px solid ${DS.border}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:sans, fontSize:13, fontWeight:600, color:DS.text2, letterSpacing:'-0.02em' }}>
                {o.name.slice(0,1)}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:sans, fontSize:14, fontWeight:500, color:DS.text1, marginBottom:3, letterSpacing:'-0.01em' }}>{o.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <RoleTag role={o.role} />
                  <span style={{ fontFamily:sans, fontSize:11, color:DS.text3 }}>{o.members} {o.members===1 ? 'member' : 'members'}</span>
                </div>
              </div>
            </div>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
              <path d="M1 1l4 4-4 4" stroke={DS.text4} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
        ))}
      </div>
      {/* Recent activity */}
      <SectionLabel padding="28px 20px 10px">Recent activity</SectionLabel>
      <div style={{ margin:'0 16px' }}>
        {[
          { msg:'You published "Getting Started Guide"', time:'2m', org:'Acme' },
          { msg:'charles_t commented on Q4 Roadmap', time:'1h', org:'Acme' },
        ].map((a, i) => (
          <div key={i} style={{ padding:'10px 4px',
            borderBottom: i===0 ? `1px solid ${DS.divider}` : 'none',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontFamily:sans, fontSize:13, color:DS.text2, letterSpacing:'-0.01em' }}>{a.msg}</span>
            <span style={{ fontFamily:mono, fontSize:11, color:DS.text4 }}>{a.time}</span>
          </div>
        ))}
      </div>
      <FAB label="New org" />
    </div>
  );
}

// ── Screen 6 — Create Org ────────────────────────────────────────────────────
function S6_CreateOrg() {
  return (
    <div style={{ width:390, height:844, background:'rgba(0,0,0,0.5)', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:DS.surface, borderRadius:'16px 16px 0 0',
        border:`1px solid ${DS.border2}`, borderBottom:'none',
        padding:'12px 24px 36px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:DS.border2, margin:'0 auto 22px' }} />
        <div style={{ fontFamily:sans, fontSize:20, fontWeight:600, color:DS.text1, letterSpacing:'-0.03em' }}>New organisation</div>
        <div style={{ fontFamily:sans, fontSize:13, color:DS.text2, marginTop:5, marginBottom:24, letterSpacing:'-0.01em' }}>
          You'll be assigned as Admin automatically.
        </div>
        <Input label="Organisation name" placeholder="e.g. My Project" value="" />
        <Input label="URL slug" placeholder="my-project" value="" />
        <div style={{ marginTop:8, display:'flex', gap:10 }}>
          <div style={{ flex:1 }}><GhostBtn label="Cancel" full /></div>
          <div style={{ flex:1 }}><PrimaryBtn label="Create" full /></div>
        </div>
      </div>
    </div>
  );
}

// ── Screen 7 — Org Dashboard ─────────────────────────────────────────────────
function S7_OrgDashboard() {
  const stats = [
    { label:'Entries', value:'124', delta:'+8' },
    { label:'Published', value:'89', color:DS.green },
    { label:'Drafts', value:'22', color:DS.amber },
    { label:'Members', value:'12' },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 18px 14px', borderBottom:`1px solid ${DS.divider}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M7.5 1L1.5 7L7.5 13" stroke={DS.text2} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ width:26, height:26, borderRadius:6,
            background:DS.surface2, border:`1px solid ${DS.border}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:sans, fontSize:11, fontWeight:600, color:DS.text2 }}>A</div>
          <span style={{ fontFamily:sans, fontSize:15, fontWeight:600, color:DS.text1, letterSpacing:'-0.02em' }}>Acme Corp</span>
        </div>
        <IconBtn>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="2" stroke={DS.text2} strokeWidth="1.4"/>
            <path d="M9 1.5v2.2M9 14.3v2.2M2.5 9H4.7M13.3 9h2.2M4.4 4.4l1.6 1.6M12 12l1.6 1.6M4.4 13.6L6 12M12 6l1.6-1.6" stroke={DS.text2} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </IconBtn>
      </div>
      <div style={{ padding:'18px 22px 8px' }}>
        <div style={{ fontFamily:sans, fontSize:13, color:DS.text3, marginBottom:4, letterSpacing:'-0.005em' }}>Welcome back, Ada</div>
        <div style={{ fontFamily:sans, fontSize:22, fontWeight:600, color:DS.text1, letterSpacing:'-0.03em' }}>Here's what's new.</div>
      </div>
      {/* Stats grid */}
      <div style={{ margin:'12px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:1,
        background:DS.border, borderRadius:8, overflow:'hidden', border:`1px solid ${DS.border}` }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background:DS.surface, padding:'14px 16px' }}>
            <div style={{ fontFamily:sans, fontSize:11, color:DS.text3, marginBottom:6, letterSpacing:'-0.005em' }}>{s.label}</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
              <span style={{ fontFamily:sans, fontSize:22, fontWeight:600,
                color: s.color || DS.text1, letterSpacing:'-0.03em' }}>{s.value}</span>
              {s.delta && <span style={{ fontFamily:mono, fontSize:11, color:DS.green }}>{s.delta}</span>}
            </div>
          </div>
        ))}
      </div>
      {/* Recent content */}
      <SectionLabel padding="22px 20px 10px">Recent content</SectionLabel>
      <div style={{ margin:'0 16px', background:DS.surface,
        border:`1px solid ${DS.border}`, borderRadius:8, overflow:'hidden' }}>
        {[
          { title:'Getting Started Guide', status:'Published', cat:'Docs', time:'2m' },
          { title:'Q4 Roadmap', status:'Draft', cat:'Planning', time:'3h' },
          { title:'API Reference v2', status:'Published', cat:'Docs', time:'1d' },
        ].map((item, i, a) => (
          <div key={i} style={{ padding:'12px 14px',
            borderBottom: i < a.length-1 ? `1px solid ${DS.divider}` : 'none' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
              <span style={{ fontFamily:sans, fontSize:13, fontWeight:500, color:DS.text1, letterSpacing:'-0.01em' }}>{item.title}</span>
              <span style={{ fontFamily:mono, fontSize:11, color:DS.text4 }}>{item.time}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <StatusPill label={item.status} color={item.status==='Published' ? DS.green : DS.amber} />
              <span style={{ fontFamily:sans, fontSize:11, color:DS.text3 }}>{item.cat}</span>
            </div>
          </div>
        ))}
      </div>
      <BottomTabs active="Content" adminView />
    </div>
  );
}

// ── Screen 8 — Content List ──────────────────────────────────────────────────
function S8_ContentList() {
  const items = [
    { title:'Getting Started Guide', status:'Published', cat:'Documentation', tags:['api','v2','guide'], date:'Apr 20' },
    { title:'Q4 Roadmap', status:'Draft', cat:'Planning', tags:['internal'], date:'Apr 18' },
    { title:'Untitled', status:'New', cat:null, tags:[], date:'Apr 17' },
    { title:'API Reference v2', status:'Unpublished', cat:'Documentation', tags:['api','deprecated'], date:'Apr 10' },
    { title:'Onboarding Checklist', status:'Published', cat:'Tutorials', tags:['guide'], date:'Apr 8' },
  ];
  const statusColor = { Published:DS.green, Draft:DS.amber, New:DS.text3, Unpublished:DS.orange };
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <TopBar title="Content" right={
        <IconBtn>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke={DS.text2} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </IconBtn>
      } />
      <SearchBar placeholder="Search 124 entries…" />
      {/* Filter chips */}
      <div style={{ display:'flex', gap:6, padding:'10px 16px', overflow:'hidden' }}>
        {['All','New','Draft','Published','Unpublished'].map((f, i) => (
          <div key={f} style={{ padding:'5px 11px', borderRadius:5,
            background: i===0 ? DS.surface3 : 'transparent',
            border:`1px solid ${i===0 ? DS.border2 : DS.border}`,
            fontFamily:sans, fontSize:12, color: i===0 ? DS.text1 : DS.text3,
            fontWeight: i===0 ? 500 : 400, letterSpacing:'-0.01em',
            whiteSpace:'nowrap', flexShrink:0 }}>{f}</div>
        ))}
      </div>
      {/* Entries list */}
      <div style={{ margin:'4px 16px 0', background:DS.surface,
        border:`1px solid ${DS.border}`, borderRadius:8, overflow:'hidden' }}>
        {items.map((item, i, a) => (
          <div key={i} style={{ padding:'13px 14px',
            borderBottom: i < a.length-1 ? `1px solid ${DS.divider}` : 'none' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontFamily:sans, fontSize:14, fontWeight:500,
                color: item.title==='Untitled' ? DS.text3 : DS.text1, letterSpacing:'-0.01em' }}>
                {item.title}
              </span>
              <span style={{ fontFamily:mono, fontSize:11, color:DS.text4 }}>{item.date}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <StatusPill label={item.status} color={statusColor[item.status]} />
              {item.cat && <>
                <span style={{ width:2, height:2, borderRadius:1, background:DS.text4 }} />
                <span style={{ fontFamily:sans, fontSize:11, color:DS.text3 }}>{item.cat}</span>
              </>}
              {item.tags.length > 0 && <>
                <span style={{ width:2, height:2, borderRadius:1, background:DS.text4 }} />
                <span style={{ fontFamily:mono, fontSize:11, color:DS.text3 }}>
                  {item.tags.slice(0,2).join(', ')}{item.tags.length > 2 ? ` +${item.tags.length-2}` : ''}
                </span>
              </>}
            </div>
          </div>
        ))}
      </div>
      <FAB label="New entry" />
      <BottomTabs active="Content" adminView />
    </div>
  );
}

// ── Screen 9 — Content Editor ────────────────────────────────────────────────
function S9_ContentEditor() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 18px 12px', borderBottom:`1px solid ${DS.divider}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M7.5 1L1.5 7L7.5 13" stroke={DS.text2} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontFamily:sans, fontSize:14, fontWeight:600, color:DS.text1, letterSpacing:'-0.02em' }}>Edit entry</div>
            <div style={{ fontFamily:mono, fontSize:10, color:DS.text4, marginTop:1 }}>ent_a1b2c3d4</div>
          </div>
        </div>
        <StatusPill label="Draft" color={DS.amber} />
      </div>
      <div style={{ padding:'18px 20px' }}>
        <div style={{ marginBottom:18 }}>
          <input style={{ background:'transparent', border:'none', outline:'none', width:'100%',
            fontFamily:sans, fontSize:22, fontWeight:600, color:DS.text1, letterSpacing:'-0.03em',
            padding:0 }} defaultValue="Getting Started Guide" />
          <div style={{ height:1, background:DS.divider, marginTop:14 }} />
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', gap:14, marginBottom:10, color:DS.text3 }}>
            {['B','I','U'].map(t => (
              <span key={t} style={{ fontFamily:sans, fontSize:13, fontWeight: t==='B' ? 700 : t==='I' ? 400 : 500,
                fontStyle: t==='I' ? 'italic' : 'normal',
                textDecoration: t==='U' ? 'underline' : 'none', cursor:'pointer' }}>{t}</span>
            ))}
            <span style={{ width:1, background:DS.divider }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3h8M3 7h8M3 11h5" stroke={DS.text3} strokeWidth="1.4" strokeLinecap="round"/></svg>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l-3 4 3 4M9 3l3 4-3 4" stroke={DS.text3} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 8.5L8.5 5.5M4.5 9.5a2 2 0 0 0 2.8 2.8l2-2M9.5 4.5a2 2 0 0 0-2.8-2.8l-2 2" stroke={DS.text3} strokeWidth="1.3" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontFamily:sans, fontSize:14, color:DS.text2, lineHeight:1.7, letterSpacing:'-0.01em' }}>
            This guide covers the basics of setting up your first organisation and creating content entries. We'll walk through authentication, org setup, and your first published entry…
          </div>
        </div>
        {/* Properties — borderless rows */}
        <div style={{ marginBottom:18 }}>
          <SectionLabel padding="0 0 10px">Properties</SectionLabel>
          {[
            { label:'Category', value:'Documentation' },
            { label:'Status', value:<StatusPill label="Draft" color={DS.amber} /> },
            { label:'Author', value:'ada_lovelace' },
            { label:'Updated', value:'Apr 20, 9:41 AM' },
          ].map((row, i, a) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'10px 0', borderBottom: i < a.length-1 ? `1px solid ${DS.divider}` : 'none' }}>
              <span style={{ fontFamily:sans, fontSize:13, color:DS.text3, letterSpacing:'-0.01em' }}>{row.label}</span>
              <span style={{ fontFamily:sans, fontSize:13, color:DS.text1, letterSpacing:'-0.01em' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <SectionLabel padding="0 0 10px">Tags</SectionLabel>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
          {['api','v2','guide'].map(t => (
            <span key={t} style={{ fontFamily:sans, fontSize:12, color:DS.text1,
              background:DS.surface2, border:`1px solid ${DS.border2}`,
              padding:'4px 9px', borderRadius:5, display:'flex', alignItems:'center', gap:6, letterSpacing:'-0.01em' }}>
              {t}
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke={DS.text3} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </span>
          ))}
          <span style={{ fontFamily:sans, fontSize:12, color:DS.text3,
            border:`1px dashed ${DS.border2}`,
            padding:'4px 9px', borderRadius:5, letterSpacing:'-0.01em' }}>+ Add</span>
        </div>
        {/* Asset */}
        <SectionLabel padding="0 0 10px">Asset</SectionLabel>
        <div style={{ background:DS.surface, border:`1px solid ${DS.border}`, borderRadius:8,
          padding:'12px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:44, height:36, borderRadius:5, background:`repeating-linear-gradient(45deg, ${DS.surface2}, ${DS.surface2} 4px, ${DS.surface3} 4px, ${DS.surface3} 8px)` }} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:sans, fontSize:12, fontWeight:500, color:DS.text1, letterSpacing:'-0.01em' }}>hero-banner.png</div>
            <div style={{ fontFamily:mono, fontSize:10, color:DS.text4, marginTop:2 }}>cdn.generic.io/a/abc123 · 248 KB</div>
          </div>
          <span style={{ fontFamily:sans, fontSize:12, color:DS.text2 }}>Replace</span>
        </div>
      </div>
      {/* Bottom action bar */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:'rgba(9,9,11,0.85)', backdropFilter:'blur(12px)',
        borderTop:`1px solid ${DS.divider}`, padding:'12px 16px 28px',
        display:'flex', gap:8 }}>
        <div style={{ flex:1 }}><GhostBtn label="Save draft" full /></div>
        <div style={{ flex:1 }}><PrimaryBtn label="Publish" full /></div>
      </div>
    </div>
  );
}

// ── Screen 10 — Content Detail (read-only) ───────────────────────────────────
function S10_ContentDetail() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <TopBar title="" back right={
        <span style={{ fontFamily:sans, fontSize:13, color:DS.text1, fontWeight:500, letterSpacing:'-0.01em' }}>Edit</span>
      } />
      <div style={{ padding:'12px 22px 22px' }}>
        {/* Asset banner */}
        <div style={{ height:140, background:`repeating-linear-gradient(45deg, ${DS.surface}, ${DS.surface} 6px, ${DS.surface2} 6px, ${DS.surface2} 12px)`,
          border:`1px solid ${DS.border}`, borderRadius:8, marginBottom:18,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:mono, fontSize:11, color:DS.text3, background:DS.bg, padding:'3px 8px', borderRadius:4 }}>hero-banner.png</span>
        </div>
        <StatusPill label="Published" color={DS.green} />
        <div style={{ fontFamily:sans, fontSize:24, fontWeight:600, color:DS.text1, marginTop:10, letterSpacing:'-0.03em', lineHeight:1.2 }}>
          Getting Started Guide
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8, marginBottom:18 }}>
          <span style={{ fontFamily:sans, fontSize:12, color:DS.text3 }}>Documentation</span>
          <span style={{ width:2, height:2, borderRadius:1, background:DS.text4 }} />
          <span style={{ fontFamily:sans, fontSize:12, color:DS.text3 }}>by ada_lovelace</span>
          <span style={{ width:2, height:2, borderRadius:1, background:DS.text4 }} />
          <span style={{ fontFamily:mono, fontSize:11, color:DS.text4 }}>Apr 20</span>
        </div>
        <div style={{ fontFamily:sans, fontSize:14, color:DS.text2, lineHeight:1.7, letterSpacing:'-0.01em' }}>
          This guide covers the basics of setting up your first organisation and creating content entries in Generic. We'll walk through authentication, org setup, and your first published entry.
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:16 }}>
          {['api','v2','guide'].map(t => (
            <span key={t} style={{ fontFamily:sans, fontSize:11, color:DS.text2,
              background:DS.surface2, border:`1px solid ${DS.border}`,
              padding:'3px 8px', borderRadius:5, letterSpacing:'-0.01em' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  S1_Splash, S2_Register, S3_Login, S4_TwoFA,
  S5_MyOrgs, S6_CreateOrg, S7_OrgDashboard,
  S8_ContentList, S9_ContentEditor, S10_ContentDetail,
  DS, mono, sans, StatusBar, Badge, StatusPill, RoleTag, Dot,
  Input, PrimaryBtn, GhostBtn,
  TopBar, BottomTabs, FAB, SearchBar, IconBtn, SectionLabel, Brand
});
