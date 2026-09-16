/* =========================================================================
   Beyond Limits Connect — demonstration dataset
   Modelled on Andy's real spreadsheet (2024-27 BL Families, 7 Sep 2026):
   152 families listed, 39 removed, 113 remain, 9 codes exist of which 2 are
   test rows, ~105 families uncoded. Names from the actual record are marked
   *real*; the remainder is deterministic sample data for demonstration.
   ========================================================================= */
window.BL = (function(){
  const PROGRAMS = [
    {id:'main',   name:'Main',     code:'BL-2026-####', families:110, since:'2014', note:'The comprehensive sheet — families stay here even if they leave a track.'},
    {id:'horizons',name:'Horizons',code:'—',            families:21,  since:'2025', note:'Codes added 27 Jul 2026.'},
    {id:'scse',   name:'SCSE',     code:'—',            families:17,  since:'2025', note:'Stamford Charter School for Excellence. One stray 38th column.'},
    {id:'starfish',name:'Starfish',code:'—',            families:4,   since:'2026', note:'Four rows pasted in by hand. Tab structure is broken.'},
    {id:'bffs',   name:'BFFS',     code:'—',            families:13,  since:'?',    note:'Appears only in the dashboard. Nobody has told us what it is.'}
  ];
  const FIRST=['Jayden','Sofia','Mateo','Amelia','Noah','Valentina','Liam','Camila','Ethan','Isabella','Lucas','Mia','Diego','Emma','Santiago','Layla','Andre','Nora','Kai','Aisha','Marco','Elif','Dilan','Arben','Adriana','Bruno','Chloe','Daniel','Elena','Fabio','Gabriel','Hana','Ivan','Julia','Kevin','Leila','Marcus','Nina','Omar','Pedro','Rosa','Samuel','Talia','Umar','Vera','Wesley','Ximena','Yusuf','Zoe','Aaliyah','Bilal','Carla','Dev','Esme','Farah','Gustavo','Helena','Idris','Jasmin','Kofi','Lucia','Miguel','Nadia','Oscar','Priya','Quinn','Rafael','Selma','Tomas','Uma','Viktor','Wren','Yara','Zane'];
  const LAST=['Alvarado','Batista','Bonilla','Campos','Castillo','Cruz','Delgado','Diaz','Espinoza','Fernandes','Flores','Garcia','Gomez','Gonzalez','Gutierrez','Hernandez','Jean-Baptiste','Jimenez','Kola','Lopez','Maldonado','Martinez','Medina','Mendez','Molina','Moreau','Nunez','Ochoa','Ortiz','Pacheco','Paredes','Pena','Peralta','Pierre','Quintero','Ramirez','Ramos','Reyes','Rivas','Rivera','Rodriguez','Rojas','Romero','Salazar','Sanchez','Santos','Silva','Sosa','Suarez','Tavares','Torres','Vargas','Vasquez','Velasquez','Villalobos','Zamora','Shalauddin','Ahmad','Bekele','Chowdhury','Demir','Ferreira','Hoxha','Ivanova','Kaur','Marchetti','Nowak','Petrov','Rahman','Rossi','Sokolov','Tran','Uddin','Wojcik','Yilmaz'];
  const SCHOOLS=['Stamford High School','Westhill High School','Dolan Middle School','Rippowam Middle School','Turn of River Middle School','Cloonan Middle School','Scofield Middle School','Stamford Charter School for Excellence','Stillmeadow Elementary','Toquam Magnet Elementary','Hart Magnet Elementary','Newfield Elementary','Rogers International School','K.T. Murphy Elementary','Julia A. Stark Elementary'];
  const LANGS=[['English','en',62],['Spanish','es',28],['Portuguese','pt',3],['Haitian Creole','ht',2],['Albanian','sq',1.5],['Arabic','ar',1],['Bengali','bn',1],['Ukrainian','uk',0.8],['Mandarin','zh',0.7]];
  // deterministic RNG so the demo is stable between renders
  let _s=20260907; const rnd=()=>{_s=(_s*1103515245+12345)&0x7fffffff; return _s/0x7fffffff;};
  const pick=a=>a[Math.floor(rnd()*a.length)];
  const langPool=()=>{const r=rnd()*100;let acc=0;for(const l of LANGS){acc+=l[2];if(r<=acc)return l;}return LANGS[0];};

  /* ---- the real families from the record (RJ & Andy, verified 7 Sep 2026) ---- */
  const REAL=[
    {last:'Shalauddin',first:'Ethan',dob:'05/26/2013',grade:7,progs:['main','scse'],real:true,
     codes:['BLA-2026-0002','BLA20260003'],flag:'duplicate',note:'Submitted twice — Main 3 Jun 2026, SCSE 6 Jun 2026. Both correct; the system issued a second identity. Matched on name + DOB (phone alone would not have caught it).'},
    {last:'Rojas',first:'Annabella',dob:'04/12/2015',grade:5,progs:['main','scse'],real:true,codes:['BLA-2026-0001',null],
     flag:'decision',note:'Main 8 Nov 2024, SCSE 5 Dec 2024. Needs Andy to choose which copy survives. Rotary Scholarship 2025 recipient.'},
    {last:'Lopez',first:'Anthony',dob:'09/03/2011',grade:9,progs:['main','starfish'],real:true,codes:[null,null],
     flag:'decision',note:'Main 2 Jan 2025, Main again 4 Sep 2025, plus a Starfish row copied from the second submission.'},
    {last:'Lopez',first:'Mia',dob:'02/18/2014',grade:6,progs:['main'],real:true,codes:[null],flag:'none',
     note:'Dolan Middle School. Rotary Scholarship 2025. Sibling of Anthony — same phone, different birthday.'},
    {last:'Rivas',first:'Danna',dob:'11/07/2012',grade:8,progs:['main'],real:true,codes:[null],flag:'none',note:'Two years on the Main roster.'}
  ];

  /* ---- build the remaining roster deterministically ---- */
  const families=[]; let fid=0;
  function mk(o){o.id='F'+String(++fid).padStart(4,'0');
    o.lang=o.lang||langPool()[0]; o.langCode=o.langCode||(LANGS.find(l=>l[0]===o.lang)||LANGS[0])[1];
    o.phone=o.phone||('203'+String(200+Math.floor(rnd()*780))+String(1000+Math.floor(rnd()*8999)));
    o.email=o.email||((o.first+'.'+o.last).toLowerCase().replace(/[^a-z.]/g,'')+'@gmail.com');
    o.school=o.school||pick(SCHOOLS);
    if(o.sessions===undefined){o.sessions=8+Math.floor(rnd()*30);
      const r=rnd(); o.missed = r<.46?0 : r<.76?1 : r<.88?2 : r<.95?3 : r<.985?4 : 5; }
    o.lastSeen=o.lastSeen||o.sessions-o.missed; families.push(o); return o;}
  REAL.forEach(r=>{const f=mk({last:r.last,first:r.first,dob:r.dob,grade:r.grade,progs:r.progs,progs:r.progs,codes:r.codes,
    flag:r.flag,note:r.note,real:true,sessions:12+Math.floor(rnd()*22),missed:r.flag==='decision'?4:Math.floor(rnd()*3)});
    f.realNote=r.note;});
  // 108 sample families spread over the tracks (counts chosen to land on Andy's real totals)
  const plan=[['main',79],['main+horizons',6],['main+scse',4],['horizons',6],['scse',4],['starfish',3],['bffs',6]];
  plan.forEach(([p,n])=>{for(let i=0;i<n;i++){
    const progs=p.split('+'); const grade = progs.includes('bffs')?9+Math.floor(rnd()*2):4+Math.floor(rnd()*7);
    mk({last:pick(LAST),first:pick(FIRST),dob:String(1+Math.floor(rnd()*12)).padStart(2,'0')+'/'+String(1+Math.floor(rnd()*27)).padStart(2,'0')+'/'+(2026-grade-5),
        grade,progs,codes:[null],flag:'none'});}});
  /* nine codes exist in the live file. The two real ones keep the numbers from the record:
     Rojas = BL-2026-0001, Shalauddin = BL-2026-0002. Anthony Lopez is deliberately left UNCODED
     because his record is still waiting on Andy's decision. */
  let seq=1;
  families.forEach(f=>{
    if(f.real&&f.last==='Rojas') f.codes[0]='BL-2026-0001';
    else if(f.real&&f.last==='Shalauddin') f.codes[0]='BL-2026-0002';
    else if(f.flag==='decision') f.codes=[null];
  });
  families.forEach(f=>{ if(f.real&&f.last==='Shalauddin') f.school='Stamford Charter School for Excellence';
    if(f.real&&f.first==='Mia') f.school='Dolan Middle School'; });
  seq=3;
  families.filter(f=>!f.codes[0]&&f.flag!=='decision'&&!f.real).slice(0,7).forEach(f=>{f.codes[0]='BL-2026-'+String(seq++).padStart(4,'0');});
  const TEST=[{last:'Test',first:'Row (ours)',code:'BL-2026-0008',dupe:true},{last:'Test',first:'Row (ours)',code:'BL-2026-0009',dupe:true}];

  const coded=families.filter(f=>f.codes&&f.codes[0]).length;
  const STATS={families:families.length, originallyListed:152, removed:39, coded, uncoded:families.length-coded,
    testRows:2, programs:113, duplicates:1, decisions:2, stability:Math.round(coded/families.length*100),
    nextCode:'BL-2026-'+String(seq).padStart(4,'0')};

  /* ---- messages ---- */
  const MESSAGES=[
    {t:'Remind is retiring — here is what changes for your family', when:'2 Sep 2026, 9:00am', seg:'All families (113)', ch:'Text + Email', langs:4, read:94, rs:null, status:'sent'},
    {t:'Fall tutoring schedule + first session invitation', when:'7 Sep 2026, 4:30pm', seg:'Main (110)', ch:'Text + Email', langs:4, read:88, rs:'41 RSVPs', status:'sent'},
    {t:'Horizons — Saturday lab sign-ups are open', when:'Today, 8:00am', seg:'Horizons (21)', ch:'Text', langs:3, read:81, rs:'12 RSVPs', status:'sent'},
    {t:'Your scholar missed two sessions — can we reschedule?', when:'Scheduled 9:00am daily', seg:'Missed-2 recovery (7 scholars)', ch:'Text', langs:2, read:null, rs:null, status:'scheduled'},
    {t:'SCSE family night — dinner provided, translators on site', when:'Draft', seg:'SCSE (17)', ch:'Text + Email', langs:3, read:null, rs:null, status:'draft'}
  ];


  /* ---- tutors ---- */
  const TUTORS=[
    {n:'Maya Rensselaer',sub:'Cornell \u2019 27',sch:4,hrs:36,stage:'active',subj:'Algebra II, Chemistry',code:'TU-2026-014'},
    {n:'Priya Nair',sub:'Stamford High \u2019 27',sch:3,hrs:22,stage:'active',subj:'Geometry, Biology',code:'TU-2026-015'},
    {n:'Daniel Okafor',sub:'UConn \u2019 28',sch:3,hrs:18,stage:'active',subj:'Essay writing, History',code:'TU-2026-016'},
    {n:'Grace Tanaka',sub:'Westhill \u2019 26',sch:2,hrs:29,stage:'active',subj:'Precalculus',code:'TU-2026-017'},
    {n:'Tarek Etman',sub:'MBA teammate',sch:2,hrs:6,stage:'active',subj:'Study skills',code:'TU-2026-018'},
    {n:'Luis Cabrera',sub:'Stamford High \u2019 26',sch:0,hrs:0,stage:'onboarding',subj:'Spanish, Math',code:'pending'},
    {n:'Hana Demir',sub:'Rippowam \u2019 27',sch:0,hrs:0,stage:'onboarding',subj:'Chemistry',code:'pending'},
    {n:'Omar Haddad',sub:'Trinity College \u2019 27',sch:0,hrs:0,stage:'references',subj:'Physics',code:'pending'},
    {n:'Sofia Marchetti',sub:'New Canaan \u2019 26',sch:0,hrs:0,stage:'references',subj:'English',code:'pending'}
  ];

  /* ---- the nine defects found in the live file, verbatim from the record ---- */
  const DEFECTS=[
    {n:1,sev:'red',t:'The Master has no participant code column',d:'Even after everyone is coded, Andy\u2019s main view shows nothing. Built in 2024; codes arrived in 2026.'},
    {n:2,sev:'amber',t:'No preferred-language field on the Master',d:'Likely required for ParentSquare, and required for auto-translation here.'},
    {n:3,sev:'red',t:'Starfish has no Participant Code question',d:'The form has nowhere to write, so the script has nowhere to put the code.'},
    {n:4,sev:'red',t:'The Starfish tab is structurally broken',d:'Rows 1-5 are pasted copies, 6-9 are blank, and the real header row sits at row 10 shifted one column across. Adding the form question alone will not fix it.'},
    {n:5,sev:'amber',t:'Starfish appears nowhere in the Master',d:'Four families are invisible in the summary.'},
    {n:6,sev:'amber',t:'SCSE has a stray 38th column titled "Column 37"',d:'Ethan Shalauddin\u2019s code BLA-2026-0003 sits in it, outside the real field \u2014 which is why Andy saw a code and our copy showed the cell empty.'},
    {n:7,sev:'red',t:'The script does not recognise Starfish at all',d:'Missing from the lookup table and matches none of the fallback patterns.'},
    {n:8,sev:'red',t:'Dangerous write fallback: column 37',d:'If the code column is not found the script writes to column 37 anyway. Removed in v2.'},
    {n:9,sev:'amber',t:'One of our test rows is in Andy\u2019s Master view',d:'Visible to the program director. Scheduled for deletion.'}
  ];

  const ACTIVITY=[
    {t:'09:14',m:'Agreement submitted from the Starfish QR code',k:'in'},
    {t:'09:14',m:'Matched on name + date of birth \u2014 no new code issued',k:'ok'},
    {t:'09:14',m:'SCSE added to Shalauddin, Ethan. Code stays BL-2026-0002',k:'ok'},
    {t:'09:15',m:'Held for review: Lopez, Anthony \u2014 same name, two birthdays',k:'hold'},
    {t:'09:22',m:'Missed-2 rule fired: text sent to 7 families in 2 languages',k:'in'},
    {t:'10:02',m:'Tutor check-in task created for Maya R. (Lopez, Anthony)',k:'in'},
    {t:'10:40',m:'ParentSquare export validated: 113 rows, 0 duplicate codes',k:'ok'},
    {t:'11:15',m:'Voice call queued: Rivas, Danna \u2014 3rd missed session',k:'warn'}
  ];
  /* ---- attendance: derived from the roster so codes and counts always agree with the ledger ---- */
  const TUTOR_NAMES=['Maya R.','Priya N.','Daniel O.','Grace T.','Tarek E.'];
  const featured=['Anthony','Ethan','Annabella','Danna','Mia'].map(n=>families.find(f=>f.real&&f.first===n)).filter(Boolean);
  const rest=families.filter(f=>f.missed>=2&&!featured.includes(f)).sort((a,b)=>b.missed-a.missed);
  const ATT=featured.concat(rest).slice(0,6).map((f,i)=>{
    const m=Math.min(f.missed,5);
    return {sch:f.last+', '+f.first, code:(f.codes&&f.codes[0])||'—', tutor:TUTOR_NAMES[i%5], missed:f.missed, of:f.sessions,
      streak:Math.max(0,6-m), state:m>=5?'red':m>=3?'amber':'green',
      rule:m>=5?"On Andy's Friday list":m>=4?'Escalated — tutor check-in':m>=3?'Voice call queued':m>=2?'Text sent 9:00am':'None needed'};
  });
  /* ---- per-program counts, computed once, used by every screen ---- */
  const perProgram=PROGRAMS.map(p=>({id:p.id,name:p.name,
    families:families.filter(f=>f.progs.includes(p.id)).length,
    coded:families.filter(f=>f.progs.includes(p.id)&&f.codes&&f.codes[0]).length,
    rows:p.families})).filter(p=>p.families>0);
  const SEG_COUNT={ all:families.length, missed2:families.filter(f=>f.missed>=2).length,
    uncoded:families.filter(f=>!(f.codes&&f.codes[0])).length };
  function audience(keys){
    const set=new Set();
    keys.forEach(k=>{
      const add = k==='all'?families : k==='missed2'?families.filter(f=>f.missed>=2)
        : k==='uncoded'?families.filter(f=>!(f.codes&&f.codes[0])) : families.filter(f=>f.progs.includes(k));
      add.forEach(f=>set.add(f.id));
    });
    return set.size;
  }
  return {PROGRAMS,LANGS,SCHOOLS,families,TEST,STATS,MESSAGES,ATT,TUTORS,DEFECTS,ACTIVITY,perProgram,SEG_COUNT,audience,
    find:q=>{q=(q||'').trim().toLowerCase(); if(!q)return [];
      return families.filter(f=>{
        const codes=(f.codes||[]).join(' ').toLowerCase();
        return codes.includes(q)||f.last.toLowerCase().includes(q)||f.first.toLowerCase().includes(q)
          ||f.dob.includes(q)||f.phone.includes(q)||f.progs.join(' ').includes(q)||f.school.toLowerCase().includes(q);
      }).slice(0,8);}};
})();
