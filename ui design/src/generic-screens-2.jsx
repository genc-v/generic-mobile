
// Screens 11–22: Categories, Tags, Media, Members, API Keys, Notifications
// Depends on globals from generic-screens-1.jsx

// ── Screen 11 — Category List ─────────────────────────────────────────────────
function S11_CategoryList() {
  const cats = [
    { name:'API Reference', desc:'Technical API documentation and endpoint guides' },
    { name:'Blog', desc:'General blog posts and company announcements' },
    { name:'Documentation', desc:'Product documentation and how-to articles' },
    { name:'Planning', desc:'Internal roadmaps and planning documents' },
    { name:'Tutorials', desc:'Step-by-step user guides' },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <TopBar title="Categories" />
      <SearchBar placeholder="Search categories…" />
      <div style={{ padding:'12px 16px 0', display:'flex', flexDirection:'column', gap:8 }}>
        {cats.map((c, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'14px 14px',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:sans, fontSize:14, fontWeight:600, color:DS.text1, marginBottom:3 }}>{c.name}</div>
              <div style={{ fontFamily:sans, fontSize:12, color:DS.text2,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:260 }}>{c.desc}</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <div style={{ width:28, height:28, borderRadius:6, background:DS.surface2,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 1.5L10.5 4 3.5 11H1V8.5L8 1.5Z" stroke={DS.text3} strokeWidth="1.1" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      <FAB label="New Category" />
      <BottomTabs active="Categories" adminView />
    </div>
  );
}

// ── Screen 12 — Create/Edit Category ─────────────────────────────────────────
function S12_CategoryForm() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:DS.surface, borderRadius:'20px 20px 0 0',
        border:`1px solid ${DS.border2}`, borderBottom:'none',
        padding:'20px 24px 40px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:DS.border2, margin:'0 auto 24px' }} />
        <div style={{ fontFamily:mono, fontSize:17, fontWeight:700, color:DS.text1, marginBottom:20 }}>Edit Category</div>
        <Input label="Name" value="Documentation" placeholder="Category name" />
        <div style={{ marginBottom:14 }}>
          <div style={{ fontFamily:mono, fontSize:10, color:DS.text3, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>Description</div>
          <div style={{ background:DS.surface2, border:`1px solid ${DS.border2}`,
            borderRadius:8, padding:'12px 14px', fontFamily:sans, fontSize:14, color:DS.text1,
            minHeight:80 }}>
            Product documentation and how-to articles
          </div>
        </div>
        <PrimaryBtn label="Save" full />
        <div style={{ marginTop:12, padding:'13px', textAlign:'center',
          border:`1px solid ${DS.red}33`, borderRadius:8,
          fontFamily:sans, fontSize:14, color:DS.red }}>
          Delete Category
        </div>
      </div>
    </div>
  );
}

// ── Screen 13 — Tag List ──────────────────────────────────────────────────────
function S13_TagList() {
  const tags = ['api','announcements','deprecated','guide','internal','migration','release','tutorial','v2','v3'];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <TopBar title="Tags" />
      <SearchBar placeholder="Search tags…" />
      <div style={{ padding:'12px 16px 0', display:'flex', flexWrap:'wrap', gap:8 }}>
        {tags.map((t, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'10px 14px',
            display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:mono, fontSize:13, color:DS.text1 }}>{t}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l4 4-4 4M9 1L5 5l4 4" stroke={DS.text3} strokeWidth="1.1" strokeLinecap="round" style={{display:'none'}}/>
              <path d="M7.5 2L5 7 2.5 2" stroke={DS.text3} strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
          </div>
        ))}
      </div>
      <FAB label="New Tag" />
      <BottomTabs active="Tags" adminView />
    </div>
  );
}

// ── Screen 14 — Create/Edit Tag ───────────────────────────────────────────────
function S14_TagForm() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:DS.surface, borderRadius:'20px 20px 0 0',
        border:`1px solid ${DS.border2}`, borderBottom:'none',
        padding:'20px 24px 40px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:DS.border2, margin:'0 auto 24px' }} />
        <div style={{ fontFamily:mono, fontSize:17, fontWeight:700, color:DS.text1, marginBottom:20 }}>Edit Tag</div>
        <Input label="Name" value="api" placeholder="tag-name" />
        <PrimaryBtn label="Save" full />
        <div style={{ marginTop:12, padding:'13px', textAlign:'center',
          border:`1px solid ${DS.red}33`, borderRadius:8,
          fontFamily:sans, fontSize:14, color:DS.red }}>
          Delete Tag
        </div>
      </div>
    </div>
  );
}

// ── Screen 15 — Media Library ─────────────────────────────────────────────────
function S15_MediaLibrary() {
  const files = [
    { name:'hero-banner.png', date:'Apr 20', type:'img' },
    { name:'logo-dark.svg', date:'Apr 18', type:'img' },
    { name:'api-diagram.png', date:'Apr 15', type:'img' },
    { name:'roadmap-q4.pdf', date:'Apr 10', type:'file' },
    { name:'screenshot-01.png', date:'Apr 8', type:'img' },
    { name:'favicon.ico', date:'Mar 30', type:'file' },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 20px 12px', borderBottom:`1px solid ${DS.border}` }}>
        <span style={{ fontFamily:sans, fontSize:16, fontWeight:600, color:DS.text1 }}>Media</span>
        <div style={{ width:32, height:32, borderRadius:8, background:DS.accentDim,
          border:`1px solid ${DS.accentBorder}`,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v8M3.5 5.5L7 2l3.5 3.5" stroke={DS.accent} strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M1 10v1.5a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 13 11.5V10" stroke={DS.accent} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div style={{ padding:'12px 16px 0',
        display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
        {files.map((f, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, overflow:'hidden' }}>
            <div style={{ height:72, background:DS.surface2,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              {f.type==='img'
                ? <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
                    <rect x="1" y="1" width="20" height="18" rx="2" stroke={DS.text3} strokeWidth="1.1"/>
                    <circle cx="7" cy="6.5" r="2" stroke={DS.text3} strokeWidth="1.1"/>
                    <path d="M2 14l5-4 4 3.5 3-2.5 6 5" stroke={DS.text3} strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                : <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                    <path d="M9 1H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7L9 1Z" stroke={DS.text3} strokeWidth="1.1"/>
                    <path d="M9 1v6h6" stroke={DS.text3} strokeWidth="1.1" strokeLinejoin="round"/>
                  </svg>}
            </div>
            <div style={{ padding:'7px 8px' }}>
              <div style={{ fontFamily:mono, fontSize:9, color:DS.text1,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
              <div style={{ fontFamily:mono, fontSize:8, color:DS.text3 }}>{f.date}</div>
            </div>
          </div>
        ))}
      </div>
      <BottomTabs active="Media" adminView />
    </div>
  );
}

// ── Screen 16 — Asset Detail ──────────────────────────────────────────────────
function S16_AssetDetail() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <TopBar title="Asset Detail" back />
      <div style={{ height:220, background:DS.surface2, margin:'16px 16px 0',
        borderRadius:8, border:`1px solid ${DS.border}`,
        display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
        <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
          <rect x="1" y="1" width="38" height="34" rx="4" stroke={DS.text3} strokeWidth="1.3"/>
          <circle cx="11" cy="11" r="4" stroke={DS.text3} strokeWidth="1.3"/>
          <path d="M2 27l10-8 8 7 7-5.5L38 27" stroke={DS.text3} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily:mono, fontSize:11, color:DS.text3 }}>hero-banner.png</span>
      </div>
      <div style={{ padding:'16px 20px' }}>
        {[
          { label:'File name', value:'hero-banner.png' },
          { label:'Type', value:'image/png' },
          { label:'Uploaded', value:'Apr 20, 2025' },
          { label:'Linked entry', value:'Getting Started Guide', link:true },
        ].map((row, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'12px 0', borderBottom:`1px solid ${DS.border}` }}>
            <span style={{ fontFamily:mono, fontSize:11, color:DS.text3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{row.label}</span>
            <span style={{ fontFamily: row.link ? mono : sans, fontSize:13,
              color: row.link ? DS.accent : DS.text1, fontWeight: row.link ? 500 : 400 }}>{row.value}</span>
          </div>
        ))}
        <div style={{ marginTop:16 }}>
          <div style={{ fontFamily:mono, fontSize:10, color:DS.text3, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>URL</div>
          <div style={{ background:DS.surface2, border:`1px solid ${DS.border2}`, borderRadius:8,
            padding:'11px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:mono, fontSize:11, color:DS.text1 }}>cdn.generic.io/assets/abc123…</span>
            <span style={{ fontFamily:sans, fontSize:12, color:DS.accent, fontWeight:500 }}>Copy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Screen 17 — Member List ───────────────────────────────────────────────────
function S17_MemberList() {
  const members = [
    { initials:'AL', name:'ada_lovelace', role:'Admin' },
    { initials:'CT', name:'charles_t', role:'Editor' },
    { initials:'MR', name:'marie_r', role:'Editor' },
    { initials:'GH', name:'grace_h', role:'Viewer' },
    { initials:'TT', name:'turing_t', role:'Viewer' },
  ];
  const roleColor = { Admin: DS.accent, Editor: DS.green, Viewer: DS.grey };
  const roleColorDim = { Admin: DS.accentDim, Editor: DS.greenDim, Viewer: DS.greyDim };
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <TopBar title="Members" />
      <div style={{ padding:'12px 16px 0', display:'flex', flexDirection:'column', gap:8 }}>
        {members.map((m, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'14px',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:20,
                background: m.role==='Admin' ? DS.accentDim : DS.surface2,
                border:`1px solid ${m.role==='Admin' ? DS.accentBorder : DS.border2}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:mono, fontSize:12, fontWeight:700,
                color: m.role==='Admin' ? DS.accent : DS.text2 }}>{m.initials}</div>
              <div>
                <div style={{ fontFamily:mono, fontSize:13, fontWeight:600, color:DS.text1 }}>{m.name}</div>
              </div>
            </div>
            <Badge label={m.role} color={roleColor[m.role]} dimColor={roleColorDim[m.role]} small />
          </div>
        ))}
      </div>
      <FAB label="Add Member" />
      <BottomTabs active="Members" adminView />
    </div>
  );
}

// ── Screen 18 — Add Member ────────────────────────────────────────────────────
function S18_AddMember() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:DS.surface, borderRadius:'20px 20px 0 0',
        border:`1px solid ${DS.border2}`, borderBottom:'none',
        padding:'20px 24px 40px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:DS.border2, margin:'0 auto 24px' }} />
        <div style={{ fontFamily:mono, fontSize:17, fontWeight:700, color:DS.text1, marginBottom:20 }}>Add Member</div>
        {/* Search */}
        <div style={{ background:DS.surface2, border:`1.5px solid ${DS.accentBorder}`,
          borderRadius:8, padding:'11px 14px', marginBottom:12,
          display:'flex', alignItems:'center', gap:10 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke={DS.text3} strokeWidth="1.3"/>
            <path d="M10 10l2.5 2.5" stroke={DS.text3} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily:sans, fontSize:14, color:DS.text2 }}>Search by email or username…</span>
        </div>
        {/* Results */}
        {['alan_t@example.com','nikola_t@example.com'].map((u, i) => (
          <div key={i} style={{ padding:'12px', borderRadius:8, background: i===0 ? DS.accentDim : 'transparent',
            border:`1px solid ${i===0 ? DS.accentBorder : 'transparent'}`,
            marginBottom:6, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:16, background:DS.surface3,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:mono, fontSize:11, color:DS.text2, fontWeight:700 }}>
              {u.slice(0,2).toUpperCase()}
            </div>
            <span style={{ fontFamily:mono, fontSize:12, color: i===0 ? DS.text1 : DS.text2 }}>{u}</span>
          </div>
        ))}
        {/* Role picker */}
        <div style={{ marginTop:16, marginBottom:16 }}>
          <div style={{ fontFamily:mono, fontSize:10, color:DS.text3, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>Role</div>
          <div style={{ display:'flex', gap:8 }}>
            {['Viewer','Editor','Admin'].map((r, i) => (
              <div key={r} style={{ flex:1, padding:'11px', borderRadius:8, textAlign:'center',
                background: i===0 ? DS.accentDim : DS.surface2,
                border:`1px solid ${i===0 ? DS.accentBorder : DS.border}`,
                fontFamily:mono, fontSize:12,
                color: i===0 ? DS.accent : DS.text2 }}>{r}</div>
            ))}
          </div>
        </div>
        <PrimaryBtn label="Add to Organisation" full />
      </div>
    </div>
  );
}

// ── Screen 19 — Edit Member Role ──────────────────────────────────────────────
function S19_EditMember() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:DS.surface, borderRadius:'20px 20px 0 0',
        border:`1px solid ${DS.border2}`, borderBottom:'none',
        padding:'20px 24px 40px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:DS.border2, margin:'0 auto 24px' }} />
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ width:44, height:44, borderRadius:22, background:DS.surface2,
            border:`1px solid ${DS.border2}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:mono, fontSize:14, fontWeight:700, color:DS.text2 }}>CT</div>
          <div>
            <div style={{ fontFamily:mono, fontSize:15, fontWeight:600, color:DS.text1 }}>charles_t</div>
            <div style={{ fontFamily:sans, fontSize:12, color:DS.text3 }}>Currently: Editor</div>
          </div>
        </div>
        <div style={{ fontFamily:mono, fontSize:10, color:DS.text3, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>Change Role</div>
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {['Viewer','Editor','Admin'].map((r, i) => (
            <div key={r} style={{ flex:1, padding:'11px', borderRadius:8, textAlign:'center',
              background: i===1 ? DS.accentDim : DS.surface2,
              border:`1px solid ${i===1 ? DS.accentBorder : DS.border}`,
              fontFamily:mono, fontSize:12,
              color: i===1 ? DS.accent : DS.text2 }}>{r}</div>
          ))}
        </div>
        <PrimaryBtn label="Save" full />
        <div style={{ marginTop:12, padding:'13px', textAlign:'center',
          border:`1px solid ${DS.red}33`, borderRadius:8,
          fontFamily:sans, fontSize:14, color:DS.red }}>
          Remove from Organisation
        </div>
      </div>
    </div>
  );
}

// ── Screen 20 — API Key List ──────────────────────────────────────────────────
function S20_APIKeyList() {
  const keys = [
    { key:'sk_live_aBcD…XyZ=', created:'Apr 1', expiry:'Jun 1, 2025', active:true },
    { key:'sk_live_mNpQ…WvU=', created:'Mar 15', expiry:'No expiry', active:true },
    { key:'sk_live_zZzZ…123=', created:'Feb 20', expiry:'Mar 20, 2025', active:false },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans, position:'relative' }}>
      <StatusBar />
      <TopBar title="API Keys" />
      <div style={{ padding:'12px 16px 0', display:'flex', flexDirection:'column', gap:10 }}>
        {keys.map((k, i) => (
          <div key={i} style={{ background:DS.surface, border:`1px solid ${DS.border}`,
            borderRadius:8, padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <span style={{ fontFamily:mono, fontSize:12, color:DS.text1 }}>{k.key}</span>
              {/* Toggle */}
              <div style={{ width:38, height:22, borderRadius:11,
                background: k.active ? DS.accent : DS.surface3,
                position:'relative', border:`1px solid ${k.active ? DS.accent : DS.border2}` }}>
                <div style={{ position:'absolute', top:2, width:16, height:16, borderRadius:8,
                  background:'#fff',
                  left: k.active ? 18 : 2, transition:'left 0.2s' }} />
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:12 }}>
                <span style={{ fontFamily:mono, fontSize:9, color:DS.text3 }}>Created {k.created}</span>
                <span style={{ fontFamily:mono, fontSize:9, color: k.expiry.startsWith('No') ? DS.text3 : k.active ? DS.amber : DS.red }}>
                  Expires {k.expiry}
                </span>
              </div>
              <Badge small
                label={k.active ? 'Active' : 'Inactive'}
                color={k.active ? DS.green : DS.red}
                dimColor={k.active ? DS.greenDim : DS.redDim} />
            </div>
          </div>
        ))}
      </div>
      <FAB label="Generate Key" />
      <BottomTabs active="API Keys" adminView />
    </div>
  );
}

// ── Screen 21 — Create API Key + Reveal ───────────────────────────────────────
function S21_CreateAPIKey() {
  return (
    <div style={{ width:390, height:844, background:DS.bg, fontFamily:sans, position:'relative' }}>
      <StatusBar />
      {/* Bottom sheet */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:DS.surface, borderRadius:'20px 20px 0 0',
        border:`1px solid ${DS.border2}`, borderBottom:'none',
        padding:'20px 24px 40px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:DS.border2, margin:'0 auto 24px' }} />
        <div style={{ fontFamily:mono, fontSize:17, fontWeight:700, color:DS.text1, marginBottom:6 }}>New API Key Generated</div>
        <div style={{ fontFamily:sans, fontSize:13, color:DS.text2, marginBottom:20 }}>Optional expiry: Jun 1, 2025</div>

        {/* Warning card */}
        <div style={{ background:'rgba(245,158,11,0.08)', border:`1px solid ${DS.amber}44`,
          borderRadius:8, padding:'12px 14px', marginBottom:16,
          display:'flex', gap:10, alignItems:'flex-start' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0, marginTop:1 }}>
            <path d="M8 1L15 14H1L8 1Z" stroke={DS.amber} strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M8 6v4" stroke={DS.amber} strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="8" cy="12" r="0.6" fill={DS.amber}/>
          </svg>
          <span style={{ fontFamily:sans, fontSize:12, color:DS.amber, lineHeight:1.5 }}>
            This key will not be shown again. Copy it now and store it securely.
          </span>
        </div>

        {/* Key display */}
        <div style={{ background:DS.surface2, border:`1.5px solid ${DS.accentBorder}`,
          borderRadius:8, padding:'14px 16px', marginBottom:16 }}>
          <div style={{ fontFamily:mono, fontSize:10, color:DS.text3, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.08em' }}>API Key</div>
          <div style={{ fontFamily:mono, fontSize:11, color:DS.text1, lineHeight:1.6, wordBreak:'break-all', marginBottom:10 }}>
            YOUR_API_KEY_HERE
          </div>
          <div style={{ textAlign:'right' }}>
            <span style={{ fontFamily:sans, fontSize:12, color:DS.accent, fontWeight:600 }}>Copy Key</span>
          </div>
        </div>
        <PrimaryBtn label="I've copied this key" full />
      </div>
    </div>
  );
}

// ── Screen 22 — Notifications ─────────────────────────────────────────────────
function S22_Notifications() {
  const notifs = [
    { icon:'✓', msg:'Asset processing complete: hero-banner.png', time:'2m ago', unread:true },
    { icon:'👤', msg:'charles_t joined Acme Corp as Editor', time:'1h ago', unread:true },
    { icon:'🔑', msg:'API key sk_live_mNpQ… was generated', time:'3h ago', unread:false },
    { icon:'✏️', msg:'Q4 Roadmap was updated by marie_r', time:'Yesterday', unread:false },
    { icon:'🗑', msg:'Untitled entry was deleted by grace_h', time:'2 days ago', unread:false },
  ];
  return (
    <div style={{ width:390, height:844, background:DS.bg, overflow:'hidden', fontFamily:sans }}>
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 20px 12px', borderBottom:`1px solid ${DS.border}` }}>
        <span style={{ fontFamily:mono, fontSize:16, fontWeight:700, color:DS.text1 }}>Notifications</span>
        <div style={{ display:'flex', gap:14 }}>
          <span style={{ fontFamily:mono, fontSize:11, color:DS.accent }}>Mark all read</span>
          <span style={{ fontFamily:mono, fontSize:11, color:DS.text3 }}>Clear all</span>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {notifs.map((n, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 20px',
            borderBottom:`1px solid ${DS.border}`,
            background: n.unread ? 'rgba(139,92,246,0.04)' : 'transparent' }}>
            <div style={{ width:36, height:36, borderRadius:8,
              background: n.unread ? DS.accentDim : DS.surface2,
              border:`1px solid ${n.unread ? DS.accentBorder : DS.border}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:14, flexShrink:0 }}>
              <span style={{ fontSize:13 }}>{n.icon}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:sans, fontSize:13, color: n.unread ? DS.text1 : DS.text2,
                lineHeight:1.5, marginBottom:3 }}>{n.msg}</div>
              <div style={{ fontFamily:mono, fontSize:10, color:DS.text3 }}>{n.time}</div>
            </div>
            {n.unread && <div style={{ width:7, height:7, borderRadius:'50%',
              background:DS.accent, marginTop:5, flexShrink:0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  S11_CategoryList, S12_CategoryForm, S13_TagList, S14_TagForm,
  S15_MediaLibrary, S16_AssetDetail, S17_MemberList, S18_AddMember,
  S19_EditMember, S20_APIKeyList, S21_CreateAPIKey, S22_Notifications,
});
