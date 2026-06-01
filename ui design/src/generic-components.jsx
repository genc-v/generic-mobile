// Component library reference — shadcn-style primitives used across the app.
// Drop this section at the start of the canvas so devs can lift exact specs.

const compMono = "'Geist Mono', ui-monospace, monospace";
const compSans = "'Geist', -apple-system, sans-serif";

// Local palette (mirrors DS in screens-1 — keep in sync)
const C = {
  bg: '#09090B',
  card: '#09090B',
  surface2: '#18181B',
  surface3: '#27272A',
  border: '#27272A',
  text1: '#FAFAFA',
  text2: '#A1A1AA',
  text3: '#71717A',
  text4: '#52525B',
  green: '#22C55E', amber: '#EAB308', orange: '#F97316', red: '#EF4444', grey: '#71717A',
  accent: '#A78BFA',
};

// ── Frame for component sheets ───────────────────────────────────────────────
function CompSheet({ title, name, children }) {
  return (
    <div style={{
      width: 480, height: 'auto', minHeight: 200,
      background: C.bg, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: '24px 24px 26px',
      fontFamily: compSans, color: C.text1,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', whiteSpace: 'nowrap' }}>{title}</span>
        <span style={{ fontFamily: compMono, fontSize: 11, color: C.text3, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{name}</span>
      </div>
      <div style={{ fontSize: 13, color: C.text2, marginBottom: 20, letterSpacing: '-0.005em' }}>
        Drop-in component used across the app
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {children}
      </div>
    </div>
  );
}

function CompRow({ caption, code, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: compMono, fontSize: 11, color: C.text3, letterSpacing: '0.02em' }}>{caption}</span>
        {code && <span style={{ fontFamily: compMono, fontSize: 10, color: C.text4 }}>{code}</span>}
      </div>
      <div style={{ background: '#0C0C0E', border: `1px dashed ${C.border}`, borderRadius: 8, padding: 16 }}>
        {children}
      </div>
    </div>
  );
}

// ── 1. BUTTONS ──────────────────────────────────────────────────────────────
function CompButtons() {
  const primary = (label, small) => (
    <button style={{ background: C.text1, color: '#0A0A0A', border: 'none', borderRadius: 6,
      height: small ? 32 : 36, padding: small ? '0 12px' : '0 16px',
      fontFamily: compSans, fontSize: small ? 13 : 14, fontWeight: 500,
      letterSpacing: '-0.005em', cursor: 'pointer' }}>{label}</button>
  );
  const secondary = (label, small) => (
    <button style={{ background: C.surface2, color: C.text1, border: `1px solid ${C.border}`, borderRadius: 6,
      height: small ? 32 : 36, padding: small ? '0 12px' : '0 16px',
      fontFamily: compSans, fontSize: small ? 13 : 14, fontWeight: 500, cursor: 'pointer' }}>{label}</button>
  );
  const ghost = (label) => (
    <button style={{ background: 'transparent', color: C.text1, border: 'none', borderRadius: 6,
      height: 36, padding: '0 12px', fontFamily: compSans, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{label}</button>
  );
  const destructive = (label) => (
    <button style={{ background: 'transparent', color: C.red, border: `1px solid ${C.red}55`, borderRadius: 6,
      height: 36, padding: '0 16px', fontFamily: compSans, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{label}</button>
  );
  const iconBtn = () => (
    <button style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
      width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1.5V12.5M1.5 7H12.5" stroke={C.text1} strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </button>
  );
  return (
    <CompSheet title="Buttons" name="<Button />">
      <CompRow caption="DEFAULT (PRIMARY)" code="variant='default'">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {primary('Save changes')}
          {primary('Save', true)}
        </div>
      </CompRow>
      <CompRow caption="SECONDARY" code="variant='secondary'">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {secondary('Cancel')}
          {secondary('Cancel', true)}
        </div>
      </CompRow>
      <CompRow caption="GHOST · DESTRUCTIVE · ICON" code="variant='ghost' | 'destructive' | size='icon'">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {ghost('Skip')}
          {destructive('Delete')}
          {iconBtn()}
        </div>
      </CompRow>
    </CompSheet>
  );
}

// ── 2. INPUTS & FORMS ───────────────────────────────────────────────────────
function CompInputs() {
  const field = (label, value, ph, type, error) => (
    <div>
      <div style={{ fontSize: 13, color: C.text1, marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ background: 'transparent', border: `1px solid ${error ? C.red : C.border}`,
        borderRadius: 6, padding: '0 12px', height: 36,
        fontSize: 14, color: value ? C.text1 : C.text3,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{value || ph}</span>
        {type === 'password' && <span style={{ fontFamily: compMono, fontSize: 12, color: C.text3, letterSpacing: '0.1em' }}>••••••••</span>}
      </div>
      {error && <div style={{ fontSize: 13, color: C.red, marginTop: 6 }}>{error}</div>}
    </div>
  );
  const textarea = (label, value) => (
    <div>
      <div style={{ fontSize: 13, color: C.text1, marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 12px',
        fontSize: 14, color: C.text1, minHeight: 70, lineHeight: 1.55 }}>{value}</div>
    </div>
  );
  const search = () => (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, height: 36,
      padding: '0 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke={C.text3} strokeWidth="1.3"/>
        <path d="M9.5 9.5L12 12" stroke={C.text3} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
      <span style={{ fontSize: 14, color: C.text3 }}>Search…</span>
    </div>
  );
  return (
    <CompSheet title="Inputs & Forms" name="<Input /> <Textarea /> <Search />">
      <CompRow caption="INPUT — DEFAULT / FILLED" code="<Input />">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('Email', '', 'name@company.com')}
          {field('Email', 'jake@acme.co', '')}
        </div>
      </CompRow>
      <CompRow caption="INPUT — PASSWORD / ERROR" code="type='password' | aria-invalid">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {field('Password', 'value', '', 'password')}
          {field('Slug', 'invalid slug', '', null, 'Must be lowercase, no spaces')}
        </div>
      </CompRow>
      <CompRow caption="TEXTAREA" code="<Textarea />">
        {textarea('Description', 'Product documentation and how-to articles for the team.')}
      </CompRow>
      <CompRow caption="SEARCH" code="<Input.Search />">
        {search()}
      </CompRow>
    </CompSheet>
  );
}

// ── 3. BADGES & PILLS ───────────────────────────────────────────────────────
function CompBadges() {
  const Dot = ({ c }) => <span style={{ width: 6, height: 6, borderRadius: 3, background: c, display: 'inline-block' }} />;
  const badge = (label, color) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '2px 8px', borderRadius: 6,
      background: C.surface2, border: `1px solid ${C.border}`,
      fontSize: 11, fontWeight: 600, color: C.text1, letterSpacing: '-0.005em' }}>
      <Dot c={color} />{label}
    </span>
  );
  const tagChip = (label, x) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 4px 4px 10px', borderRadius: 6,
      background: C.surface2, border: `1px solid ${C.border}`,
      fontFamily: compMono, fontSize: 11, color: C.text2 }}>
      {label}
      {x && <span style={{ width: 16, height: 16, borderRadius: 3, background: C.surface3,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: C.text3 }}>×</span>}
    </span>
  );
  return (
    <CompSheet title="Badges & Tags" name="<Badge /> <Tag />">
      <CompRow caption="STATUS — published / draft / archived / scheduled / pending" code="<Badge variant='status' />">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {badge('Published', C.green)}
          {badge('Draft', C.grey)}
          {badge('Archived', C.text4)}
          {badge('Scheduled', C.amber)}
          {badge('Pending', C.orange)}
          {badge('Error', C.red)}
        </div>
      </CompRow>
      <CompRow caption="ROLE TAG — admin / editor / viewer" code="<Badge role='admin' />">
        <div style={{ display: 'flex', gap: 8 }}>
          {badge('Admin', C.accent)}
          {badge('Editor', C.green)}
          {badge('Viewer', C.text3)}
        </div>
      </CompRow>
      <CompRow caption="TAG CHIP — removable" code="<Tag onRemove={…} />">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tagChip('api', true)}
          {tagChip('v2', true)}
          {tagChip('guide', true)}
          {tagChip('+ add tag', false)}
        </div>
      </CompRow>
    </CompSheet>
  );
}

// ── 4. CARDS / LIST ROWS ────────────────────────────────────────────────────
function CompCards() {
  const Dot = ({ c }) => <span style={{ width: 6, height: 6, borderRadius: 3, background: c, display: 'inline-block' }} />;
  const listRow = (title, sub, status, color, last) => (
    <div style={{ padding: '14px 16px', borderBottom: last ? 'none' : `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: C.text1 }}>{title}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: C.text1,
          padding: '2px 8px', borderRadius: 6, background: C.surface2, border: `1px solid ${C.border}` }}>
          <Dot c={color} />{status}
        </span>
      </div>
      <div style={{ fontSize: 13, color: C.text2 }}>{sub}</div>
    </div>
  );
  return (
    <CompSheet title="Cards & List Rows" name="<Card /> <List.Row />">
      <CompRow caption="LIST CONTAINER — bordered card with row dividers" code="<Card><List>…</List></Card>">
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          {listRow('Getting Started Guide', 'Documentation · Updated 2m ago', 'Published', C.green, false)}
          {listRow('Pricing Page Copy', 'Marketing · Draft', 'Draft', C.grey, false)}
          {listRow('Q3 Newsletter', 'Email · Scheduled Jun 1', 'Scheduled', C.amber, true)}
        </div>
      </CompRow>
      <CompRow caption="STAT CARD — dashboard metric" code="<Card.Stat />">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: C.border,
          border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          {[
            { l: 'Entries', v: '124', d: '+8' },
            { l: 'Categories', v: '12', d: '+2' },
          ].map((s, i) => (
            <div key={i} style={{ background: C.bg, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{s.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 600, color: C.text1, letterSpacing: '-0.025em' }}>{s.v}</span>
                <span style={{ fontFamily: compMono, fontSize: 12, color: C.green }}>{s.d}</span>
              </div>
            </div>
          ))}
        </div>
      </CompRow>
    </CompSheet>
  );
}

// ── 5. NAVIGATION (TopBar, Tabs, BottomTabs) ────────────────────────────────
function CompNav() {
  const Dot = ({ c }) => <span style={{ width: 6, height: 6, borderRadius: 3, background: c, display: 'inline-block' }} />;
  const tabs = ['Content', 'Categories', 'Tags', 'Media'];
  return (
    <CompSheet title="Navigation" name="<TopBar /> <Tabs /> <BottomTabs />">
      <CompRow caption="TOP BAR — title + back + right action" code="<TopBar />">
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <div style={{ height: 52, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke={C.text1} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', color: C.text1 }}>Content</span>
            </div>
            <button style={{ background: C.text1, color: '#0A0A0A', border: 'none', borderRadius: 6,
              height: 30, padding: '0 12px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>+ New</button>
          </div>
        </div>
      </CompRow>
      <CompRow caption="SEGMENT TABS — underline" code="<Tabs />">
        <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
          {['All', 'Published', 'Drafts', 'Archived'].map((t, i) => (
            <div key={t} style={{ paddingBottom: 12,
              borderBottom: i === 0 ? `2px solid ${C.text1}` : '2px solid transparent',
              fontSize: 13, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? C.text1 : C.text3,
              marginBottom: -1 }}>{t}</div>
          ))}
        </div>
      </CompRow>
      <CompRow caption="BOTTOM TABS — primary mobile nav" code="<BottomTabs />">
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '10px 0', display: 'flex' }}>
          {tabs.map((t, i) => {
            const active = i === 0;
            const c = active ? C.text1 : C.text4;
            return (
              <div key={t} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 4h12M3 9h12M3 14h8"/>
                </svg>
                <span style={{ fontSize: 10, color: c, fontWeight: active ? 600 : 400 }}>{t}</span>
              </div>
            );
          })}
        </div>
      </CompRow>
    </CompSheet>
  );
}

// ── 6. AVATAR / TOGGLE / DOT / DIVIDER ──────────────────────────────────────
function CompMisc() {
  const avatar = (initials, size, role) => {
    const colorMap = { Admin: C.accent, Editor: C.green, Viewer: C.text3 };
    const ring = role ? colorMap[role] : C.border;
    return (
      <div style={{ width: size, height: size, borderRadius: size / 2,
        background: C.surface2, border: `1px solid ${ring}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: compMono, fontSize: size > 40 ? 14 : 11, fontWeight: 600, color: C.text1 }}>
        {initials}
      </div>
    );
  };
  const toggle = (on) => (
    <div style={{ width: 38, height: 22, borderRadius: 11,
      background: on ? C.text1 : C.surface3, position: 'relative',
      border: `1px solid ${on ? C.text1 : C.border}` }}>
      <div style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: 8,
        background: on ? '#0A0A0A' : '#FAFAFA', left: on ? 18 : 2 }} />
    </div>
  );
  return (
    <CompSheet title="Avatar · Toggle · Misc" name="<Avatar /> <Switch />">
      <CompRow caption="AVATAR — sizes 28 / 36 / 44, with role ring" code="<Avatar />">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {avatar('JD', 28)}
          {avatar('JD', 36)}
          {avatar('AT', 44, 'Admin')}
          {avatar('NK', 44, 'Editor')}
          {avatar('VW', 44, 'Viewer')}
        </div>
      </CompRow>
      <CompRow caption="SWITCH — on / off" code="<Switch />">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {toggle(true)}
          {toggle(false)}
        </div>
      </CompRow>
      <CompRow caption="SECTION LABEL — uppercase eyebrow" code="<Label.Eyebrow />">
        <div style={{ fontSize: 11, fontWeight: 500, color: C.text3, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Recent activity
        </div>
      </CompRow>
      <CompRow caption="DIVIDER" code="<Separator />">
        <div style={{ height: 1, background: C.border }} />
      </CompRow>
    </CompSheet>
  );
}

// ── 7. COLOR + TYPE TOKENS ──────────────────────────────────────────────────
function CompTokens() {
  const swatch = (name, hex, sub) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 6, background: hex, border: `1px solid ${C.border}` }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text1 }}>{name}</div>
        <div style={{ fontFamily: compMono, fontSize: 11, color: C.text3 }}>{hex}{sub ? ` · ${sub}` : ''}</div>
      </div>
    </div>
  );
  return (
    <CompSheet title="Color & Type Tokens" name="theme.ts">
      <CompRow caption="NEUTRAL — bg / surface / border / text" code="zinc-950 → zinc-50">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {swatch('background', '#09090B', 'zinc-950')}
          {swatch('surface (input)', '#18181B', 'zinc-900')}
          {swatch('accent', '#27272A', 'zinc-800')}
          {swatch('border', '#27272A', 'zinc-800')}
          {swatch('foreground', '#FAFAFA', 'zinc-50')}
          {swatch('muted', '#A1A1AA', 'zinc-400')}
        </div>
      </CompRow>
      <CompRow caption="STATUS / ACCENT" code="—">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {swatch('accent (admin)', C.accent, 'violet-400')}
          {swatch('success', C.green, 'green-500')}
          {swatch('warning', C.amber, 'yellow-500')}
          {swatch('pending', C.orange, 'orange-500')}
          {swatch('destructive', C.red, 'red-500')}
          {swatch('muted-status', C.grey, 'zinc-500')}
        </div>
      </CompRow>
      <CompRow caption="TYPE — Geist + Geist Mono" code="font-sans / font-mono">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontFamily: compMono, fontSize: 10, color: C.text3, marginBottom: 4 }}>SANS · GEIST</div>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.025em', color: C.text1 }}>Generic CMS</div>
            <div style={{ fontSize: 14, color: C.text2, letterSpacing: '-0.005em' }}>The quick brown fox jumps over the lazy dog</div>
          </div>
          <div>
            <div style={{ fontFamily: compMono, fontSize: 10, color: C.text3, marginBottom: 4 }}>MONO · GEIST MONO</div>
            <div style={{ fontFamily: compMono, fontSize: 13, color: C.text1 }}>const apiKey = "sk_live_8f2…"</div>
          </div>
        </div>
      </CompRow>
    </CompSheet>
  );
}

// Export to global scope so Generic.html can mount each CompSheet in an artboard
Object.assign(window, {
  CompButtons, CompInputs, CompBadges, CompCards, CompNav, CompMisc, CompTokens,
});
