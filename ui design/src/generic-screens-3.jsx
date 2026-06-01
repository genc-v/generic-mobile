
// Screens 23–34: Profile, Security, Admin Panel, Public
// Depends on globals from generic-screens-1.jsx

// ── Screen 23 — Profile ───────────────────────────────────────────────────────
function S23_Profile() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <TopBar title="Profile" back />
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'24px 24px 0' }}>
        <div style={{ position:'relative', marginBottom:16 }}>
          <div style={{ width:80, height:80, borderRadius:40,
            background:DS.accentDim, border:`2px solid ${DS.accentBorder}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:mono, fontSize:26, fontWeight:700, color:DS.accent }}>AL</div>
          <div style={{ position:'absolute', bottom:0, right:0, width:24, height:24,
            borderRadius:8, background:DS.accent,
            display:'flex', alignItems:'center', justifyContent:'center',
            border:`2px solid ${DS.bg}` }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M7 1.5L8.5 3 3.5 8H2V6.5L7 1.5Z" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div style={{ fontFamily:mono, fontSize:16, fontWeight:700, color:DS.text1, marginBottom:4 }}>ada_lovelace</div>
        <div style={{ fontFamily:sans, fontSize:13, color:DS.text2, marginBottom:6 }}>ada@example.com</div>
        <div style={{ fontFamily:sans, fontSize:13, color:DS.text2, textAlign:'center',
          maxWidth:260, lineHeight:1.5, marginBottom:24 }}>
          Building the future of knowledge management. Math enthusiast.
        </div>
      </div>
      {/* Links */}
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:8 }}>
        {[
          { label:'Account Settings', icon:'⚙', accent:false },
          { label:'Security & 2FA', icon:'🔐', accent:false },
        ].map((item, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'16px',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:DS.surface2,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{item.icon}</div>
              <span style={{ fontFamily:sans, fontSize:14, fontWeight:500, color:DS.text1 }}>{item.label}</span>
            </div>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
              <path d="M1 1l4 4-4 4" stroke={DS.text3} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
        ))}
        <div style={{ background:DS.redDim, border:`1px solid ${DS.red}22`,
          borderRadius:8, padding:'16px',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:`${DS.red}18`,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M5 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M3 4l.7 7.5a.5.5 0 0 0 .5.5h5.6a.5.5 0 0 0 .5-.5L11 4" stroke={DS.red} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontFamily:sans, fontSize:14, fontWeight:500, color:DS.red }}>Log Out</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Screen 24 — Account Settings ──────────────────────────────────────────────
function S24_AccountSettings() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <TopBar title="Account Settings" back />
      <div style={{ padding:'20px 20px 0' }}>
        <Input label="Email" value="ada@example.com" placeholder="" />
        <Input label="Username" value="ada_lovelace" placeholder="" />
        <div style={{ marginBottom:14 }}>
          <div style={{ fontFamily:mono, fontSize:10, color:DS.text3, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>Password</div>
          <div style={{ background:DS.surface2, border:`1px solid ${DS.border2}`,
            borderRadius:8, padding:'12px 14px', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:mono, fontSize:14, color:DS.text3, letterSpacing:'0.1em' }}>●●●●●●●●</span>
            <span style={{ fontFamily:sans, fontSize:12, color:DS.accent, fontWeight:500 }}>Change</span>
          </div>
        </div>
        <div style={{ marginTop:8 }}>
          <PrimaryBtn label="Save Changes" full />
        </div>
      </div>
    </div>
  );
}

// ── Screen 25 — Security / 2FA ─────────────────────────────────────────────────
function S25_Security() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <TopBar title="Security & 2FA" back />
      <div style={{ padding:'20px 20px 0' }}>
        <div style={{ background:DS.surface, border:`1px solid ${DS.border}`,
          borderRadius:8, padding:'20px', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div>
              <div style={{ fontFamily:sans, fontSize:14, fontWeight:600, color:DS.text1, marginBottom:4 }}>Two-Factor Authentication</div>
              <div style={{ fontFamily:sans, fontSize:12, color:DS.text2 }}>Add an extra layer of security</div>
            </div>
            <Badge label="Enabled" color={DS.green} dimColor={DS.greenDim} />
          </div>
          <div style={{ background:DS.surface2, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'12px 14px', marginBottom:14,
            fontFamily:sans, fontSize:12, color:DS.text2, lineHeight:1.5 }}>
            Your account is protected with a TOTP authenticator. You'll be asked for a 6-digit code each time you log in.
          </div>
          <div style={{ background:DS.redDim, border:`1px solid ${DS.red}33`,
            borderRadius:8, padding:'13px', textAlign:'center',
            fontFamily:sans, fontSize:14, color:DS.red }}>
            Disable Two-Factor Authentication
          </div>
        </div>
        {/* Sessions */}
        <div style={{ fontFamily:mono, fontSize:10, color:DS.text3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Active Sessions</div>
        {[
          { device:'iPhone 14 Pro', location:'London, UK', current:true },
          { device:'Chrome / macOS', location:'London, UK', current:false },
        ].map((s, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'14px', marginBottom:8,
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontFamily:sans, fontSize:13, fontWeight:500, color:DS.text1, marginBottom:3 }}>{s.device}</div>
              <div style={{ fontFamily:mono, fontSize:10, color:DS.text3 }}>{s.location}</div>
            </div>
            {s.current
              ? <Badge label="Current" color={DS.green} dimColor={DS.greenDim} small />
              : <span style={{ fontFamily:mono, fontSize:11, color:DS.red }}>Revoke</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 26 — 2FA Setup ──────────────────────────────────────────────────────
function S26_TwoFASetup() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:DS.surface, borderRadius:'20px 20px 0 0',
        border:`1px solid ${DS.border2}`, borderBottom:'none',
        padding:'20px 24px 40px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:DS.border2, margin:'0 auto 24px' }} />
        <div style={{ fontFamily:mono, fontSize:17, fontWeight:700, color:DS.text1, marginBottom:6 }}>Enable 2FA</div>
        <div style={{ fontFamily:sans, fontSize:13, color:DS.text2, marginBottom:20, lineHeight:1.5 }}>
          Scan this QR code with Google Authenticator or any TOTP app.
        </div>
        {/* QR placeholder */}
        <div style={{ width:160, height:160, margin:'0 auto 16px',
          background:DS.surface2, border:`1px solid ${DS.border2}`, borderRadius:8,
          display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6 }}>
          {/* Minimal QR pattern */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <rect x="5" y="5" width="35" height="35" rx="3" stroke={DS.text2} strokeWidth="2"/>
            <rect x="12" y="12" width="21" height="21" rx="1" fill={DS.text2} opacity="0.5"/>
            <rect x="60" y="5" width="35" height="35" rx="3" stroke={DS.text2} strokeWidth="2"/>
            <rect x="67" y="12" width="21" height="21" rx="1" fill={DS.text2} opacity="0.5"/>
            <rect x="5" y="60" width="35" height="35" rx="3" stroke={DS.text2} strokeWidth="2"/>
            <rect x="12" y="67" width="21" height="21" rx="1" fill={DS.text2} opacity="0.5"/>
            {/* dots */}
            {[60,68,76,84,60,68,76,84].map((x,i)=>(
              <rect key={i} x={x} y={60+Math.floor(i/4)*8} width="5" height="5" rx="1"
                fill={DS.text2} opacity={Math.random()>0.5?'0.6':'0.2'}/>
            ))}
          </svg>
        </div>
        <div style={{ fontFamily:mono, fontSize:10, color:DS.text3, textAlign:'center', marginBottom:20 }}>
          Manual key: JBSW Y3DP EHPK 3PXP
        </div>
        <Input label="Verification Code" placeholder="Enter 6-digit code" value="" />
        <PrimaryBtn label="Confirm & Enable" full />
      </div>
    </div>
  );
}

// ── Screen 27 — Admin Panel Home ──────────────────────────────────────────────
function S27_AdminPanel() {
  const links = [
    { label:'User Management', desc:'Search, edit and delete platform users', icon:'👥' },
    { label:'Role Management', desc:'Create and manage system-level roles', icon:'🛡' },
    { label:'Activity Logs', desc:'Audit log of all platform actions', icon:'📋' },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <div style={{ padding:'8px 20px 12px', borderBottom:`1px solid ${DS.border}`,
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:6, background:DS.accentDim,
            border:`1px solid ${DS.accentBorder}`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M6 1L1 3.5v4c0 3 2.3 5 5 5.5 2.7-.5 5-2.5 5-5.5v-4L6 1Z" stroke={DS.accent} strokeWidth="1.2"/>
            </svg>
          </div>
          <span style={{ fontFamily:mono, fontSize:15, fontWeight:700, color:DS.text1 }}>Admin Panel</span>
        </div>
        <Badge label="SYS_ADMIN" color={DS.accent} dimColor={DS.accentDim} small />
      </div>
      {/* Stats */}
      <div style={{ display:'flex', gap:10, padding:'16px 16px 0' }}>
        {[{ v:'1,284', l:'Users'}, { v:'3', l:'Roles'}, { v:'48.2k', l:'Log entries'}].map((s,i)=>(
          <div key={i} style={{ flex:1, background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'14px', textAlign:'center' }}>
            <div style={{ fontFamily:mono, fontSize:18, fontWeight:700, color:DS.text1 }}>{s.v}</div>
            <div style={{ fontFamily:mono, fontSize:9, color:DS.text3, textTransform:'uppercase', marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:'16px 16px 0', display:'flex', flexDirection:'column', gap:10 }}>
        {links.map((l, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'18px',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:8, background:DS.surface2,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{l.icon}</div>
              <div>
                <div style={{ fontFamily:sans, fontSize:14, fontWeight:600, color:DS.text1, marginBottom:3 }}>{l.label}</div>
                <div style={{ fontFamily:sans, fontSize:12, color:DS.text2 }}>{l.desc}</div>
              </div>
            </div>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
              <path d="M1 1l4 4-4 4" stroke={DS.text3} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 28 — User Management ───────────────────────────────────────────────
function S28_UserManagement() {
  const users = [
    { initials:'AL', name:'ada_lovelace', email:'ada@example.com', role:'SYS_ADMIN', twofa:true },
    { initials:'CT', name:'charles_t', email:'charles@example.com', role:'USER', twofa:false },
    { initials:'MR', name:'marie_r', email:'marie@example.com', role:'USER', twofa:true },
    { initials:'GH', name:'grace_h', email:'grace@example.com', role:'USER', twofa:false },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <TopBar title="User Management" back />
      <SearchBar placeholder="Search users…" />
      <div style={{ padding:'12px 16px 0', display:'flex', flexDirection:'column', gap:8 }}>
        {users.map((u, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'14px',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:20,
                background: u.role==='SYS_ADMIN' ? DS.accentDim : DS.surface2,
                border:`1px solid ${u.role==='SYS_ADMIN' ? DS.accentBorder : DS.border2}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:mono, fontSize:12, fontWeight:700,
                color: u.role==='SYS_ADMIN' ? DS.accent : DS.text2 }}>{u.initials}</div>
              <div>
                <div style={{ fontFamily:mono, fontSize:13, fontWeight:600, color:DS.text1 }}>{u.name}</div>
                <div style={{ fontFamily:sans, fontSize:11, color:DS.text3 }}>{u.email}</div>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
              <Badge small label={u.role}
                color={u.role==='SYS_ADMIN' ? DS.accent : DS.grey}
                dimColor={u.role==='SYS_ADMIN' ? DS.accentDim : DS.greyDim} />
              <span style={{ fontFamily:mono, fontSize:9, color: u.twofa ? DS.green : DS.text3 }}>
                {u.twofa ? '2FA on' : '2FA off'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 29 — User Detail ───────────────────────────────────────────────────
function S29_UserDetail() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 20px 12px', borderBottom:`1px solid ${DS.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:DS.surface2, border:`1px solid ${DS.border2}`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
              <path d="M7 1L1 6.5L7 12" stroke={DS.text2} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily:sans, fontSize:16, fontWeight:600, color:DS.text1 }}>User Detail</span>
        </div>
        <span style={{ fontFamily:mono, fontSize:12, color:DS.accent }}>Edit</span>
      </div>
      <div style={{ padding:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <div style={{ width:64, height:64, borderRadius:32, background:DS.accentDim,
            border:`2px solid ${DS.accentBorder}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:mono, fontSize:22, fontWeight:700, color:DS.accent }}>AL</div>
          <div>
            <div style={{ fontFamily:mono, fontSize:16, fontWeight:700, color:DS.text1 }}>ada_lovelace</div>
            <div style={{ fontFamily:sans, fontSize:13, color:DS.text2 }}>ada@example.com</div>
          </div>
        </div>
        {[
          { label:'System Role', value:'SYS_ADMIN', accent:true },
          { label:'2FA Status', value:'Enabled', green:true },
          { label:'Account Created', value:'Jan 12, 2025' },
          { label:'Organisations', value:'3 orgs' },
        ].map((row, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'14px 0', borderBottom:`1px solid ${DS.border}` }}>
            <span style={{ fontFamily:mono, fontSize:11, color:DS.text3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{row.label}</span>
            <span style={{ fontFamily:mono, fontSize:12,
              color: row.accent ? DS.accent : row.green ? DS.green : DS.text1 }}>{row.value}</span>
          </div>
        ))}
        <div style={{ marginTop:24, background:DS.redDim, border:`1px solid ${DS.red}33`,
          borderRadius:8, padding:'14px', textAlign:'center',
          fontFamily:sans, fontSize:14, color:DS.red }}>
          Delete User
        </div>
      </div>
    </div>
  );
}

// ── Screen 31 — Role Management ───────────────────────────────────────────────
function S31_RoleManagement() {
  const roles = [
    { name:'SYS_ADMIN', desc:'Full platform access including admin panel and user management' },
    { name:'USER', desc:'Standard platform user — can manage content in their organisations' },
    { name:'READONLY', desc:'Read-only access to public content endpoints' },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <TopBar title="Role Management" back />
      <div style={{ padding:'12px 16px 0', display:'flex', flexDirection:'column', gap:10 }}>
        {roles.map((r, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontFamily:mono, fontSize:13, fontWeight:700, color:DS.accent }}>{r.name}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 1.5L10.5 4 3.5 11H1V8.5L8 1.5Z" stroke={DS.text3} strokeWidth="1.1" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontFamily:sans, fontSize:12, color:DS.text2, lineHeight:1.5 }}>{r.desc}</div>
          </div>
        ))}
      </div>
      <FAB label="New Role" />
    </div>
  );
}

// ── Screen 32 — Activity Logs ─────────────────────────────────────────────────
function S32_ActivityLogs() {
  const logs = [
    { action:'User ada_lovelace logged in', user:'ada_lovelace', time:'09:41:22' },
    { action:'Entry "Getting Started Guide" published', user:'ada_lovelace', time:'09:38:10' },
    { action:'API key generated in Acme Corp', user:'ada_lovelace', time:'09:30:05' },
    { action:'User charles_t joined Acme Corp', user:'charles_t', time:'Yesterday 18:22' },
    { action:'Entry "Q4 Roadmap" created as Draft', user:'marie_r', time:'Yesterday 15:10' },
    { action:'User grace_h registered', user:'grace_h', time:'Apr 25 11:04' },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <TopBar title="Activity Logs" back />
      <div style={{ padding:'10px 16px 8px', display:'flex', gap:8, alignItems:'center' }}>
        <div style={{ flex:1, background:DS.surface2, border:`1px solid ${DS.border}`,
          borderRadius:8, padding:'9px 12px',
          fontFamily:sans, fontSize:13, color:DS.text3 }}>Filter by user…</div>
        <div style={{ background:DS.surface2, border:`1px solid ${DS.border}`,
          borderRadius:8, padding:'9px 12px',
          fontFamily:mono, fontSize:11, color:DS.text2 }}>All time</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {logs.map((l, i) => (
          <div key={i} style={{ padding:'12px 20px', borderBottom:`1px solid ${DS.border}`,
            display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:6, height:6, borderRadius:3, background:DS.accentBorder,
              marginTop:5, flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:sans, fontSize:13, color:DS.text1, marginBottom:3 }}>{l.action}</div>
              <div style={{ display:'flex', gap:10 }}>
                <span style={{ fontFamily:mono, fontSize:10, color:DS.accent }}>{l.user}</span>
                <span style={{ fontFamily:mono, fontSize:10, color:DS.text3 }}>{l.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 33 — Public Content Feed ──────────────────────────────────────────
function S33_PublicFeed() {
  const items = [
    { title:'Getting Started with Generic CMS', cat:'Documentation', tags:['api','guide'], date:'Apr 20', hasImg:true },
    { title:'Announcing Generic v0.1', cat:'Blog', tags:['release','announcement'], date:'Apr 15', hasImg:true },
    { title:'API Reference: Content Endpoints', cat:'API Reference', tags:['api','v2'], date:'Apr 10', hasImg:false },
    { title:'5 Tips for Better Content Structure', cat:'Blog', tags:['tutorial'], date:'Apr 5', hasImg:false },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ padding:'8px 20px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${DS.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:6, background:DS.surface2,
            border:`1px solid ${DS.accentBorder}`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:mono, fontSize:12, fontWeight:700, color:DS.accent }}>G</span>
          </div>
          <span style={{ fontFamily:mono, fontSize:15, fontWeight:600, color:DS.text1 }}>Generic</span>
        </div>
        <span style={{ fontFamily:mono, fontSize:12, color:DS.accent }}>Log In</span>
      </div>
      <SearchBar placeholder="Search content…" />
      {/* Filter chips */}
      <div style={{ display:'flex', gap:8, padding:'10px 16px', overflowX:'hidden' }}>
        {['All','Blog','Docs','API Ref'].map((f, i) => (
          <div key={f} style={{ padding:'5px 12px', borderRadius:6,
            background: i===0 ? DS.accent : DS.surface2,
            border:`1px solid ${i===0 ? DS.accent : DS.border}`,
            fontFamily:mono, fontSize:10, color: i===0 ? '#fff' : DS.text2,
            whiteSpace:'nowrap', flexShrink:0 }}>{f}</div>
        ))}
      </div>
      <div style={{ padding:'4px 16px', display:'flex', flexDirection:'column', gap:10 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, overflow:'hidden', display:'flex' }}>
            {item.hasImg && (
              <div style={{ width:80, background:DS.surface2,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
                  <rect x="1" y="1" width="20" height="18" rx="2" stroke={DS.text3} strokeWidth="1.1"/>
                  <circle cx="7" cy="7" r="2" stroke={DS.text3} strokeWidth="1.1"/>
                  <path d="M2 15l5-4 4 3 3-2.5 6 4.5" stroke={DS.text3} strokeWidth="1.1" strokeLinecap="round"/>
                </svg>
              </div>
            )}
            <div style={{ padding:'12px', flex:1 }}>
              <div style={{ fontFamily:sans, fontSize:13, fontWeight:600, color:DS.text1, marginBottom:6, lineHeight:1.4 }}>{item.title}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                <span style={{ fontFamily:mono, fontSize:9, color:DS.text3 }}>{item.cat}</span>
                {item.tags.slice(0,2).map(t => (
                  <span key={t} style={{ fontFamily:mono, fontSize:9, color:DS.text3,
                    background:DS.surface2, border:`1px solid ${DS.border}`,
                    padding:'2px 5px', borderRadius:4 }}>#{t}</span>
                ))}
                <span style={{ fontFamily:mono, fontSize:9, color:DS.text3, marginLeft:'auto' }}>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 34 — Public Content Detail ─────────────────────────────────────────
function S34_PublicDetail() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <TopBar title="" back rightIcon={
        <span style={{ fontFamily:mono, fontSize:12, color:DS.accent }}>Log In</span>
      } />
      {/* Hero */}
      <div style={{ height:160, background:DS.surface2, margin:'10px 16px 0',
        borderRadius:8, border:`1px solid ${DS.border}`,
        display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
        <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
          <rect x="1" y="1" width="30" height="26" rx="3" stroke={DS.text3} strokeWidth="1.2"/>
          <circle cx="9" cy="9" r="3" stroke={DS.text3} strokeWidth="1.2"/>
          <path d="M2 21l7-5.5 5 4 5-4 12 7" stroke={DS.text3} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily:mono, fontSize:10, color:DS.text3 }}>hero image</span>
      </div>
      <div style={{ padding:'18px 20px' }}>
        <div style={{ fontFamily:sans, fontSize:19, fontWeight:700, color:DS.text1, lineHeight:1.3, marginBottom:10 }}>
          Getting Started with Generic CMS
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          <span style={{ fontFamily:mono, fontSize:10, color:DS.text3 }}>Documentation</span>
          {['api','guide'].map(t => (
            <span key={t} style={{ fontFamily:mono, fontSize:9, color:DS.text3,
              background:DS.surface2, border:`1px solid ${DS.border}`,
              padding:'2px 6px', borderRadius:4 }}>#{t}</span>
          ))}
          <span style={{ fontFamily:mono, fontSize:10, color:DS.text3, marginLeft:'auto' }}>Apr 20</span>
        </div>
        <div style={{ fontFamily:sans, fontSize:13, color:DS.text2, lineHeight:1.8 }}>
          Welcome to Generic CMS. This guide will walk you through setting up your first organisation, creating content entries, and using the API to deliver content to your applications.<br/><br/>
          Start by logging in or creating a new account. Once authenticated, you'll be taken to your organisations dashboard…
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  S23_Profile, S24_AccountSettings, S25_Security, S26_TwoFASetup,
  S27_AdminPanel, S28_UserManagement, S29_UserDetail,
  S31_RoleManagement, S32_ActivityLogs, S33_PublicFeed, S34_PublicDetail,
});
