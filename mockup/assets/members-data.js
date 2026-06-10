/* members-data.js — source of truth for all member data
   Exposes: window.MEMBERS, window.INVITES, window.COLUMN_DEFS
-----------------------------------------------------------------*/

(function () {

  // ── Seeded RNG (consistent on every reload) ───────────────────
  function seededRand(seed) {
    let s = seed >>> 0;
    return function () {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 0x100000000;
    };
  }
  const rand = seededRand(2026);
  function pick(arr)            { return arr[Math.floor(rand() * arr.length)]; }
  function randInt(min, max)    { return min + Math.floor(rand() * (max - min + 1)); }
  function randBool(p)          { return rand() < (p == null ? 0.5 : p); }
  function randDate(y0, y1)     { const y = randInt(y0,y1), m = randInt(1,12), d = randInt(1,28); return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
  function initials(n)          { return n.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase(); }

  // ── Reference pools ───────────────────────────────────────────
  const FIRST = ['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Barbara','David','Elizabeth','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen','Christopher','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley','Steven','Dorothy','Paul','Kimberly','Andrew','Emily','Joshua','Donna','Kenneth','Michelle','Kevin','Carol','Brian','Amanda','George','Melissa','Timothy','Deborah'];
  const LAST  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts'];
  const DEPTS = ['Engineering','Design','Product','Marketing','Sales','Finance','HR','Operations','Legal','Customer Success','Data','Security'];
  const TITLES = {
    Admin:   ['VP of Engineering','HR Director','Director of Operations','Chief of Staff','IT Director'],
    Manager: ['Engineering Manager','Product Manager','Design Manager','Marketing Manager','Sales Manager','Team Lead'],
    Member:  ['Software Engineer','Senior Engineer','Frontend Developer','Backend Developer','Product Designer','UX Designer','Data Analyst','Marketing Specialist','Sales Rep','Account Manager','DevOps Engineer','QA Engineer','Business Analyst','Content Writer','CS Manager'],
    Viewer:  ['Finance Analyst','External Consultant','Auditor','Board Member'],
  };
  const REAL_DOMAIN = 'hubstaff.com';
  const GHOST_DOMAIN = 'hubstaff.corp';
  const COUNTRIES = ['US','US','US','US','CA','CA','GB','DE','AU','IN','BR'];
  const STATES    = ['California','Texas','New York','Florida','Washington','Illinois','Georgia','Colorado','Arizona','Ontario','England','Bavaria'];
  const COLORS    = ['#0168DD','#7C3AED','#059669','#D97706','#DC2626','#0891B2','#BE185D','#65A30D','#EA580C','#6366F1'];
  const SS_FREQS  = ['Every 5 min','Every 10 min','Every 15 min','Every 30 min',null];
  const PAY_FREQ  = ['Hourly','Weekly','Bi-weekly','Monthly','Salary'];
  const EMP_TYPES = ['Employee','Contractor','Part-time','Intern'];
  const WORK_ARR  = ['Remote','In-office','Hybrid'];
  const TAX_TYPES = ['W-2','1099','VAT','PAYE'];
  const CURRENCIES= ['USD','USD','USD','CAD','GBP','EUR','AUD'];
  const TEAMS     = ['Engineering','Design','Product','Marketing','Sales','Finance','HR','Operations','Data','Security'];
  const COMPUTERS = ['MacBook-Pro-14','MacBook-Air-M2','MacBook-Pro-16','ThinkPad-X1-Carbon','Dell-XPS-15','Surface-Pro-9','HP-EliteBook-840','Ubuntu-Workstation','Windows-Dev-PC','iMac-24'];
  const SIGN_IN_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun'];
  const SIGN_IN_MINS   = ['00','15','30','45'];

  // ── Generator ─────────────────────────────────────────────────
  function genMember(id) {
    const fn    = pick(FIRST), ln = pick(LAST), name = `${fn} ${ln}`;
    const role  = pick(['Member','Member','Member','Member','Manager','Viewer']);
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${REAL_DOMAIN}`;
    const da    = randDate(2020, 2025);
    const pr    = randInt(20, 90);
    const br    = Math.round(pr * (1.5 + rand()));
    const wh    = pick([20,30,40,40,40,45,50]);
    const dh    = pick([6,8,8,8,9,10,null]);
    const ssf   = pick(SS_FREQS);
    const st    = pick(['active','active','active','active','inactive']);
    return {
      id, name, initials: initials(name), avatarColor: pick(COLORS),
      info: {
        identity:        { employeeId: `EMP-${String(id).padStart(4,'0')}`, birthday: randDate(1970,2000), ipAddress: `${randInt(10,192)}.${randInt(0,255)}.${randInt(0,255)}.${randInt(1,254)}` },
        workContact:     { email, phone: `+1 ${randInt(200,999)} ${randInt(100,999)} ${randInt(1000,9999)}`, state: pick(STATES), country: pick(COUNTRIES) },
        personalContact: { email: `${fn.toLowerCase()}${randInt(1,99)}@gmail.com`, phone: `+1 ${randInt(200,999)} ${randInt(100,999)} ${randInt(1000,9999)}`, state: pick(STATES), country: pick(COUNTRIES) },
      },
      employment: {
        jobDetails:    { jobTitle: pick(TITLES[role]||TITLES.Member), jobType: pick(['Full-time','Part-time','Contract']), department: pick(DEPTS) },
        hiringDetails: { employmentType: pick(EMP_TYPES), workArrangement: pick(WORK_ARR), employedThrough: pick(['Direct','Vendor','EOR']), vendorName: randBool(0.15) ? `${pick(['Acme','Global','Tech','Pro'])} ${pick(['Solutions','Partners','Services'])}` : null },
        accounting:    { taxId: `${randInt(100,999)}-${randInt(10,99)}-${randInt(1000,9999)}`, taxType: pick(TAX_TYPES), accountCode: `ACC-${randInt(100,999)}`, currency: pick(CURRENCIES) },
        timeline:      { startDate: da, endDate: null, terminationReason: null, comment: null },
      },
      workEmail: email, status: st, role, team: pick(TEAMS), accountType: 'silent',
      projects:     randInt(0, 12),
      workOrders:   randInt(0, 8),
      payment:      { payRate: pr, billRate: br, frequency: pick(PAY_FREQ) },
      limits:       { weeklyHours: wh, dailyHours: dh },
      screenshots:  { frequency: ssf, count: randInt(0,450), active: ssf !== null },
      appsAndUrls:  { tracked: randBool(0.7), count: randInt(0,250) },
      timeTracking: { enabled: role === 'Viewer' ? false : randBool(0.8), weeklyLimit: wh, dailyLimit: dh, approvals: randBool(0.3) },
      dateAdded: da, dateRemoved: null,
      billing: role === 'Viewer' ? 'viewer' : pick(['billed','billed','billed','billed','unbilled']),
      graceDays: null, mergeSuggestion: false,
      computer: (function() {
        const compName  = COMPUTERS[id % COMPUTERS.length];
        const osUser    = (fn[0] + ln).toLowerCase().replace(/[^a-z0-9]/g, '');
        const siDay     = (id * 7 + 3) % 28 + 1;
        const siHour24  = (id * 3 + 8) % 10 + 8;
        const siMin     = SIGN_IN_MINS[id % 4];
        const siAmPm    = siHour24 >= 12 ? 'PM' : 'AM';
        const siHour12  = siHour24 > 12 ? siHour24 - 12 : siHour24;
        const siMonth   = SIGN_IN_MONTHS[id % 6];
        return { linkedTo: [compName], osUsername: osUser, lastSignIn: `${siMonth} ${siDay}, 2026 at ${siHour12}:${siMin} ${siAmPm}` };
      })(),
    };
  }

  // ── Hand-crafted members ──────────────────────────────────────
  const HAND_CRAFTED = [
    {
      id:1, name:'Sarah Mitchell', initials:'SM', avatarColor:'#0168DD', computer:{ linkedTo:['MacBook-Pro-Engineering-Workstation-2024-M3-Max'], osUsername:'smitchell', lastSignIn:'Jun 5, 2026 at 8:30 AM' },
      info:{ identity:{ employeeId:'EMP-0001', birthday:'1988-03-15', ipAddress:'192.168.1.10' }, workContact:{ email:'sarah.mitchell@hubstaff.com', phone:'+1 415 555 0101', state:'California', country:'US' }, personalContact:{ email:'sarah.m@gmail.com', phone:'+1 415 555 0202', state:'California', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'VP of Engineering', jobType:'Full-time', department:'Engineering' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Remote', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'123-45-6789', taxType:'W-2', accountCode:'ACC-001', currency:'USD' }, timeline:{ startDate:'2020-01-15', endDate:null, terminationReason:null, comment:null } },
      workEmail:'sarah.mitchell@hubstaff.com', status:'active', role:'Admin', team:'Engineering', accountType:'standard',
      projects:8, workOrders:0, payment:{ payRate:95, billRate:150, frequency:'Salary' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:'Every 10 min', count:342, active:true }, appsAndUrls:{ tracked:true, count:87 }, timeTracking:{ enabled:true, weeklyLimit:40, dailyLimit:8, approvals:true }, dateAdded:'2020-01-15', dateRemoved:null, billing:'billed', graceDays:null, mergeSuggestion:false,
    },
    {
      id:2, name:'James Rodriguez', initials:'JR', avatarColor:'#7C3AED', computer:{ linkedTo:['ThinkPad-X1-Carbon'], osUsername:'jrodriguez', lastSignIn:'Jun 5, 2026 at 9:05 AM' },
      info:{ identity:{ employeeId:'EMP-0002', birthday:'1990-07-22', ipAddress:'192.168.1.11' }, workContact:{ email:'james.rodriguez@hubstaff.com', phone:'+1 512 555 0103', state:'Texas', country:'US' }, personalContact:{ email:'jrodriguez@gmail.com', phone:'+1 512 555 0104', state:'Texas', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Engineering Manager', jobType:'Full-time', department:'Engineering' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Hybrid', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'234-56-7890', taxType:'W-2', accountCode:'ACC-002', currency:'USD' }, timeline:{ startDate:'2022-11-01', endDate:null, terminationReason:null, comment:null } },
      workEmail:'james.rodriguez@hubstaff.com', status:'active', role:'Manager', team:'Engineering', accountType:'standard',
      projects:5, workOrders:0, payment:{ payRate:75, billRate:120, frequency:'Salary' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:'Every 5 min', count:198, active:true }, appsAndUrls:{ tracked:true, count:64 }, timeTracking:{ enabled:true, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2022-11-01', dateRemoved:null, billing:'billed', graceDays:null, mergeSuggestion:false,
    },
    {
      id:3, name:'Emily Chen', initials:'EC', avatarColor:'#059669', computer:{ linkedTo:['MacBook-Pro-16'], osUsername:'echen', lastSignIn:'Jun 5, 2026 at 7:45 AM' },
      info:{ identity:{ employeeId:'EMP-0003', birthday:'1993-02-10', ipAddress:'192.168.1.12' }, workContact:{ email:'emily.chen@hubstaff.com', phone:'+1 206 555 0105', state:'Washington', country:'US' }, personalContact:{ email:'emilyc@gmail.com', phone:'+1 206 555 0106', state:'Washington', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Product Designer', jobType:'Full-time', department:'Design' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Remote', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'345-67-8901', taxType:'W-2', accountCode:'ACC-003', currency:'USD' }, timeline:{ startDate:'2024-01-08', endDate:null, terminationReason:null, comment:null } },
      workEmail:'emily.chen@hubstaff.com', status:'active', role:'Member', team:'Design', accountType:'standard',
      projects:3, workOrders:0, payment:{ payRate:60, billRate:95, frequency:'Hourly' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:'Every 10 min', count:156, active:true }, appsAndUrls:{ tracked:true, count:43 }, timeTracking:{ enabled:true, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2024-01-08', dateRemoved:null, billing:'billed', graceDays:null, mergeSuggestion:false,
    },
    {
      id:4, name:'DavidKim@', initials:'DK', avatarColor:'#D97706', computer:{ linkedTo:['Windows-PC-Eng', 'MacBook-Air-M2', 'Ubuntu-Workstation-Dev-Box-2024'], osUsername:'dkim', lastSignIn:'Jun 4, 2026 at 4:30 PM' },
      info:{ identity:{ employeeId:'EMP-0004', birthday:'1991-11-30', ipAddress:'192.168.1.13' }, workContact:{ email:'david.kim@hubstaff.corp', phone:'+1 213 555 0107', state:'California', country:'US' }, personalContact:{ email:'dkim91@gmail.com', phone:'+1 213 555 0108', state:'California', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Backend Engineer', jobType:'Full-time', department:'Engineering' }, hiringDetails:{ employmentType:'Employee', workArrangement:'In-office', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'456-78-9012', taxType:'W-2', accountCode:'ACC-004', currency:'USD' }, timeline:{ startDate:'2023-03-20', endDate:null, terminationReason:null, comment:null } },
      workEmail:'david.kim@hubstaff.corp', status:'active', role:'Member', team:'Engineering', accountType:'silent',
      projects:4, workOrders:0, payment:{ payRate:65, billRate:100, frequency:'Hourly' }, limits:{ weeklyHours:40, dailyHours:9 }, screenshots:{ frequency:'Every 5 min', count:289, active:true }, appsAndUrls:{ tracked:true, count:72 }, timeTracking:{ enabled:true, weeklyLimit:40, dailyLimit:9, approvals:false }, dateAdded:'2023-03-20', dateRemoved:null, billing:'unbilled', graceDays:10, mergeSuggestion:false,
    },
    {
      id:5, name:'AmandaFoster@', initials:'AF', avatarColor:'#DC2626', computer:{ linkedTo:['Surface-Pro-9'], osUsername:'afoster', lastSignIn:'Jun 2, 2026 at 1:45 PM' },
      info:{ identity:{ employeeId:'EMP-0005', birthday:'1995-06-14', ipAddress:'192.168.1.14' }, workContact:{ email:'amanda.foster@hubstaff.corp', phone:'+1 312 555 0109', state:'Illinois', country:'US' }, personalContact:{ email:'afoster@gmail.com', phone:'+1 312 555 0110', state:'Illinois', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Marketing Specialist', jobType:'Full-time', department:'Marketing' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Hybrid', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'567-89-0123', taxType:'W-2', accountCode:'ACC-005', currency:'USD' }, timeline:{ startDate:'2021-07-12', endDate:null, terminationReason:null, comment:null } },
      workEmail:'amanda.foster@hubstaff.corp', status:'active', role:'Member', team:'Marketing', accountType:'standard',
      projects:6, workOrders:0, payment:{ payRate:45, billRate:70, frequency:'Bi-weekly' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:'Every 15 min', count:112, active:true }, appsAndUrls:{ tracked:true, count:38 }, timeTracking:{ enabled:true, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2021-07-12', dateRemoved:null, billing:'billed', graceDays:null, mergeSuggestion:false,
    },
    {
      id:11, name:'SarahMitchell@', initials:'SM', avatarColor:'#0168DD', computer:{ linkedTo:['MacBook-Pro-Corp'], osUsername:'sarah.mitchell', lastSignIn:'Jun 1, 2026 at 9:43 AM' },
      info:{ identity:{ employeeId:'EMP-0011', birthday:null, ipAddress:'192.168.1.110' }, workContact:{ email:'sarah.mitchell@hubstaff.corp', phone:null, state:null, country:null }, personalContact:{ email:null, phone:null, state:null, country:null } },
      employment:{ jobDetails:{ jobTitle:null, jobType:null, department:null }, hiringDetails:{ employmentType:null, workArrangement:null, employedThrough:null, vendorName:null }, accounting:{ taxId:null, taxType:null, accountCode:null, currency:null }, timeline:{ startDate:null, endDate:null, terminationReason:null, comment:null } },
      workEmail:'sarah.mitchell@hubstaff.corp', status:'active', role:'Member', team:'Engineering', accountType:'silent',
      projects:0, workOrders:0, payment:{ payRate:null, billRate:null, frequency:null }, limits:{ weeklyHours:null, dailyHours:null }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:null, dailyLimit:null, approvals:false }, dateAdded:'2026-06-01', dateRemoved:null, billing:'unbilled', graceDays:10, mergeSuggestion:true, mergeIntoId:1,
    },
    {
      id:12, name:'JamesRodriguez@', initials:'JR', avatarColor:'#7C3AED', computer:{ linkedTo:['Windows-PC-Corp'], osUsername:'james.r', lastSignIn:'Jun 1, 2026 at 10:12 AM' },
      info:{ identity:{ employeeId:'EMP-0012', birthday:null, ipAddress:'192.168.1.111' }, workContact:{ email:'james.rodriguez@hubstaff.corp', phone:null, state:null, country:null }, personalContact:{ email:null, phone:null, state:null, country:null } },
      employment:{ jobDetails:{ jobTitle:null, jobType:null, department:null }, hiringDetails:{ employmentType:null, workArrangement:null, employedThrough:null, vendorName:null }, accounting:{ taxId:null, taxType:null, accountCode:null, currency:null }, timeline:{ startDate:null, endDate:null, terminationReason:null, comment:null } },
      workEmail:'james.rodriguez@hubstaff.corp', status:'active', role:'Member', team:'Engineering', accountType:'silent',
      projects:0, workOrders:0, payment:{ payRate:null, billRate:null, frequency:null }, limits:{ weeklyHours:null, dailyHours:null }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:null, dailyLimit:null, approvals:false }, dateAdded:'2026-06-01', dateRemoved:null, billing:'unbilled', graceDays:10, mergeSuggestion:true, mergeIntoId:2,
    },
    {
      id:13, name:'EmilyChen@', initials:'EC', avatarColor:'#059669', computer:{ linkedTo:['iMac-Design-Corp'], osUsername:'emily.chen', lastSignIn:'Jun 1, 2026 at 11:20 AM' },
      info:{ identity:{ employeeId:'EMP-0013', birthday:null, ipAddress:'192.168.1.112' }, workContact:{ email:'emily.chen@hubstaff.corp', phone:null, state:null, country:null }, personalContact:{ email:null, phone:null, state:null, country:null } },
      employment:{ jobDetails:{ jobTitle:null, jobType:null, department:null }, hiringDetails:{ employmentType:null, workArrangement:null, employedThrough:null, vendorName:null }, accounting:{ taxId:null, taxType:null, accountCode:null, currency:null }, timeline:{ startDate:null, endDate:null, terminationReason:null, comment:null } },
      workEmail:'emily.chen@hubstaff.corp', status:'active', role:'Member', team:'Design', accountType:'silent',
      projects:0, workOrders:0, payment:{ payRate:null, billRate:null, frequency:null }, limits:{ weeklyHours:null, dailyHours:null }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:null, dailyLimit:null, approvals:false }, dateAdded:'2026-06-01', dateRemoved:null, billing:'unbilled', graceDays:10, mergeSuggestion:true, mergeIntoId:3,
    },
    {
      id:6, name:'Lisa Johnson', initials:'LJ', avatarColor:'#6B7280', computer:{ linkedTo:['MacBook-Air-M1'], osUsername:'ljohnson', lastSignIn:'May 28, 2026 at 11:00 AM' },
      info:{ identity:{ employeeId:'EMP-0006', birthday:'1987-09-25', ipAddress:'192.168.1.15' }, workContact:{ email:'lisa.johnson@company.com', phone:'+1 617 555 0111', state:'New York', country:'US' }, personalContact:{ email:'ljohnson@gmail.com', phone:'+1 617 555 0112', state:'New York', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Senior Designer', jobType:'Full-time', department:'Design' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Remote', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'678-90-1234', taxType:'W-2', accountCode:'ACC-006', currency:'USD' }, timeline:{ startDate:'2019-04-03', endDate:null, terminationReason:null, comment:null } },
      workEmail:'lisa.johnson@company.com', status:'inactive', role:'Member', team:'Design', accountType:'standard',
      projects:2, workOrders:0, payment:{ payRate:55, billRate:85, frequency:'Monthly' }, limits:{ weeklyHours:30, dailyHours:6 }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:30, dailyLimit:6, approvals:false }, dateAdded:'2019-04-03', dateRemoved:null, billing:'billed', graceDays:null, mergeSuggestion:false,
    },
    {
      id:7, name:'Michael Torres', initials:'MT', avatarColor:'#0891B2', computer:{ linkedTo:['Ubuntu-Workstation'], osUsername:'mtorres', lastSignIn:'Jun 4, 2026 at 3:45 PM' },
      info:{ identity:{ employeeId:'EMP-0007', birthday:'1992-12-08', ipAddress:'192.168.1.16' }, workContact:{ email:'michael.torres@company.com', phone:'+1 303 555 0113', state:'Colorado', country:'US' }, personalContact:{ email:'mtorres@gmail.com', phone:'+1 303 555 0114', state:'Colorado', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'DevOps Engineer', jobType:'Full-time', department:'Engineering' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Remote', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'789-01-2345', taxType:'W-2', accountCode:'ACC-007', currency:'USD' }, timeline:{ startDate:'2023-09-15', endDate:null, terminationReason:null, comment:null } },
      workEmail:'michael.torres@company.com', status:'grace', role:'Member', team:'Engineering', accountType:'silent',
      projects:3, workOrders:0, payment:{ payRate:70, billRate:110, frequency:'Hourly' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:'Every 5 min', count:87, active:true }, appsAndUrls:{ tracked:true, count:51 }, timeTracking:{ enabled:true, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2023-09-15', dateRemoved:null, billing:'grace', graceDays:14, mergeSuggestion:false,
    },
    {
      id:8, name:'Robert Smith', initials:'RS', avatarColor:'#7C3AED', computer:{ linkedTo:['ThinkPad-T14'], osUsername:'rsmith', lastSignIn:'Jun 2, 2026 at 9:30 AM' },
      info:{ identity:{ employeeId:'EMP-0008', birthday:'1985-04-17', ipAddress:'192.168.1.17' }, workContact:{ email:'robert.smith@company.com', phone:'+1 404 555 0115', state:'Georgia', country:'US' }, personalContact:{ email:'rsmith@gmail.com', phone:'+1 404 555 0116', state:'Georgia', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Data Analyst', jobType:'Full-time', department:'Data' }, hiringDetails:{ employmentType:'Employee', workArrangement:'In-office', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'890-12-3456', taxType:'W-2', accountCode:'ACC-008', currency:'USD' }, timeline:{ startDate:'2022-06-01', endDate:null, terminationReason:null, comment:null } },
      workEmail:'robert.smith@company.com', status:'grace', role:'Member', team:'Data', accountType:'silent',
      projects:2, workOrders:0, payment:{ payRate:50, billRate:80, frequency:'Bi-weekly' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:'Every 10 min', count:43, active:true }, appsAndUrls:{ tracked:true, count:29 }, timeTracking:{ enabled:true, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2022-06-01', dateRemoved:null, billing:'grace', graceDays:8, mergeSuggestion:false,
    },
    {
      id:9, name:'Alex Patel', initials:'AP', avatarColor:'#6366F1',
      info:{ identity:{ employeeId:'EMP-0009', birthday:'1997-08-20', ipAddress:null }, workContact:{ email:'alex.patel@company.com', phone:null, state:'New York', country:'US' }, personalContact:{ email:'alexpatel@gmail.com', phone:null, state:'New York', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Frontend Developer', jobType:'Full-time', department:'Engineering' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Remote', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:null, taxType:null, accountCode:null, currency:'USD' }, timeline:{ startDate:null, endDate:null, terminationReason:null, comment:null } },
      workEmail:'alex.patel@company.com', status:'invited', role:'Member', team:'Engineering', accountType:'standard',
      projects:0, workOrders:0, payment:{ payRate:null, billRate:null, frequency:null }, limits:{ weeklyHours:null, dailyHours:null }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:null, dailyLimit:null, approvals:false }, dateAdded:'2026-05-20', dateRemoved:null, billing:'unbilled', graceDays:22, mergeSuggestion:false,
    },
    {
      id:10, name:'Maria Garcia', initials:'MG', avatarColor:'#BE185D',
      info:{ identity:{ employeeId:'EMP-0010', birthday:'1986-01-09', ipAddress:'192.168.1.20' }, workContact:{ email:'maria.garcia@company.com', phone:'+1 305 555 0117', state:'Florida', country:'US' }, personalContact:{ email:'mariagarcia@gmail.com', phone:'+1 305 555 0118', state:'Florida', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'HR Director', jobType:'Full-time', department:'HR' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Hybrid', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'901-23-4567', taxType:'W-2', accountCode:'ACC-010', currency:'USD' }, timeline:{ startDate:'2018-03-01', endDate:null, terminationReason:null, comment:null } },
      workEmail:'maria.garcia@company.com', status:'active', role:'Admin', team:'HR', accountType:'sso',
      projects:7, workOrders:0, payment:{ payRate:90, billRate:140, frequency:'Salary' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:'Every 15 min', count:421, active:true }, appsAndUrls:{ tracked:true, count:95 }, timeTracking:{ enabled:true, weeklyLimit:40, dailyLimit:8, approvals:true }, dateAdded:'2018-03-01', dateRemoved:null, billing:'billed', graceDays:null, mergeSuggestion:false,
    },
    {
      id:101, name:'Chris Wallace', initials:'CW', avatarColor:'#0891B2',
      info:{ identity:{ employeeId:'EMP-0101', birthday:'1989-05-12', ipAddress:'192.168.2.10' }, workContact:{ email:'chris.wallace@hubstaff.com', phone:'+1 720 555 0201', state:'Colorado', country:'US' }, personalContact:{ email:'cwallace@gmail.com', phone:'+1 720 555 0202', state:'Colorado', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Backend Developer', jobType:'Full-time', department:'Engineering' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Remote', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'111-22-3333', taxType:'W-2', accountCode:'ACC-101', currency:'USD' }, timeline:{ startDate:'2021-03-01', endDate:'2025-11-30', terminationReason:'Voluntary resignation', comment:null } },
      workEmail:'chris.wallace@hubstaff.com', status:'removed', role:'Member', team:'Engineering', accountType:'standard',
      projects:0, workOrders:0, payment:{ payRate:65, billRate:100, frequency:'Hourly' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2021-03-01', dateRemoved:'2025-11-30', billing:'unbilled', graceDays:null, mergeSuggestion:false,
    },
    {
      id:102, name:'Nina Larsen', initials:'NL', avatarColor:'#BE185D',
      info:{ identity:{ employeeId:'EMP-0102', birthday:'1991-08-22', ipAddress:'192.168.2.11' }, workContact:{ email:'nina.larsen@hubstaff.com', phone:'+1 503 555 0203', state:'Oregon', country:'US' }, personalContact:{ email:'nlarsen@gmail.com', phone:'+1 503 555 0204', state:'Oregon', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Marketing Manager', jobType:'Full-time', department:'Marketing' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Hybrid', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'222-33-4444', taxType:'W-2', accountCode:'ACC-102', currency:'USD' }, timeline:{ startDate:'2020-07-15', endDate:'2025-10-15', terminationReason:'End of contract', comment:null } },
      workEmail:'nina.larsen@hubstaff.com', status:'removed', role:'Manager', team:'Marketing', accountType:'standard',
      projects:0, workOrders:0, payment:{ payRate:72, billRate:115, frequency:'Salary' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2020-07-15', dateRemoved:'2025-10-15', billing:'unbilled', graceDays:null, mergeSuggestion:false,
    },
    {
      id:103, name:'Tom Okafor', initials:'TO', avatarColor:'#059669',
      info:{ identity:{ employeeId:'EMP-0103', birthday:'1994-02-03', ipAddress:'192.168.2.12' }, workContact:{ email:'tom.okafor@hubstaff.com', phone:'+1 214 555 0205', state:'Texas', country:'US' }, personalContact:{ email:'tokafor@gmail.com', phone:'+1 214 555 0206', state:'Texas', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'QA Engineer', jobType:'Full-time', department:'Engineering' }, hiringDetails:{ employmentType:'Contractor', workArrangement:'Remote', employedThrough:'Vendor', vendorName:'TechStaff Solutions' }, accounting:{ taxId:'333-44-5555', taxType:'1099', accountCode:'ACC-103', currency:'USD' }, timeline:{ startDate:'2022-09-01', endDate:'2026-01-10', terminationReason:'Contract ended', comment:null } },
      workEmail:'tom.okafor@hubstaff.com', status:'removed', role:'Member', team:'Engineering', accountType:'silent',
      projects:0, workOrders:0, payment:{ payRate:55, billRate:88, frequency:'Hourly' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2022-09-01', dateRemoved:'2026-01-10', billing:'unbilled', graceDays:null, mergeSuggestion:false,
    },
    {
      id:104, name:'Dana Wright', initials:'DW', avatarColor:'#D97706',
      info:{ identity:{ employeeId:'EMP-0104', birthday:'1988-11-17', ipAddress:'192.168.2.13' }, workContact:{ email:'dana.wright@hubstaff.com', phone:'+1 602 555 0207', state:'Arizona', country:'US' }, personalContact:{ email:'dwright@gmail.com', phone:'+1 602 555 0208', state:'Arizona', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Sales Rep', jobType:'Full-time', department:'Sales' }, hiringDetails:{ employmentType:'Employee', workArrangement:'In-office', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'444-55-6666', taxType:'W-2', accountCode:'ACC-104', currency:'USD' }, timeline:{ startDate:'2019-11-01', endDate:'2025-09-01', terminationReason:'Voluntary resignation', comment:null } },
      workEmail:'dana.wright@hubstaff.com', status:'removed', role:'Member', team:'Sales', accountType:'standard',
      projects:0, workOrders:0, payment:{ payRate:48, billRate:75, frequency:'Bi-weekly' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2019-11-01', dateRemoved:'2025-09-01', billing:'unbilled', graceDays:null, mergeSuggestion:false,
    },
    {
      id:105, name:'Marcus Reeves', initials:'MR', avatarColor:'#6366F1',
      info:{ identity:{ employeeId:'EMP-0105', birthday:'1986-04-29', ipAddress:'192.168.2.14' }, workContact:{ email:'marcus.reeves@hubstaff.com', phone:'+1 312 555 0209', state:'Illinois', country:'US' }, personalContact:{ email:'mreeves@gmail.com', phone:'+1 312 555 0210', state:'Illinois', country:'US' } },
      employment:{ jobDetails:{ jobTitle:'Finance Analyst', jobType:'Full-time', department:'Finance' }, hiringDetails:{ employmentType:'Employee', workArrangement:'Hybrid', employedThrough:'Direct', vendorName:null }, accounting:{ taxId:'555-66-7777', taxType:'W-2', accountCode:'ACC-105', currency:'USD' }, timeline:{ startDate:'2020-05-18', endDate:'2026-02-28', terminationReason:'Layoff', comment:null } },
      workEmail:'marcus.reeves@hubstaff.com', status:'removed', role:'Viewer', team:'Finance', accountType:'standard',
      projects:0, workOrders:0, payment:{ payRate:58, billRate:90, frequency:'Monthly' }, limits:{ weeklyHours:40, dailyHours:8 }, screenshots:{ frequency:null, count:0, active:false }, appsAndUrls:{ tracked:false, count:0 }, timeTracking:{ enabled:false, weeklyLimit:40, dailyLimit:8, approvals:false }, dateAdded:'2020-05-18', dateRemoved:'2026-02-28', billing:'unbilled', graceDays:null, mergeSuggestion:false,
    },
  ];

  // ── Generate remaining 90 members ────────────────────────────
  const GENERATED = [];
  for (let i = 11; i <= 100; i++) {
    const m = genMember(i);
    if (i % 13 === 0) { m.status = 'grace'; m.billing = 'grace'; m.graceDays = randInt(1,16); }
    else if (m.billing === 'unbilled') { m.graceDays = randInt(5, 30); }
    GENERATED.push(m);
  }

  window.MEMBERS = [...HAND_CRAFTED, ...GENERATED];

  // ── Invites ──────────────────────────────────────────────────
  window.INVITES = [
    { id:'inv-1', name:'Taylor Brooks',  email:'taylor.brooks@company.com',  initials:'TB', avatarColor:'#6366F1', role:'Member',  invitedBy:'Sarah Mitchell', invitedAt:'2026-05-15', status:'pending', expiresAt:'2026-05-29' },
    { id:'inv-2', name:'Jordan Casey',   email:'jordan.casey@company.com',   initials:'JC', avatarColor:'#0891B2', role:'Manager', invitedBy:'Maria Garcia',   invitedAt:'2026-05-10', status:'pending', expiresAt:'2026-05-24' },
    { id:'inv-3', name:'Sam Nguyen',     email:'sam.nguyen@company.com',     initials:'SN', avatarColor:'#D97706', role:'Member',  invitedBy:'Sarah Mitchell', invitedAt:'2026-04-28', status:'expired', expiresAt:'2026-05-12' },
  ];

  // ── Column definitions ────────────────────────────────────────
  window.COLUMN_DEFS = [
    { id:'member',       label:'Member',        always:true },
    { id:'info',         label:'Info',          visible:false, flyout:true },
    { id:'employment',   label:'Employment',    visible:false, flyout:true },
    { id:'role',         label:'Role',          key:'role',         visible:true  },
    { id:'team',         label:'Team',          key:'team',         visible:true  },
    { id:'projects',     label:'Projects',      key:'projects',     visible:true  },
    { id:'workOrders',   label:'Work Orders',   key:'workOrders',   visible:true  },
    { id:'payRate',      label:'Pay rate',      key:'payRate',      visible:true  },
    { id:'billRate',     label:'Bill rate',     key:'billRate',     visible:true  },
    { id:'limits',       label:'Limits',        key:'limits',       visible:true  },
    { id:'billing',      label:'Billing',       key:'billing',      visible:true  },
    { id:'accountType',  label:'Account type',  key:'accountType',  visible:true  },
    { id:'timeTracking', label:'Time tracking', key:'timeTracking', visible:true  },
    { id:'screenshots',  label:'Screenshots',   key:'screenshots',  visible:true },
    { id:'appsUrls',     label:'Apps & URLs',   key:'appsAndUrls',  visible:true },
    { id:'dateAdded',    label:'Date added',    key:'dateAdded',    visible:true  },
    { id:'actions',      label:'Actions',       always:true },
  ];

})();
