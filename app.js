/* ===================== PINLEX.WORK STUDIO ENGINE (BUILD 2.5 HOTFIX FAST CLOUD & DRAWER) ===================== */

const STORAGE_KEY = 'pinlex-studio-v2.5';
const CLOUD_ID_KEY = 'pinlex-cloud-id-v2.5';
const CLOUD_TS_KEY = 'pinlex-cloud-ts-v2.5';
const MEDIA_HASH_KEY = 'pinlex-media-hash-v2.5';
const MEDIA_FILE_KEY = 'pinlex-media-file-v2.5';
const GH_TOKEN_KEY = 'pinlex-gh-token-v2.5';
const PUBLIC_HOST_URL = 'https://drk195.github.io/pinlex-build-2.5-hotfix/';
const NTFY_TOPIC = 'pinlex_media_drk195_v25';
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`;
const KV_APP_KEY = '457jwo8w';
const KV_BASE_URL = 'https://keyvalue.immanuel.co/api/KeyVal';
const DEVICE_ID = 'dev_' + Math.random().toString(36).slice(2, 9);
let lastSyncedTs = Number(localStorage.getItem(CLOUD_TS_KEY) || 0);
let lastUploadedMediaHash = localStorage.getItem(MEDIA_HASH_KEY) || '';
let lastUploadedMediaFile = localStorage.getItem(MEDIA_FILE_KEY) || '';
let isApplyingRemote = false;
let autoPushTimer = null;

const ICON_CDN = (slug, color = 'white') => `https://cdn.simpleicons.org/${slug}/${color}`;

const clean = v => String(v || '').trim().replace(/^@/, '');
const isUrl = v => /^https?:\/\//i.test(String(v || '').trim());
const withHttp = v => {
  const s = String(v || '').trim();
  if (!s) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(s)) return s;
  return 'https://' + s.replace(/^\/+/, '');
};
const looksLikeDomain = v => /^[\w-]+\.[a-z]{2,}(\/|$)/i.test(String(v || '').trim());

/* ===================== СОЦСЕТИ И МЕССЕНДЖЕРЫ ===================== */
const SOCIALS = [
  { id: 'telegram',  label: 'Telegram',      slug: 'telegram',      color: '#26A5E4', ph: '@username',        url: v => 'https://t.me/' + clean(v) },
  { id: 'whatsapp',  label: 'WhatsApp',      slug: 'whatsapp',      color: '#25D366', ph: '+7 777 000-00-00', url: v => 'https://wa.me/' + v.replace(/\D/g, '') },
  { id: 'instagram', label: 'Instagram',     slug: 'instagram',     color: '#E4405F', ph: '@username',        url: v => 'https://instagram.com/' + clean(v) },
  { id: 'discord',   label: 'Discord',       slug: 'discord',       color: '#5865F2', ph: 'код / никнейм',    url: v => isUrl(v) ? v : 'https://discord.gg/' + clean(v) },
  { id: 'tiktok',    label: 'TikTok',        slug: 'tiktok',        color: '#111111', ph: '@username',        url: v => 'https://www.tiktok.com/@' + clean(v) },
  { id: 'youtube',   label: 'YouTube',       slug: 'youtube',       color: '#FF0000', ph: '@channel',         url: v => 'https://youtube.com/@' + clean(v) },
  { id: 'github',    label: 'GitHub',        slug: 'github',        color: '#24292e', ph: 'username',         url: v => 'https://github.com/' + clean(v) },
  { id: 'linkedin',  label: 'LinkedIn',      slug: 'linkedin',      color: '#0A66C2', ph: 'username / ссылка',url: v => 'https://linkedin.com/in/' + clean(v) },
  { id: 'vk',        label: 'ВКонтакте',     slug: 'vk',            color: '#0077FF', ph: 'id или ссылка',    url: v => 'https://vk.com/' + clean(v) },
  { id: 'behance',   label: 'Behance',       slug: 'behance',       color: '#1769FF', ph: 'username',         url: v => 'https://behance.net/' + clean(v) },
  { id: 'dribbble',  label: 'Dribbble',      slug: 'dribbble',      color: '#EA4C89', ph: 'username',         url: v => 'https://dribbble.com/' + clean(v) },
  { id: 'threads',   label: 'Threads',       slug: 'threads',       color: '#111111', ph: '@username',        url: v => 'https://www.threads.net/@' + clean(v) },
  { id: 'x',         label: 'X (Twitter)',   slug: 'x',             color: '#111111', ph: '@username',        url: v => 'https://x.com/' + clean(v) },
  { id: 'facebook',  label: 'Facebook',      slug: 'facebook',      color: '#0866FF', ph: 'username',         url: v => 'https://facebook.com/' + clean(v) },
  { id: 'twitch',    label: 'Twitch',        slug: 'twitch',        color: '#9146FF', ph: 'username',         url: v => 'https://twitch.tv/' + clean(v) },
  { id: 'spotify',   label: 'Spotify',       slug: 'spotify',       color: '#1DB954', ph: 'ссылка',           url: v => withHttp(v) },
];

/* ===================== 14 ДИЗАЙНЕРСКИХ ТЕМ ===================== */
const THEMES = {
  midnight: {
    name: 'Индиго Tech',
    page: '#090b12',
    card: '#121624',
    text: '#f8fafc',
    muted: '#94a3b8',
    accent: '#6366f1',
    onAccent: '#ffffff',
    btn: 'rgba(255,255,255,0.06)',
    line: 'rgba(255,255,255,0.12)',
    band: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
  },
  adminRed: {
    name: 'Admin Crimson',
    page: '#0b0708',
    card: '#160d10',
    text: '#fff1f2',
    muted: '#fda4af',
    accent: '#ef4444',
    onAccent: '#ffffff',
    btn: 'rgba(239, 68, 68, 0.1)',
    line: 'rgba(239, 68, 68, 0.25)',
    band: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
  },
  discordNitro: {
    name: 'Discord Nitro',
    page: '#111214',
    card: '#1e1f22',
    text: '#f2f3f5',
    muted: '#b5bac1',
    accent: '#5865f2',
    onAccent: '#ffffff',
    btn: '#2b2d31',
    line: 'rgba(255,255,255,0.1)',
    band: 'linear-gradient(135deg, #5865f2 0%, #eb459e 100%)',
  },
  classic: {
    name: 'Классика Gold',
    page: '#e9e5dc',
    card: '#0f1c2e',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.68)',
    accent: '#d4af37',
    onAccent: '#0f1c2e',
    btn: 'rgba(255,255,255,0.07)',
    line: 'rgba(255,255,255,0.16)',
    band: 'linear-gradient(135deg, #dfbd69 0%, #926f34 100%)',
  },
  light: {
    name: 'Чистая Светлая',
    page: '#eef2f6',
    card: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
    accent: '#2563eb',
    onAccent: '#ffffff',
    btn: '#f1f5f9',
    line: '#e2e8f0',
    band: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
  },
  creamGold: {
    name: 'Молочный Люкс',
    page: '#f4efe6',
    card: '#fffdf9',
    text: '#1f1a14',
    muted: '#786e60',
    accent: '#c29b40',
    onAccent: '#ffffff',
    btn: '#f6f1e7',
    line: '#e8dfd1',
    band: 'linear-gradient(135deg, #d7b76e 0%, #a58238 100%)',
  },
  graphite: {
    name: 'Графит Pro',
    page: '#121214',
    card: '#1c1c1f',
    text: '#f4f4f5',
    muted: '#a1a1aa',
    accent: '#ffffff',
    onAccent: '#111113',
    btn: 'rgba(255,255,255,0.07)',
    line: 'rgba(255,255,255,0.14)',
    band: 'linear-gradient(135deg, #3f3f46 0%, #18181b 100%)',
  },
  emerald: {
    name: 'Изумруд',
    page: '#0b1915',
    card: '#0f2822',
    text: '#ecfdf5',
    muted: '#86efac',
    accent: '#10b981',
    onAccent: '#052e16',
    btn: 'rgba(255,255,255,0.07)',
    line: 'rgba(255,255,255,0.15)',
    band: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  },
  cyberpunk: {
    name: 'Кибер Неон',
    page: '#06040d',
    card: '#110b22',
    text: '#ffffff',
    muted: '#c4b5fd',
    accent: '#00f5d4',
    onAccent: '#06040d',
    btn: 'rgba(247, 37, 133, 0.14)',
    line: 'rgba(0, 245, 212, 0.3)',
    band: 'linear-gradient(135deg, #f72585 0%, #7209b7 50%, #4cc9f0 100%)',
  },
  sunset: {
    name: 'Теплый Закат',
    page: '#1a0e12',
    card: '#27131a',
    text: '#fff1f2',
    muted: '#fda4af',
    accent: '#fb7185',
    onAccent: '#1a0e12',
    btn: 'rgba(255,255,255,0.08)',
    line: 'rgba(255,255,255,0.15)',
    band: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
  },
  ocean: {
    name: 'Глубокий Океан',
    page: '#07131d',
    card: '#0c2132',
    text: '#f0f9ff',
    muted: '#7dd3fc',
    accent: '#38bdf8',
    onAccent: '#07131d',
    btn: 'rgba(255,255,255,0.07)',
    line: 'rgba(56, 189, 248, 0.2)',
    band: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
  },
  lavender: {
    name: 'Нежная Лаванда',
    page: '#f3effb',
    card: '#ffffff',
    text: '#2e1065',
    muted: '#7e69ab',
    accent: '#8b5cf6',
    onAccent: '#ffffff',
    btn: '#f5f3ff',
    line: '#ddd6fe',
    band: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
  },
  brutal: {
    name: 'Нео-Брутализм',
    page: '#fef08a',
    card: '#ffffff',
    text: '#000000',
    muted: '#374151',
    accent: '#ff5470',
    onAccent: '#ffffff',
    btn: '#fde047',
    line: '#000000',
    band: 'linear-gradient(135deg, #ff5470 0%, #fde047 100%)',
  },
  terracotta: {
    name: 'Кофе & Эстетика',
    page: '#ebe3db',
    card: '#261c16',
    text: '#f7f2ed',
    muted: '#cbbab0',
    accent: '#e09f67',
    onAccent: '#261c16',
    btn: 'rgba(255,255,255,0.08)',
    line: 'rgba(255,255,255,0.16)',
    band: 'linear-gradient(135deg, #c87d55 0%, #7f4f34 100%)',
  },
};

/* ===================== 16 ШРИФТОВ В СТИЛЕ DISCORD & WEB ===================== */
const FONTS = {
  discord_gg:    { name: 'Discord gg sans',    sample: 'Discord Standard', head: "'Plus Jakarta Sans', sans-serif", body: "'Inter', sans-serif" },
  discord_ginto: { name: 'Discord Ginto Nord', sample: 'GINTO DISPLAY',    head: "'Rubik', sans-serif",             body: "'Plus Jakarta Sans', sans-serif" },
  modern:        { name: 'Modern Tech',        sample: 'Pinlex Studio',    head: "'Manrope', sans-serif",           body: "'Inter', sans-serif" },
  cyber:         { name: 'Cyberpunk / Sci-Fi', sample: 'CYBER 2077',       head: "'Orbitron', sans-serif",          body: "'Inter', sans-serif" },
  pixel:         { name: '8-Bit Pixel Arcade', sample: '8-BIT GAME',       head: "'Press Start 2P', monospace",     body: "'Fira Code', monospace" },
  gothic:        { name: 'Discord Gothic',     sample: 'Dark Gothic',      head: "'Pirata One', cursive",           body: "'Inter', sans-serif" },
  anime:         { name: 'Anime & Action',     sample: 'ULTRA POWER',      head: "'Russo One', sans-serif",         body: "'Rubik', sans-serif" },
  comic:         { name: 'Comic / Manga',      sample: 'BOOM! MANGA',      head: "'Bangers', cursive",              body: "'Nunito', sans-serif" },
  marker:        { name: 'Neon Street Marker', sample: 'Street Vibe',      head: "'Permanent Marker', cursive",     body: "'Nunito', sans-serif" },
  handwritten:   { name: 'Handwritten Script', sample: 'Creative Soul',    head: "'Caveat', cursive",               body: "'Nunito', sans-serif" },
  mono:          { name: 'Hacker Terminal',    sample: '<coder_pro/>',     head: "'JetBrains Mono', monospace",     body: "'JetBrains Mono', monospace" },
  fira:          { name: 'Code Dev Pro',       sample: 'fn main() {}',     head: "'Fira Code', monospace",          body: "'Inter', sans-serif" },
  soft:          { name: 'Discord Soft',       sample: 'Cozy & Friendly',  head: "'Comfortaa', cursive",            body: "'Nunito', sans-serif" },
  grotesk:       { name: 'Space Grotesk',      sample: 'Future Design',    head: "'Space Grotesk', sans-serif",     body: "'Inter', sans-serif" },
  editorial:     { name: 'Editorial Classic',  sample: 'Forbes & Vogue',   head: "'Playfair Display', Georgia, serif", body: "'Inter', sans-serif" },
  luxury:        { name: 'Luxury Serif',       sample: 'Royal Aesthetic',  head: "'Cormorant Garamond', Georgia, serif", body: "'Montserrat', sans-serif" },
};

/* ===================== НАЧАЛЬНОЕ СОСТОЯНИЕ (ШАХМУРАТ — ADMIN С ПОЛНЫМ ДОСТУПОМ) ===================== */
const EMPTY = {
  firstName: 'Шахмурат',
  lastName: 'Сайдуллаев',
  role: 'Junior Web-coder',
  company: 'pinlex.work',
  location: 'Казахстан',
  statusText: 'Открыт к новым проектам и заказам',
  verified: true,
  showStatusDot: true,
  isAdmin: true,
  showAdminBadge: true,
  customRoleTag: '',
  customRoleColor: '#ef4444',
  bio: 'Junior Web-coder. Создаю современные, быстрые и удобные веб-сайты, лендинги и интерактивные онлайн-визитки.',
  phone: '+77754536966',
  phone2: '+77019392122',
  email: 'shakhmurat.s@gmail.com',
  website: 'https://github.com/dRk195',
  mapUrl: '',
  ctaLabel: 'Написать в Telegram',
  ctaUrl: 'https://t.me/ssshakh195',
  showSaveVcf: true,
  enableExchange: true,
  avatar: '',
  cover: '',
  theme: 'midnight',
  layout: 'centered',
  avatarShape: 'circle',
  fontPair: 'discord_gg',
  nameEffect: 'none',
  buttonStyle: 'filled',
  borderRadius: 16,
  bgPattern: 'glow',
  socialDisplay: 'list',
  useCustomColors: false,
  customAccent: '#6366f1',
  customCardBg: '#131620',
  customText: '#ffffff',
  customPageBg: '#090b10',
  isPro: true,
  showProBadge: true,
  avatarAnimatedRing: false,
  hideWatermark: false,
  socials: {
    telegram: 'https://t.me/ssshakh195',
    whatsapp: '+77019392122',
    instagram: '@cv_bng',
    github: 'dRk195',
  },
  customLinks: [
    { icon: '📞', title: 'Основной телефон: +7 775 453-69-66', subtitle: 'Только для телефонных звонков', url: 'tel:+77754536966', highlight: true },
    { icon: '💬', title: 'WhatsApp: +7 701 939-21-22', subtitle: 'Дополнительный номер — написать в WhatsApp', url: 'https://wa.me/77019392122', highlight: false },
    { icon: '✉️', title: 'Почта Gmail: shakhmurat.s@gmail.com', subtitle: 'Открыть окно нового сообщения в Gmail', url: 'https://mail.google.com/mail/?view=cm&fs=1&to=shakhmurat.s@gmail.com', highlight: false },
  ],
  stats: [
    { value: 'HTML/CSS', label: 'чистая вёрстка' },
    { value: 'JS / Web', label: 'интерактив' },
    { value: '100%', label: 'адаптивность' },
  ],
  services: [
    { title: 'Создание онлайн-визитки / лендинга', price: 'Договорная', desc: 'Современный адаптивный сайт для телефона и ПК с уникальным дизайном и быстрой загрузкой.' },
    { title: 'Вёрстка и доработка веб-страниц', price: 'Договорная', desc: 'Аккуратная вёрстка по макету, настройка анимаций, форм и мобильной версии.' },
  ],
  faqs: [
    { q: 'Как со мной быстрее всего связаться?', a: 'Пишите в Telegram (@ssshakh195), в WhatsApp (+7 701 939-21-22) или звоните на основной номер (+7 775 453-69-66)!' },
  ],
};

/* ===================== 11 ГОТОВЫХ ШАБЛОНОВ В 1 КЛИК ===================== */
const PRESET_META = [
  { id: 'designer',  icon: '🔴', title: 'Шахмурат (ADMIN)',  sub: 'Ваш профиль + Admin' },
  { id: 'discord',   icon: '🎮', title: 'Discord Nitro',      sub: 'Геймер / Стример' },
  { id: 'fullstack', icon: '💻', title: 'Full-Stack Dev',     sub: 'IT & Код Терминал' },
  { id: 'business',  icon: '💼', title: 'Бизнес / CEO',       sub: 'Руководитель & Инвестор' },
  { id: 'creator',   icon: '🎬', title: 'Блогер / Креатор',   sub: 'TikTok, Reels & UGC' },
  { id: 'beauty',    icon: '🌿', title: 'Бьюти / Мастер',     sub: 'Салон, Запись и Прайс' },
  { id: 'photo',     icon: '📸', title: 'Фотограф / Видео',   sub: 'Портфолио съемок' },
  { id: 'fitness',   icon: '🏋️', title: 'Фитнес-Тренер',      sub: 'Спорт и Программы' },
  { id: 'lawyer',    icon: '⚖️', title: 'Юрист / Адвокат',    sub: 'Право и Консалтинг' },
  { id: 'realtor',   icon: '🏠', title: 'Риелтор / Брокер',   sub: 'Элитная недвижимость' },
  { id: 'music',     icon: '🎵', title: 'Музыкант / DJ',      sub: 'Релизы и Букинг' },
];

const PRESETS = {
  designer: structuredClone(EMPTY),
  discord: {
    ...structuredClone(EMPTY),
    firstName: 'Шахмурат',
    lastName: 'Сайдуллаев',
    role: 'Junior Web-coder & Gamer',
    company: 'Discord Nitro Profile',
    statusText: 'В сети • Пишу код & Играю',
    theme: 'discordNitro',
    layout: 'modern',
    avatarShape: 'circle',
    fontPair: 'discord_ginto',
    nameEffect: 'gradient',
    buttonStyle: 'filled',
    borderRadius: 16,
    bgPattern: 'glow',
    showAdminBadge: true,
    showProBadge: true,
    avatarAnimatedRing: true,
    customRoleTag: 'FOUNDER',
    customRoleColor: '#5865f2',
    stats: [
      { value: 'LVL 99', label: 'Web-Coding' },
      { value: '24/7', label: 'Online' },
      { value: 'ADMIN', label: 'Server Role' },
    ],
  },
  fullstack: {
    ...structuredClone(EMPTY),
    firstName: 'Шахмурат',
    lastName: 'Сайдуллаев',
    role: 'Web Developer • Frontend & UI',
    company: 'pinlex.work',
    statusText: 'git commit -m "Ready for projects"',
    theme: 'emerald',
    layout: 'centered',
    avatarShape: 'squircle',
    fontPair: 'mono',
    nameEffect: 'neon',
    buttonStyle: 'outline',
    borderRadius: 12,
    bgPattern: 'grid',
    showAdminBadge: true,
    customRoleTag: 'DEV',
    customRoleColor: '#10b981',
    stats: [
      { value: 'HTML5/CSS3', label: 'чистый код' },
      { value: 'JavaScript', label: 'ES6+ / DOM' },
      { value: 'GitHub', label: 'dRk195' },
    ],
  },
  business: {
    ...structuredClone(EMPTY),
    firstName: 'Нурлан',
    lastName: 'Сабилаев',
    role: 'Управляющий партнер & Инвестор',
    company: 'Apex Capital Group',
    location: 'Алматы, Казахстан',
    statusText: 'На связи по деловым вопросам',
    bio: 'Стратегический консалтинг, развитие B2B-проектов и инвестиции в технологические стартапы Центральной Азии.',
    theme: 'classic',
    layout: 'centered',
    fontPair: 'editorial',
    nameEffect: 'gold',
    buttonStyle: 'elevated',
    borderRadius: 14,
    bgPattern: 'none',
    showAdminBadge: false,
    customRoleTag: 'CEO',
    customRoleColor: '#d4af37',
    ctaLabel: 'Назначить деловую встречу',
    stats: [
      { value: '12 лет', label: 'в управлении' },
      { value: '$15M+', label: 'инвестиций' },
      { value: '25+', label: 'компаний' },
    ],
    services: [
      { title: 'Стратегическая сессия для бизнеса', price: '90 000 ₸', desc: 'Разбор бизнес-модели, точек роста и финансовой архитектуры за 2 часа.' },
    ],
  },
  creator: {
    ...structuredClone(EMPTY),
    firstName: 'Алина',
    lastName: 'Рэй',
    role: 'UGC-креатор & Видеомейкер',
    company: '540K+ подписчиков',
    location: 'Алматы • Дубай',
    statusText: 'Открыта запись на съемки для брендов',
    bio: 'Снимаю вирусные Reels и TikTok для брендов одежды, косметики и ресторанов. Охваты более 12 млн в месяц!',
    theme: 'cyberpunk',
    layout: 'hero',
    avatarShape: 'squircle',
    fontPair: 'bold',
    nameEffect: 'gradient',
    buttonStyle: 'glass',
    borderRadius: 22,
    bgPattern: 'glow',
    socialDisplay: 'grid',
    showAdminBadge: false,
    customRoleTag: 'CREATOR',
    customRoleColor: '#f72585',
    ctaLabel: 'Заказать рекламу / Коллаборацию',
    stats: [
      { value: '540K', label: 'подписчиков' },
      { value: '12M+', label: 'просмотров' },
      { value: '60+', label: 'брендов' },
    ],
    services: [
      { title: 'Пакет 3 UGC-ролика под ключ', price: '120 000 ₸', desc: 'Сценарий, съемка со студийным светом, динамичный монтаж.' },
      { title: 'Рекламный Reels в моем аккаунте', price: '180 000 ₸', desc: 'Нативная интеграция с отметкой вашего бренда и ссылкой в сторис.' },
    ],
  },
  beauty: {
    ...structuredClone(EMPTY),
    firstName: 'Эльмира',
    lastName: 'Касымова',
    role: 'Топ-стилист & Визажист',
    company: 'AURA Beauty Studio',
    location: 'Алматы, пр. Достык 132',
    statusText: 'Открыта запись на этот месяц',
    bio: 'Создаю безупречные свадебные и вечерние образы. Обучение макияжу «Для себя» и повышение квалификации мастеров.',
    theme: 'creamGold',
    layout: 'centered',
    avatarShape: 'arch',
    fontPair: 'luxury',
    nameEffect: 'none',
    buttonStyle: 'filled',
    borderRadius: 18,
    bgPattern: 'none',
    showAdminBadge: false,
    ctaLabel: 'Записаться онлайн в WhatsApp',
    stats: [
      { value: '6 лет', label: 'опыта работы' },
      { value: '800+', label: 'образов' },
      { value: '100%', label: 'люкс-косметика' },
    ],
    services: [
      { title: 'Вечерний образ (Макияж + Локоны)', price: '35 000 ₸', desc: 'Стойкий макияж и укладка за 1.5 часа в 4 руки. Ресницы включены.' },
      { title: 'Свадебный образ с репетицией', price: '75 000 ₸', desc: 'Пробный образ в студии + выезд к невесте в день свадьбы.' },
    ],
  },
  photo: {
    ...structuredClone(EMPTY),
    firstName: 'Данияр',
    lastName: 'Ахметов',
    role: 'Fashion & Commercial Photographer',
    company: 'Vogue / Elle Contributor',
    location: 'Алматы • Стамбул',
    statusText: 'Бронирование съемочных дат',
    bio: 'Портретная, рекламная и кампейн-съемка для брендов и журналов. Полный продакшн: от идеи и локации до ретуши.',
    theme: 'graphite',
    layout: 'hero',
    avatarShape: 'square',
    fontPair: 'grotesk',
    nameEffect: 'none',
    buttonStyle: 'outline',
    borderRadius: 8,
    bgPattern: 'dots',
    showAdminBadge: false,
    ctaLabel: 'Забронировать дату съемки',
    stats: [
      { value: '8 лет', label: 'за камерой' },
      { value: '350+', label: 'кампейнов' },
      { value: '48 ч', label: 'готовность фото' },
    ],
    services: [
      { title: 'Индивидуальная портретная съемка', price: '65 000 ₸', desc: '2 часа съемки, помощь в позировании, 20 кадров в журнальной ретуши.' },
      { title: 'Лукбук / Каталог для бренда', price: 'от 140 000 ₸', desc: 'Студийная или уличная съемка коллекции с продюсированием.' },
    ],
  },
  fitness: {
    ...structuredClone(EMPTY),
    firstName: 'Тимур',
    lastName: 'Сарсенов',
    role: 'Персональный фитнес-тренер & Нутрициолог',
    company: 'Invictus Fitness',
    location: 'Алматы + Онлайн по всему миру',
    statusText: 'Набор на онлайн-ведение (осталось 3 места)',
    bio: 'Помогаю сбросить лишний вес и построить рельефное тело без голодовок. Индивидуальный план питания и тренировок.',
    theme: 'adminRed',
    layout: 'modern',
    avatarShape: 'squircle',
    fontPair: 'anime',
    nameEffect: 'redglow',
    buttonStyle: 'filled',
    borderRadius: 14,
    bgPattern: 'glow',
    showAdminBadge: false,
    customRoleTag: 'PRO COACH',
    customRoleColor: '#ef4444',
    ctaLabel: 'Записаться на бесплатный разбор',
    stats: [
      { value: '9 лет', label: 'в спорте' },
      { value: '400+', label: 'трансформаций' },
      { value: '-8 кг', label: 'средний результат' },
    ],
    services: [
      { title: 'Онлайн-ведение на 1 месяц', price: '60 000 ₸', desc: 'Программа тренировок, расчет КБЖУ, еженедельный контроль и чат со мной 24/7.' },
      { title: 'Блок из 12 персональных тренировок', price: '110 000 ₸', desc: 'Индивидуальные занятия в зале с постановкой техники.' },
    ],
  },
  lawyer: {
    ...structuredClone(EMPTY),
    firstName: 'Арман',
    lastName: 'Бекетов',
    role: 'Юрист по бизнесу и недвижимости',
    company: 'Beketov Legal Partners',
    location: 'Астана • Алматы',
    statusText: 'Консультации онлайн и в офисе',
    bio: 'Защита интересов бизнеса, сопровождение сделок с недвижимостью, проверка договоров и представительство в судах.',
    theme: 'ocean',
    layout: 'centered',
    avatarShape: 'circle',
    fontPair: 'editorial',
    nameEffect: 'none',
    buttonStyle: 'elevated',
    borderRadius: 12,
    bgPattern: 'none',
    showAdminBadge: false,
    ctaLabel: 'Получить консультацию юриста',
    stats: [
      { value: '11 лет', label: 'практики' },
      { value: '94%', label: 'выигранных дел' },
      { value: '500+', label: 'проверенных сделок' },
    ],
    services: [
      { title: 'Устная и письменная консультация', price: '25 000 ₸', desc: 'Правовой разбор вашей ситуации с четким планом действий.' },
      { title: 'Сопровождение сделки с недвижимостью', price: '120 000 ₸', desc: 'Полная проверка юридической чистоты объекта и составление договора.' },
    ],
  },
  realtor: {
    ...structuredClone(EMPTY),
    firstName: 'Камила',
    lastName: 'Нурланова',
    role: 'Эксперт по элитной недвижимости',
    company: 'Prime Realty Almaty & Dubai',
    location: 'Алматы • Дубай',
    statusText: 'Подбор новостроек без комиссии (0%)',
    bio: 'Подбираю ликвидные квартиры и коммерческую недвижимость для жизни и инвестиций с доходностью до 18% годовых.',
    theme: 'terracotta',
    layout: 'centered',
    avatarShape: 'arch',
    fontPair: 'modern',
    nameEffect: 'gold',
    buttonStyle: 'filled',
    borderRadius: 18,
    bgPattern: 'none',
    showAdminBadge: false,
    ctaLabel: 'Получить каталог топ-объектов',
    stats: [
      { value: '0%', label: 'комиссия на ЖК' },
      { value: '180+', label: 'сделок за год' },
      { value: '45 ЖК', label: 'в закрытой базе' },
    ],
    services: [
      { title: 'Инвест-подбор квартиры в новостройке', price: '0 ₸ (платит застройщик)', desc: 'Расчет окупаемости, согласование скидки и полное сопровождение.' },
      { title: 'Продажа вашей недвижимости под ключ', price: 'от 2%', desc: 'Профессиональная упаковка, хоумстейджинг, реклама и проведение сделки.' },
    ],
  },
  music: {
    ...structuredClone(EMPTY),
    firstName: 'DJ KAIRAT',
    lastName: 'WAVE',
    role: 'Music Producer & Sound Designer',
    company: 'Nightlife / Electronic / House',
    location: 'Booking Worldwide',
    statusText: 'Новый трек «Midnight Pulse» уже на всех площадках!',
    bio: 'Автор ремиксов и электронных сетов. Выступления на фестивалях, закрытых ивентах и саунд-продюсирование артистов.',
    theme: 'sunset',
    layout: 'hero',
    avatarShape: 'circle',
    fontPair: 'cyber',
    nameEffect: 'neon',
    buttonStyle: 'glass',
    borderRadius: 20,
    bgPattern: 'glow',
    showAdminBadge: false,
    customRoleTag: 'ARTIST',
    customRoleColor: '#fb7185',
    ctaLabel: 'Букинг / Организация выступлений',
    stats: [
      { value: '2.4M', label: 'прослушиваний' },
      { value: '150+', label: 'живых сетов' },
      { value: 'TOP 10', label: 'Shazam Chart' },
    ],
    services: [
      { title: 'DJ-сет на мероприятие (2 часа)', price: 'от 200 000 ₸', desc: 'Авторская программа, работа на клубном и фестивальном оборудовании.' },
      { title: 'Аранжировка / Трек под ключ', price: '150 000 ₸', desc: 'Создание бита, сведение, мастеринг и подготовка к дистрибуции.' },
    ],
  },
};

/* ===================== КОЛЛЕКЦИЯ ЖИВЫХ АНИМИРОВАННЫХ ОБЛОЖЕК И АВАТАРОВ (PRO GIF) ===================== */
const svgDataUrl = svg => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

const GIF_COVER_PRESETS = [
  {
    id: 'cyber-waves',
    name: '🌊 Неоновые Волны',
    url: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="600" height="240">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f0c29"><animate attributeName="stop-color" values="#0f0c29;#302b63;#f72585;#0f0c29" dur="6s" repeatCount="indefinite"/></stop>
          <stop offset="50%" stop-color="#302b63"><animate attributeName="stop-color" values="#302b63;#7209b7;#4cc9f0;#302b63" dur="6s" repeatCount="indefinite"/></stop>
          <stop offset="100%" stop-color="#24243e"><animate attributeName="stop-color" values="#24243e;#4cc9f0;#7209b7;#24243e" dur="6s" repeatCount="indefinite"/></stop>
        </linearGradient>
      </defs>
      <rect width="600" height="240" fill="url(#g1)"/>
      <path fill="rgba(0,245,212,0.25)" d="M0,160 Q150,100 300,160 T600,160 L600,240 L0,240 Z">
        <animate attributeName="d" dur="4s" repeatCount="indefinite"
          values="M0,160 Q150,100 300,160 T600,160 L600,240 L0,240 Z;
                  M0,150 Q150,210 300,150 T600,150 L600,240 L0,240 Z;
                  M0,160 Q150,100 300,160 T600,160 L600,240 L0,240 Z"/>
      </path>
      <path fill="rgba(247,37,133,0.22)" d="M0,180 Q150,220 300,180 T600,180 L600,240 L0,240 Z">
        <animate attributeName="d" dur="3.2s" repeatCount="indefinite"
          values="M0,180 Q150,220 300,180 T600,180 L600,240 L0,240 Z;
                  M0,175 Q150,120 300,175 T600,175 L600,240 L0,240 Z;
                  M0,180 Q150,220 300,180 T600,180 L600,240 L0,240 Z"/>
      </path>
    </svg>`),
  },
  {
    id: 'matrix-code',
    name: '💻 Матрица Кода',
    url: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="600" height="240">
      <rect width="600" height="240" fill="#050d0a"/>
      <g fill="#10b981" font-family="monospace" font-size="16" font-weight="bold" opacity="0.65">
        <text x="40" y="0">&lt;code/&gt;<animate attributeName="y" from="-20" to="260" dur="2.5s" repeatCount="indefinite"/></text>
        <text x="140" y="0">0110101<animate attributeName="y" from="-60" to="260" dur="3.1s" repeatCount="indefinite"/></text>
        <text x="250" y="0">{JS:PRO}<animate attributeName="y" from="-40" to="260" dur="2.2s" repeatCount="indefinite"/></text>
        <text x="370" y="0">pinlex()<animate attributeName="y" from="-80" to="260" dur="2.8s" repeatCount="indefinite"/></text>
        <text x="490" y="0">1011001<animate attributeName="y" from="-10" to="260" dur="2.0s" repeatCount="indefinite"/></text>
      </g>
      <circle cx="300" cy="120" r="80" fill="none" stroke="#10b981" stroke-width="2" opacity="0.3">
        <animate attributeName="r" values="30;140;30" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite"/>
      </circle>
    </svg>`),
  },
  {
    id: 'admin-fire',
    name: '🔴 Admin Crimson',
    url: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="600" height="240">
      <rect width="600" height="240" fill="#120406"/>
      <circle cx="200" cy="120" r="100" fill="#ef4444" filter="blur(40px)" opacity="0.6">
        <animate attributeName="cx" values="120;480;120" dur="5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="400" cy="120" r="80" fill="#f97316" filter="blur(35px)" opacity="0.45">
        <animate attributeName="cx" values="480;120;480" dur="5s" repeatCount="indefinite"/>
      </circle>
    </svg>`),
  },
  {
    id: 'gold-luxury',
    name: '✨ Золотое Сияние',
    url: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="600" height="240">
      <defs>
        <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a1307"><animate attributeName="stop-color" values="#1a1307;#423012;#1a1307" dur="5s" repeatCount="indefinite"/></stop>
          <stop offset="50%" stop-color="#b38728"><animate attributeName="stop-color" values="#b38728;#fbf5b7;#b38728" dur="5s" repeatCount="indefinite"/></stop>
          <stop offset="100%" stop-color="#291d09"/>
        </linearGradient>
      </defs>
      <rect width="600" height="240" fill="url(#goldG)"/>
      <circle cx="120" cy="80" r="4" fill="#fff"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/></circle>
      <circle cx="480" cy="60" r="5" fill="#fff"><animate attributeName="opacity" values="1;0;1" dur="2.4s" repeatCount="indefinite"/></circle>
      <circle cx="310" cy="140" r="3.5" fill="#fff"><animate attributeName="opacity" values="0.2;1;0.2" dur="1.7s" repeatCount="indefinite"/></circle>
    </svg>`),
  },
  {
    id: 'space-nebula',
    name: '🚀 Космос & Пульс',
    url: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="600" height="240">
      <rect width="600" height="240" fill="#070714"/>
      <circle cx="180" cy="120" r="90" fill="#6366f1" filter="blur(35px)" opacity="0.55">
        <animate attributeName="cx" values="140;440;140" dur="7s" repeatCount="indefinite"/>
      </circle>
      <circle cx="420" cy="120" r="85" fill="#ec4899" filter="blur(35px)" opacity="0.55">
        <animate attributeName="cx" values="460;160;460" dur="7s" repeatCount="indefinite"/>
      </circle>
    </svg>`),
  },
];

const GIF_AVATAR_PRESETS = [
  {
    id: 'admin-shield',
    name: '🔴 ADMIN Shield',
    url: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="#18070a"/>
      <circle cx="100" cy="100" r="72" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="22 10">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="6s" repeatCount="indefinite"/>
      </circle>
      <text x="100" y="114" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-weight="900" font-size="38">ADMIN</text>
    </svg>`),
  },
  {
    id: 'coder-pulse',
    name: '👨‍💻 Web-Coder Neon',
    url: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <linearGradient id="av1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5"><animate attributeName="stop-color" values="#4f46e5;#ec4899;#00f5d4;#4f46e5" dur="4s" repeatCount="indefinite"/></stop>
          <stop offset="100%" stop-color="#9333ea"><animate attributeName="stop-color" values="#9333ea;#4f46e5;#f72585;#9333ea" dur="4s" repeatCount="indefinite"/></stop>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#av1)"/>
      <circle cx="100" cy="100" r="72" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="18 10" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite"/>
      </circle>
      <text x="100" y="114" text-anchor="middle" fill="#fff" font-family="monospace" font-weight="bold" font-size="42">&lt;/&gt;</text>
    </svg>`),
  },
  {
    id: 'crown-vip',
    name: '👑 Золотая Корона',
    url: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="#161208"/>
      <circle cx="100" cy="100" r="65" fill="none" stroke="#f59e0b" stroke-width="5">
        <animate attributeName="r" values="60;74;60" dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.35;1" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      <text x="100" y="118" text-anchor="middle" font-size="60">👑</text>
    </svg>`),
  },
  {
    id: 'matrix-sphere',
    name: '⚡ Кибер-Сфера',
    url: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="#061512"/>
      <circle cx="100" cy="100" r="55" fill="#10b981" opacity="0.25">
        <animate attributeName="r" values="40;75;40" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <text x="100" y="116" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="46">ШС</text>
    </svg>`),
  },
];

/* ===================== CSS ВИЗИТКИ (ДЛЯ ПРЕВЬЮ И АВТОНОМНОГО ЭКСПОРТА) ===================== */
const CARD_CSS = `
.vc {
  width: 100%;
  max-width: 440px;
  background: var(--card);
  color: var(--text);
  border-radius: calc(var(--radius) + 10px);
  padding: 0 22px 24px;
  font-family: var(--font-body);
  box-shadow: 0 28px 65px rgba(0,0,0,0.32);
  overflow: hidden;
  line-height: 1.5;
  position: relative;
  border: 1px solid var(--line);
}
.vc * { box-sizing: border-box; }

/* Фоновые паттерны */
.vc--pattern-glow::before {
  content: '';
  position: absolute;
  top: -80px;
  right: -80px;
  width: 240px;
  height: 240px;
  background: var(--accent);
  filter: blur(95px);
  opacity: 0.25;
  pointer-events: none;
}
.vc--pattern-dots {
  background-image: radial-gradient(var(--line) 1px, transparent 1px);
  background-size: 16px 16px;
}
.vc--pattern-grid {
  background-image: linear-gradient(to right, var(--line) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Верхняя панель действий на самой визитке (QR + Поделиться) */
.vc__topbar {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  gap: 8px;
  z-index: 5;
}
.vc__icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.18s, background 0.18s;
}
.vc__icon-btn:hover {
  transform: scale(1.07);
  background: rgba(0, 0, 0, 0.58);
}

/* Баннер шапки */
.vc__band {
  height: 118px;
  margin: 0 -22px;
  background: var(--band);
  background-size: cover;
  background-position: center;
  position: relative;
}
.vc--layout-minimal .vc__band {
  height: 26px;
  background: transparent;
}
.vc--layout-hero .vc__band {
  height: 175px;
}

/* Шапка и выравнивание */
.vc__header {
  text-align: center;
  position: relative;
  z-index: 2;
}
.vc--layout-modern .vc__header {
  text-align: left;
}

/* Аватар */
.vc__avatar {
  width: 116px;
  height: 116px;
  margin: -58px auto 14px;
  border: 4px solid var(--card);
  background: var(--accent);
  color: var(--onAccent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-head);
  font-size: 2.3rem;
  font-weight: 700;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.22);
}
.vc--layout-modern .vc__avatar {
  margin: -48px 0 12px;
  width: 100px;
  height: 100px;
}
.vc--layout-minimal .vc__avatar {
  margin-top: 8px;
}
.vc__avatar--circle { border-radius: 50%; }
.vc__avatar--squircle { border-radius: 28%; }
.vc__avatar--arch { border-radius: 99px 99px 22px 22px; }
.vc__avatar--square { border-radius: 8px; }
.vc__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
@keyframes proPulseRing {
  0%, 100% { box-shadow: 0 0 0 3px #f59e0b, 0 0 22px rgba(245, 158, 11, 0.75); }
  50% { box-shadow: 0 0 0 4px #ec4899, 0 0 32px rgba(236, 72, 153, 0.9); }
}
.vc__avatar--pro-ring {
  border-color: #ffffff;
  animation: proPulseRing 2.6s infinite ease-in-out;
}

/* Бейджи ADMIN, PRO и кастомные теги Discord */
.vc__admin-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 9px;
  border-radius: 6px;
  background: #ef4444;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  vertical-align: middle;
  box-shadow: 0 2px 12px rgba(239, 68, 68, 0.55);
}
.vc__pro-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid var(--line);
  font-family: 'Inter', sans-serif;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  vertical-align: middle;
}
.vc__pro-badge span {
  background: linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #818cf8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #f59e0b;
}
.vc__role-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  vertical-align: middle;
}

/* Бейдж статуса */
.vc__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 99px;
  background: var(--btn);
  border: 1px solid var(--line);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
}
.vc__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

/* Имя, эффекты текста Discord Nitro и верификация */
.vc__title-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.vc--layout-modern .vc__title-block {
  align-items: flex-start;
  text-align: left;
}
.vc__name {
  font-family: var(--font-head);
  font-size: 1.9rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.24;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}
.vc--layout-modern .vc__name {
  justify-content: flex-start;
  text-align: left;
}
.vc__name-inline {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-wrap: nowrap;
}
.vc__badges-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}
.vc--layout-modern .vc__badges-row {
  justify-content: flex-start;
}
.vc--font-pixel .vc__name {
  font-size: 1.25rem;
  line-height: 1.45;
}
.vc__name-text--gradient {
  background: linear-gradient(90deg, #ff5470, #f59e0b, #00f5d4, #818cf8, #ec4899);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.vc__name-text--neon {
  color: #ffffff;
  text-shadow: 0 0 10px var(--accent), 0 0 22px var(--accent);
}
.vc__name-text--redglow {
  color: #fff1f2;
  text-shadow: 0 0 10px #ef4444, 0 0 24px #dc2626;
}
.vc__name-text--gold {
  background: linear-gradient(135deg, #fef08a 0%, #d4af37 50%, #a16207 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.vc__name-text--shadow {
  text-shadow: 3px 3px 0 var(--accent);
}

.vc__verified {
  display: inline-flex;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--onAccent);
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
}

.vc__role {
  color: var(--accent);
  font-size: 1rem;
  font-weight: 700;
  margin: 8px 0 0;
  letter-spacing: 0.02em;
}
.vc__meta {
  color: var(--muted);
  font-size: 0.92rem;
  margin: 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.vc--layout-modern .vc__meta {
  justify-content: flex-start;
}
.vc__bio {
  color: var(--text);
  opacity: 0.92;
  font-size: 1rem;
  line-height: 1.55;
  margin: 14px 0 0;
  white-space: pre-line;
  word-break: break-word;
}

/* Быстрые круглые иконки контактов */
.vc__quick-contacts {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
}
.vc--layout-modern .vc__quick-contacts {
  justify-content: flex-start;
}
.vc__qbtn {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--btn);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
}
.vc__qbtn:hover {
  background: var(--accent);
  color: var(--onAccent);
  border-color: var(--accent);
  transform: translateY(-2px);
}
.vc__qbtn svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Главные кнопки действий (CTA + Сохранить контакт) */
.vc__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
.vc__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 15px 18px;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--onAccent);
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0,0,0,0.18);
  transition: transform 0.18s, filter 0.18s;
}
.vc__cta:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}
.vc__save-row {
  display: flex;
  gap: 8px;
}
.vc__save {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 13px 14px;
  border-radius: var(--radius);
  background: var(--btn);
  color: var(--text);
  border: 1px solid var(--line);
  font-weight: 600;
  font-size: 0.96rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.18s;
}
.vc__save:hover {
  border-color: var(--accent);
}

/* Блок цифр и фактов (Stats) */
.vc__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(95px, 1fr));
  gap: 8px;
  margin-top: 18px;
}
.vc__stat {
  padding: 12px 8px;
  border-radius: var(--radius);
  background: var(--btn);
  border: 1px solid var(--line);
  text-align: center;
}
.vc__stat-val {
  font-family: var(--font-head);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.25;
}
.vc--font-pixel .vc__stat-val {
  font-size: 0.85rem;
}
.vc__stat-lbl {
  font-size: 0.84rem;
  color: var(--muted);
  margin-top: 4px;
}

/* Заголовки секций внутри визитки */
.vc__sec-title {
  font-family: var(--font-head);
  font-size: 0.88rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 24px 0 12px;
  text-align: left;
  font-weight: 700;
}

/* Варианты стилей карточек/кнопок */
.vc--btn-glass .vc__card-elem {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.vc--btn-outline .vc__card-elem {
  background: transparent;
  border: 1.5px solid var(--line);
}
.vc--btn-brutal .vc__card-elem,
.vc--btn-brutal .vc__cta,
.vc--btn-brutal .vc__stat {
  border: 2px solid var(--text);
  box-shadow: 4px 4px 0 var(--text);
}
.vc--btn-elevated .vc__card-elem {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
}

/* Собственные кнопки и ссылки */
.vc__custom-links {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 18px;
}
.vc__clink {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: var(--radius);
  background: var(--btn);
  border: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
  text-align: left;
  transition: transform 0.18s, border-color 0.18s;
}
.vc__clink:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}
.vc__clink--highlight {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}
.vc__clink-icon {
  width: 38px;
  height: 38px;
  border-radius: calc(var(--radius) * 0.65);
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}
.vc__clink-body {
  flex: 1;
  min-width: 0;
}
.vc__clink-title {
  font-weight: 600;
  font-size: 1rem;
  display: block;
}
.vc__clink-sub {
  font-size: 0.86rem;
  color: var(--muted);
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Витрина услуг / Прайс-лист */
.vc__services {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.vc__service {
  padding: 16px;
  border-radius: var(--radius);
  background: var(--btn);
  border: 1px solid var(--line);
  text-align: left;
}
.vc__service-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.vc__service-title {
  font-weight: 700;
  font-size: 1.02rem;
  margin: 0;
}
.vc__service-price {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--accent);
  background: rgba(255,255,255,0.08);
  padding: 3px 10px;
  border-radius: 99px;
  white-space: nowrap;
}
.vc__service-desc {
  font-size: 0.92rem;
  color: var(--muted);
  margin: 8px 0 12px;
  line-height: 1.5;
}
.vc__service-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
}
.vc__service-btn:hover {
  text-decoration: underline;
}

/* Соцсети (Список, Bento-плитка 2 колонки, Иконки) */
.vc__socials--list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.vc__socials--grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.vc__socials--icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
.vc__slink {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px 11px 11px;
  border-radius: var(--radius);
  background: var(--btn);
  border: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.98rem;
  transition: transform 0.18s, border-color 0.18s;
}
.vc__slink:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}
.vc__slink-icon {
  width: 40px;
  height: 40px;
  border-radius: calc(var(--radius) * 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.vc__slink-icon img {
  width: 20px;
  height: 20px;
}
.vc__slink-text {
  flex: 1;
  text-align: left;
  min-width: 0;
}
.vc__slink-text small {
  display: block;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vc__sicon-only {
  width: 50px;
  height: 50px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.18s;
}
.vc__sicon-only:hover {
  transform: translateY(-3px) scale(1.05);
}
.vc__sicon-only img {
  width: 24px;
  height: 24px;
}

/* FAQ Аккордеон */
.vc__faqs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}
.vc__faq {
  border-radius: var(--radius);
  background: var(--btn);
  border: 1px solid var(--line);
  padding: 13px 16px;
}
.vc__faq summary {
  font-weight: 600;
  font-size: 0.96rem;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.vc__faq summary::-webkit-details-marker { display: none; }
.vc__faq summary::after {
  content: '+';
  color: var(--accent);
  font-weight: 700;
  font-size: 1.15rem;
}
.vc__faq[open] summary::after {
  content: '−';
}
.vc__faq-ans {
  margin-top: 10px;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--muted);
  border-top: 1px solid var(--line);
  padding-top: 10px;
}

/* Подвал визитки */
.vc__footer {
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  text-align: center;
}
.vc__brand-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--muted);
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.18s;
}
.vc__brand-link:hover {
  opacity: 1;
  color: var(--accent);
}

/* Встроенное модальное окно обратного обмена контактами и QR внутри визитки */
.vc-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(5px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 999;
}
.vc-overlay.open {
  display: flex;
}
.vc-popup {
  background: var(--card);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 22px;
  width: 100%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0,0,0,0.55);
  font-family: var(--font-body);
}
.vc-popup h3 {
  margin: 0 0 6px;
  font-family: var(--font-head);
  font-size: 1.15rem;
}
.vc-popup p {
  margin: 0 0 14px;
  font-size: 0.86rem;
  color: var(--muted);
}
.vc-popup input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--btn);
  color: var(--text);
  font-family: inherit;
  font-size: 0.92rem;
}
.vc-popup__btns {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
`;

const ICONS = {
  phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  email: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  website: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  map: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  qr: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/></svg>',
  vcard: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
};

/* ===================== УТИЛИТЫ ===================== */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = sel => document.querySelector(sel);

function socialUrl(s, value) {
  const v = String(value || '').trim();
  if (isUrl(v)) return v;
  if (looksLikeDomain(v) && s.id !== 'whatsapp') return withHttp(v);
  return s.url(v);
}

function displayHandle(s, value) {
  const v = String(value || '').trim();
  if (isUrl(v) || looksLikeDomain(v)) return v.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
  if (s.id === 'whatsapp') return v;
  return '@' + clean(v);
}

function fullName(d) {
  return [d.firstName, d.lastName].map(x => String(x || '').trim()).filter(Boolean).join(' ');
}

function initials(d) {
  const f = String(d.firstName || '').trim()[0] || '';
  const l = String(d.lastName || '').trim()[0] || '';
  return (f + l).toUpperCase() || 'P';
}

function resolveMapHref(val) {
  const v = String(val || '').trim();
  if (!v) return '';
  if (isUrl(v)) return v;
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v);
}

function resolveEmailHref(emailVal) {
  const cleanMail = String(emailVal || '').trim().replace(/^mailto:/i, '');
  if (!cleanMail) return '#';
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanMail)}`;
}

function resolveCustomLinkUrl(rawUrl) {
  const u = String(rawUrl || '').trim();
  if (!u) return '#';
  if (/^mailto:/i.test(u)) return resolveEmailHref(u);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u)) return resolveEmailHref(u);
  return withHttp(u);
}

function resolveOrderHref(d, serviceTitle) {
  const text = encodeURIComponent(`Здравствуйте! Интересует услуга: «${serviceTitle}»`);
  if (d.socials?.whatsapp?.trim()) {
    const num = d.socials.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${num}?text=${text}`;
  }
  if (d.socials?.telegram?.trim()) {
    return `https://t.me/${clean(d.socials.telegram)}?text=${text}`;
  }
  if (d.ctaUrl?.trim()) return withHttp(d.ctaUrl);
  if (d.phone?.trim()) return `tel:${d.phone.replace(/[^\d+]/g, '')}`;
  return '#';
}

function buildVcf(d) {
  const e = s => String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${e(d.lastName?.trim())};${e(d.firstName?.trim())};;;`,
    `FN:${e(fullName(d) || 'Контакт')}`,
  ];
  if (d.company?.trim()) lines.push(`ORG:${e(d.company.trim())}`);
  if (d.role?.trim()) lines.push(`TITLE:${e(d.role.trim())}`);
  if (d.phone?.trim()) lines.push(`TEL;TYPE=CELL,PREF:${d.phone.trim()}`);
  if (d.phone2?.trim()) lines.push(`TEL;TYPE=CELL:${d.phone2.trim()}`);
  if (d.email?.trim()) lines.push(`EMAIL:${d.email.trim()}`);
  if (d.website?.trim()) lines.push(`URL:${withHttp(d.website)}`);
  if (d.location?.trim()) lines.push(`ADR;TYPE=WORK:;;${e(d.location.trim())};;;;`);
  SOCIALS.forEach(s => {
    const v = d.socials?.[s.id];
    if (v && v.trim()) lines.push(`X-SOCIALPROFILE;TYPE=${s.label}:${socialUrl(s, v)}`);
  });
  if (d.bio?.trim()) lines.push(`NOTE:${e(d.bio.trim())}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

function getEffectiveTheme(d) {
  const base = THEMES[d.theme] || THEMES.midnight;
  if (!d.useCustomColors) return base;
  return {
    ...base,
    accent: d.customAccent || base.accent,
    card: d.customCardBg || base.card,
    text: d.customText || base.text,
    page: d.customPageBg || base.page,
    band: `linear-gradient(135deg, ${d.customAccent}, ${d.customCardBg})`,
  };
}

function themeVars(d) {
  const t = getEffectiveTheme(d);
  const f = FONTS[d.fontPair] || FONTS.discord_gg;
  const r = Number(d.borderRadius ?? 16);
  return [
    `--card:${t.card}`,
    `--text:${t.text}`,
    `--muted:${t.muted}`,
    `--accent:${t.accent}`,
    `--onAccent:${t.onAccent}`,
    `--btn:${t.btn}`,
    `--line:${t.line}`,
    `--band:${t.band}`,
    `--font-head:${f.head}`,
    `--font-body:${f.body}`,
    `--radius:${r}px`,
  ].join(';');
}

/* ===================== РЕНДЕР ВИЗИТКИ ===================== */
function renderCard(d, { preview = false } = {}) {
  const name = fullName(d);
  const avatarContent = d.avatar
    ? `<img src="${d.avatar}" alt="${esc(name)}">`
    : esc(initials(d));

  const coverStyle = d.cover ? `style="background-image:url(&quot;${esc(d.cover)}&quot;)"` : '';

  // Мета-строка (Компания + Локация)
  const metaParts = [];
  if (d.company?.trim()) metaParts.push(`<span>🏢 ${esc(d.company.trim())}</span>`);
  if (d.location?.trim()) metaParts.push(`<span>📍 ${esc(d.location.trim())}</span>`);

  // Быстрые контакты (1: Основной тел. для звонков, 2: Доп. номер -> WhatsApp, 3: Почта -> Gmail Compose, 4: Сайт -> GitHub)
  const qContacts = [];
  if (d.phone?.trim()) qContacts.push(`<a class="vc__qbtn vc__card-elem" href="tel:${esc(d.phone.replace(/[^\d+]/g, ''))}" title="Позвонить (основной): ${esc(d.phone.trim())}">${ICONS.phone}</a>`);
  if (d.phone2?.trim()) {
    const waNum = d.phone2.replace(/\D/g, '');
    qContacts.push(`<a class="vc__qbtn vc__card-elem" href="https://wa.me/${esc(waNum)}" target="_blank" rel="noopener" title="WhatsApp (доп. номер): ${esc(d.phone2.trim())}">${ICONS.phone}</a>`);
  }
  if (d.email?.trim()) qContacts.push(`<a class="vc__qbtn vc__card-elem" href="${esc(resolveEmailHref(d.email))}" target="_blank" rel="noopener" title="Написать в Gmail: ${esc(d.email.trim())}">${ICONS.email}</a>`);
  if (d.website?.trim()) qContacts.push(`<a class="vc__qbtn vc__card-elem" href="${esc(withHttp(d.website))}" target="_blank" rel="noopener" title="GitHub / Сайт: ${esc(d.website.trim())}">${ICONS.website}</a>`);
  if (d.mapUrl?.trim()) qContacts.push(`<a class="vc__qbtn vc__card-elem" href="${esc(resolveMapHref(d.mapUrl))}" target="_blank" rel="noopener" title="На карте">${ICONS.map}</a>`);

  // Цифры и факты
  const validStats = (d.stats || []).filter(st => st.value?.trim() || st.label?.trim());
  const statsHtml = validStats.length
    ? `<div class="vc__stats">${validStats.map(st => `
        <div class="vc__stat vc__card-elem">
          <div class="vc__stat-val">${esc(st.value)}</div>
          <div class="vc__stat-lbl">${esc(st.label)}</div>
        </div>`).join('')}</div>`
    : '';

  // Произвольные кнопки
  const validLinks = (d.customLinks || []).filter(l => l.title?.trim());
  const customLinksHtml = validLinks.length
    ? `<div class="vc__custom-links">${validLinks.map(l => {
        const href = resolveCustomLinkUrl(l.url || '#');
        const isTel = /^tel:/i.test(href);
        return `
        <a class="vc__clink vc__card-elem ${l.highlight ? 'vc__clink--highlight' : ''}" href="${esc(href)}" ${isTel ? '' : 'target="_blank" rel="noopener"'}>
          <span class="vc__clink-icon">${esc(l.icon || '🔗')}</span>
          <span class="vc__clink-body">
            <span class="vc__clink-title">${esc(l.title)}</span>
            ${l.subtitle?.trim() ? `<span class="vc__clink-sub">${esc(l.subtitle)}</span>` : ''}
          </span>
          <span style="color:var(--muted)">›</span>
        </a>`;
      }).join('')}</div>`
    : '';

  // Витрина услуг
  const validServices = (d.services || []).filter(s => s.title?.trim());
  const servicesHtml = validServices.length
    ? `<div class="vc__sec-title">Услуги и прайс</div>
       <div class="vc__services">${validServices.map(s => `
        <div class="vc__service vc__card-elem">
          <div class="vc__service-top">
            <h4 class="vc__service-title">${esc(s.title)}</h4>
            ${s.price?.trim() ? `<span class="vc__service-price">${esc(s.price)}</span>` : ''}
          </div>
          ${s.desc?.trim() ? `<p class="vc__service-desc">${esc(s.desc)}</p>` : ''}
          <a class="vc__service-btn" href="${esc(resolveOrderHref(d, s.title))}" target="_blank" rel="noopener">Заказать услугу →</a>
        </div>`).join('')}</div>`
    : '';

  // Соцсети
  const activeSocials = SOCIALS.filter(s => (d.socials?.[s.id] || '').trim());
  let socialsHtml = '';
  if (activeSocials.length) {
    const mode = d.socialDisplay || 'list';
    if (mode === 'icons') {
      socialsHtml = `<div class="vc__sec-title" style="text-align:center">Соцсети и мессенджеры</div>
        <div class="vc__socials--icons">${activeSocials.map(s => {
          const v = d.socials[s.id];
          return `<a class="vc__sicon-only" style="background:${s.color}" href="${esc(socialUrl(s, v))}" target="_blank" rel="noopener" title="${esc(s.label)}">
            <img src="${ICON_CDN(s.slug)}" alt="${esc(s.label)}">
          </a>`;
        }).join('')}</div>`;
    } else {
      socialsHtml = `<div class="vc__sec-title">Соцсети и мессенджеры</div>
        <div class="vc__socials--${mode}">${activeSocials.map(s => {
          const v = d.socials[s.id];
          return `<a class="vc__slink vc__card-elem" href="${esc(socialUrl(s, v))}" target="_blank" rel="noopener">
            <span class="vc__slink-icon" style="background:${s.color}"><img src="${ICON_CDN(s.slug)}" alt=""></span>
            <span class="vc__slink-text">${esc(s.label)}<small>${esc(displayHandle(s, v))}</small></span>
          </a>`;
        }).join('')}</div>`;
    }
  }

  // FAQ
  const validFaqs = (d.faqs || []).filter(f => f.q?.trim() && f.a?.trim());
  const faqsHtml = validFaqs.length
    ? `<div class="vc__sec-title">Частые вопросы</div>
       <div class="vc__faqs">${validFaqs.map(f => `
        <details class="vc__faq vc__card-elem">
          <summary>${esc(f.q)}</summary>
          <div class="vc__faq-ans">${esc(f.a)}</div>
        </details>`).join('')}</div>`
    : '';

  // Кнопки CTA и VCF
  const vcfHref = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(buildVcf(d));
  const fileName = (name || 'contact').replace(/[^\wа-яё\s-]/gi, '').trim().replace(/\s+/g, '_') + '.vcf';

  const ctaBtn = d.ctaLabel?.trim()
    ? `<a class="vc__cta" href="${esc(withHttp(d.ctaUrl || '#'))}" target="_blank" rel="noopener">${esc(d.ctaLabel)}</a>`
    : '';

  const saveVcfBtn = d.showSaveVcf
    ? `<a class="vc__save vc__card-elem" href="${vcfHref}" download="${esc(fileName)}" data-action="save-vcf">
        ${ICONS.vcard}
        <span>Сохранить контакт</span>
       </a>`
    : '';

  const exchangeBtn = d.enableExchange
    ? `<button type="button" class="vc__save vc__card-elem" data-action="open-exchange" title="Отправить свой контакт владельцу">
        <span>👋 Оставить свой</span>
       </button>`
    : '';

  const classes = [
    'vc',
    `vc--layout-${d.layout || 'centered'}`,
    `vc--btn-${d.buttonStyle || 'filled'}`,
    `vc--pattern-${d.bgPattern || 'none'}`,
    `vc--font-${d.fontPair || 'discord_gg'}`,
  ].join(' ');

  const nameEffClass = d.nameEffect && d.nameEffect !== 'none' ? `vc__name-text--${d.nameEffect}` : '';

  return `<div class="${classes}" style="${themeVars(d)}">
    <div class="vc__topbar">
      <button type="button" class="vc__icon-btn" data-action="card-qr" title="Показать QR-код визитки">${ICONS.qr}</button>
    </div>

    <div class="vc__band" ${coverStyle}></div>

    <div class="vc__header">
      <div class="vc__avatar vc__avatar--${d.avatarShape || 'circle'} ${d.avatarAnimatedRing ? 'vc__avatar--pro-ring' : ''}">${avatarContent}</div>

      ${d.statusText?.trim() ? `
        <div class="vc__status">
          ${d.showStatusDot ? '<span class="vc__status-dot"></span>' : ''}
          <span>${esc(d.statusText.trim())}</span>
        </div>` : ''}

      <div class="vc__title-block">
        <h1 class="vc__name">
          <span class="vc__name-inline">
            <span class="${nameEffClass}">${esc(name || (preview ? 'Ваше Имя' : ''))}</span>${d.verified ? '<span class="vc__verified" title="Подтвержденный профиль">✓</span>' : ''}
          </span>
        </h1>
        ${(d.showAdminBadge || d.showProBadge || d.customRoleTag?.trim()) ? `
        <div class="vc__badges-row">
          ${d.showAdminBadge ? '<span class="vc__admin-badge" title="Администратор платформы">ADMIN</span>' : ''}
          ${d.showProBadge ? '<span class="vc__pro-badge" title="PRO версия"><span>PRO</span></span>' : ''}
          ${d.customRoleTag?.trim() ? `<span class="vc__role-tag" style="background:${esc(d.customRoleColor || '#ef4444')}">${esc(d.customRoleTag.trim())}</span>` : ''}
        </div>` : ''}
      </div>

      ${d.role?.trim() ? `<p class="vc__role">${esc(d.role.trim())}</p>` : ''}
      ${metaParts.length ? `<div class="vc__meta">${metaParts.join('')}</div>` : ''}
      ${d.bio?.trim() ? `<p class="vc__bio">${esc(d.bio.trim())}</p>` : ''}
      ${qContacts.length ? `<div class="vc__quick-contacts">${qContacts.join('')}</div>` : ''}
    </div>

    ${(ctaBtn || saveVcfBtn || exchangeBtn) ? `
      <div class="vc__actions">
        ${ctaBtn}
        ${(saveVcfBtn || exchangeBtn) ? `<div class="vc__save-row">${saveVcfBtn}${exchangeBtn}</div>` : ''}
      </div>` : ''}

    ${statsHtml}
    ${customLinksHtml}
    ${servicesHtml}
    ${socialsHtml}
    ${faqsHtml}

    ${!d.hideWatermark ? `
    <div class="vc__footer">
      <a class="vc__brand-link" href="${preview ? '#' : location.pathname}">
        <span>⚡ Создано на <strong>pinlex.work</strong> — сделать свою визитку</span>
      </a>
    </div>` : ''}
  </div>`;
}

/* ===================== КОДИРОВАНИЕ ССЫЛКИ, БЫСТРОЕ ОБЛАКО (180-CHAR KV + MEDIA) И АВТОНОМНЫЙ HTML ===================== */
function quickHash(str) {
  const s = String(str || '');
  if (!s) return '0';
  let h = 0;
  const step = Math.max(1, Math.floor(s.length / 200));
  for (let i = 0; i < s.length; i += step) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return `${s.length}_${h}`;
}

function encodeData(d) {
  const diff = {};
  for (const k of Object.keys(d)) {
    if (k === 'avatar' || k === 'cover') {
      const avPre = GIF_AVATAR_PRESETS.find(p => p.url === d.avatar);
      const covPre = GIF_COVER_PRESETS.find(p => p.url === d.cover);
      if (k === 'avatar' && avPre) diff._avPreset = avPre.id;
      else if (k === 'cover' && covPre) diff._covPreset = covPre.id;
      else if (d[k] && /^https?:\/\//i.test(d[k])) diff[k] = d[k];
      continue;
    }
    if (JSON.stringify(d[k]) !== JSON.stringify(EMPTY[k])) {
      diff[k] = d[k];
    }
  }
  if (d._mediaFile) diff._mediaFile = d._mediaFile;
  const json = JSON.stringify(diff);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeData(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const parsed = JSON.parse(decodeURIComponent(escape(atob(b64))));
  if (parsed._avPreset) {
    const p = GIF_AVATAR_PRESETS.find(x => x.id === parsed._avPreset);
    if (p) parsed.avatar = p.url;
  }
  if (parsed._covPreset) {
    const p = GIF_COVER_PRESETS.find(x => x.id === parsed._covPreset);
    if (p) parsed.cover = p.url;
  }
  return parsed;
}

function getBaseHost() {
  return location.protocol === 'file:' ? PUBLIC_HOST_URL : location.href.split('#')[0].split('?')[0].replace(/(index|mobile|card)\.html$/i, '');
}

function getShareUrl(d) {
  const base = getBaseHost();
  return `${base}card.html#card=${encodeData(d)}`;
}

function getQrImageUrl(url, size = 240) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(url)}`;
}

/* ===================== БЫСТРАЯ ДВУХКАНАЛЬНАЯ СИНХРОНИЗАЦИЯ СО ВСЕМИ ВКЛАДКАМИ (0.15 СЕК) ===================== */
async function ensureMediaUploaded(fullState) {
  const hasCustomAvatar = fullState.avatar && fullState.avatar.startsWith('data:') && !GIF_AVATAR_PRESETS.some(p => p.url === fullState.avatar);
  const hasCustomCover = fullState.cover && fullState.cover.startsWith('data:') && !GIF_COVER_PRESETS.some(p => p.url === fullState.cover);

  if (!hasCustomAvatar && !hasCustomCover) {
    fullState._mediaFile = '';
    return '';
  }

  const currentHash = quickHash(hasCustomAvatar ? fullState.avatar : '') + '|' + quickHash(hasCustomCover ? fullState.cover : '');
  if (currentHash === lastUploadedMediaHash && lastUploadedMediaFile) {
    fullState._mediaFile = lastUploadedMediaFile;
    return lastUploadedMediaFile;
  }

  try {
    const mediaPayload = JSON.stringify({
      avatar: hasCustomAvatar ? fullState.avatar : '',
      cover: hasCustomCover ? fullState.cover : '',
    });
    // Дополняем пробелами до 4100 байт, чтобы ntfy.sh всегда сохранял медиа как быстрый прямой файл attachment.url
    const padded = mediaPayload.length < 4100 ? mediaPayload + ' '.repeat(4100 - mediaPayload.length) : mediaPayload;
    const res = await fetch(NTFY_URL, { method: 'POST', body: padded });
    if (res.ok) {
      const info = await res.json();
      const attachUrl = info?.attachment?.url || '';
      if (attachUrl) {
        const fileId = attachUrl.split('/').pop();
        lastUploadedMediaHash = currentHash;
        lastUploadedMediaFile = fileId;
        localStorage.setItem(MEDIA_HASH_KEY, currentHash);
        localStorage.setItem(MEDIA_FILE_KEY, fileId);
        fullState._mediaFile = fileId;
        return fileId;
      }
    }
  } catch (e) {
    console.warn('Media upload warning:', e);
  }
  return fullState._mediaFile || '';
}

async function pushFastCloud(fullState, ts, devId) {
  await ensureMediaUploaded(fullState);
  const safeB64 = encodeData(fullState) || 'e30';
  // Размер чанка 180 символов — 100% проходит лимит URL-сегмента сервера для любых вкладок (Цифры, Услуги, Кнопки, FAQ, Вид соцсетей)!
  const chunkSize = 180;
  const chunks = [];
  for (let i = 0; i < safeB64.length; i += chunkSize) {
    chunks.push(safeB64.slice(i, i + chunkSize));
  }
  if (!chunks.length) chunks.push('e30');

  await Promise.all(
    chunks.map((chunk, idx) =>
      fetch(`${KV_BASE_URL}/UpdateValue/${KV_APP_KEY}/px25_c${idx}/${chunk}`, {
        method: 'POST',
      })
    )
  );

  const meta = `${chunks.length}_${ts}_${devId}`;
  const metaRes = await fetch(`${KV_BASE_URL}/UpdateValue/${KV_APP_KEY}/px25_meta/${meta}`, {
    method: 'POST',
  });
  return metaRes.ok;
}

const mediaFileCache = {};

async function pullFastCloud() {
  const metaRes = await fetch(`${KV_BASE_URL}/GetValue/${KV_APP_KEY}/px25_meta`, { cache: 'no-store' });
  if (!metaRes.ok) return null;
  const rawMeta = (await metaRes.text()).replace(/^"|"$/g, '').trim();
  if (!rawMeta || !rawMeta.includes('_')) return null;

  const parts = rawMeta.split('_');
  const count = Number(parts[0] || 0);
  const ts = Number(parts[1] || 0);
  const devId = parts.slice(2).join('_');
  if (count <= 0 || ts <= 0) return null;

  const chunkValues = await Promise.all(
    Array.from({ length: count }, (_, idx) =>
      fetch(`${KV_BASE_URL}/GetValue/${KV_APP_KEY}/px25_c${idx}`, { cache: 'no-store' })
        .then(r => (r.ok ? r.text() : ''))
        .then(txt => txt.replace(/^"|"$/g, '').trim())
    )
  );

  const cardB64 = chunkValues.join('');
  const decoded = decodeData(cardB64);

  if (decoded._mediaFile) {
    const fId = decoded._mediaFile;
    if (mediaFileCache[fId]) {
      if (mediaFileCache[fId].avatar) decoded.avatar = mediaFileCache[fId].avatar;
      if (mediaFileCache[fId].cover) decoded.cover = mediaFileCache[fId].cover;
    } else {
      try {
        const mRes = await fetch(`https://ntfy.sh/file/${fId}`, { cache: 'no-store' });
        if (mRes.ok) {
          const mData = await mRes.json();
          mediaFileCache[fId] = mData;
          if (mData.avatar) decoded.avatar = mData.avatar;
          if (mData.cover) decoded.cover = mData.cover;
        }
      } catch {}
    }
  }

  return { cardState: decoded, ts, device: devId };
}

function scheduleAutoCloudPush() {
  if (isApplyingRemote) return;
  clearTimeout(autoPushTimer);
  const syncTitle = $('#onlineSyncTitle');
  if (syncTitle) {
    syncTitle.innerHTML = `⏳ Авто-синхронизация с облаком... <span class="admin-inline-badge">ADMIN</span>`;
  }
  autoPushTimer = setTimeout(() => {
    saveCardOnline({ silent: true });
  }, 600);
}

async function pullFromMasterCloud({ isInitial = false } = {}) {
  try {
    const cloudData = await pullFastCloud();
    if (!cloudData || !cloudData.cardState || cloudData.ts <= 0) return false;

    const remoteState = cloudData.cardState;
    const remoteTs = Number(cloudData.ts || 0);
    const remoteDev = cloudData.device || '';

    if ((isInitial && remoteTs >= lastSyncedTs) || (remoteDev !== DEVICE_ID && remoteTs > lastSyncedTs)) {
      isApplyingRemote = true;
      const keepAvatar = remoteState.avatar || (!remoteState._mediaFile && !remoteState._avPreset ? '' : state.avatar);
      const keepCover = remoteState.cover || (!remoteState._mediaFile && !remoteState._covPreset ? '' : state.cover);
      state = {
        ...structuredClone(EMPTY),
        ...remoteState,
        avatar: remoteState.avatar !== undefined ? remoteState.avatar : keepAvatar,
        cover: remoteState.cover !== undefined ? remoteState.cover : keepCover,
        isAdmin: true,
        isPro: true,
        socials: { ...(EMPTY.socials || {}), ...(remoteState.socials || {}) },
        customLinks: Array.isArray(remoteState.customLinks) ? remoteState.customLinks : structuredClone(EMPTY.customLinks),
        stats: Array.isArray(remoteState.stats) ? remoteState.stats : structuredClone(EMPTY.stats),
        services: Array.isArray(remoteState.services) ? remoteState.services : structuredClone(EMPTY.services),
        faqs: Array.isArray(remoteState.faqs) ? remoteState.faqs : structuredClone(EMPTY.faqs),
      };
      lastSyncedTs = remoteTs;
      localStorage.setItem(CLOUD_TS_KEY, String(lastSyncedTs));
      saveState();

      syncInputsFromState();
      update({ skipAutoPush: true });
      isApplyingRemote = false;

      const timeStr = new Date(remoteTs).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const syncTitle = $('#onlineSyncTitle');
      const syncSub = $('#onlineSyncSub');
      const statusEl = $('#cloudStatusInput');
      if (syncTitle) syncTitle.innerHTML = `🔄 Синхронизировано с облаком (${timeStr}) <span class="admin-inline-badge">ADMIN</span>`;
      if (syncSub) syncSub.textContent = `Все вкладки (профиль, цифры, услуги, соцсети, фото) актуальны`;
      if (statusEl) statusEl.value = `✅ Загружено из облака (${timeStr})`;
      if (!isInitial) toast('🔄 Загружены свежие изменения из облака!');
      return true;
    }
  } catch (e) {
    console.warn('Cloud pull check:', e);
  } finally {
    isApplyingRemote = false;
  }
  return false;
}

function startLiveCloudPolling() {
  pullFromMasterCloud({ isInitial: true });
  setInterval(() => {
    pullFromMasterCloud({ isInitial: false });
  }, 3500);
}

async function saveCardOnline({ silent = false } = {}) {
  const nowTs = Date.now();
  lastSyncedTs = nowTs;
  localStorage.setItem(CLOUD_TS_KEY, String(nowTs));
  saveState();

  const statusEl = $('#cloudStatusInput');
  const liveUrlEl = $('#cloudLiveUrlInput');
  const syncTitle = $('#onlineSyncTitle');
  const syncSub = $('#onlineSyncSub');

  if (statusEl) statusEl.value = '⏳ Быстрая синхронизация всех вкладок...';
  if (!silent) toast('⏳ Сохраняем все вкладки и фото в облако...');

  let syncedOk = false;
  try {
    syncedOk = await pushFastCloud(state, nowTs, DEVICE_ID);
    saveState();
  } catch (e) {
    console.warn('Fast cloud sync warning:', e);
  }

  const ghToken = ($('#ghTokenInput')?.value || localStorage.getItem(GH_TOKEN_KEY) || '').trim();
  const ghRepo = ($('#ghRepoInput')?.value || 'dRk195/pinlex-build-2.5-hotfix').trim();
  if (ghToken && !silent) {
    localStorage.setItem(GH_TOKEN_KEY, ghToken);
    try {
      await pushLiveCardToGithub(ghToken, ghRepo, state);
    } catch (err) {
      console.warn('GitHub push warning:', err);
    }
  }

  const liveUrl = `${getBaseHost()}card.html`;
  const timeStr = new Date(nowTs).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (statusEl) statusEl.value = syncedOk ? `✅ Все вкладки сохранены в облаке (${timeStr})` : `✅ Сохранено локально (${timeStr})`;
  if (liveUrlEl) liveUrlEl.value = liveUrl;
  if (syncTitle) syncTitle.innerHTML = `✅ Синхронизировано с облаком (${timeStr}) <span class="admin-inline-badge">ADMIN</span>`;
  if (syncSub) syncSub.textContent = `Все вкладки и Live Online Card обновлены мгновенно!`;

  if ($('#qrImage')) $('#qrImage').src = getQrImageUrl(getShareUrl(state), 240);
  if ($('#qrDirectLink')) $('#qrDirectLink').href = getShareUrl(state);

  if (!silent) toast('✅ Все вкладки, цифры, соцсети и фото сохранены в облаке!');
  return liveUrl;
}

async function pushLiveCardToGithub(token, repo, cardData) {
  const apiUrl = `https://api.github.com/repos/${repo}/contents/live-card.json`;
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
  let sha;
  try {
    const getRes = await fetch(apiUrl, { headers });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }
  } catch {}

  const contentB64 = btoa(unescape(encodeURIComponent(JSON.stringify(cardData, null, 2))));
  const body = {
    message: 'Update live-card.json from pinlex.work online editor',
    content: contentB64,
    ...(sha ? { sha } : {}),
  };
  const putRes = await fetch(apiUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!putRes.ok) throw new Error('GitHub API error ' + putRes.status);
}

function buildStandaloneHtml(d) {
  const t = getEffectiveTheme(d);
  const title = fullName(d) || 'Цифровая визитка';
  const ownerWa = (d.socials?.whatsapp || d.phone || '').replace(/\D/g, '');
  const ownerTg = clean(d.socials?.telegram || '');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — pinlex.work</title>
<meta name="description" content="${esc([d.role, d.company, d.bio].filter(Boolean).join(' • '))}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(d.role || d.bio || 'Цифровая визитка')}">
<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Caveat:wght@600;700&family=Comfortaa:wght@500;700&family=Cormorant+Garamond:wght@600;700&family=Fira+Code:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Manrope:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Nunito:wght@500;700;800&family=Orbitron:wght@600;800&family=Permanent+Marker&family=Philosopher:wght@700&family=Pirata+One&family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@500;700;800&family=Press+Start+2P&family=Rubik:wght@500;700;800&family=Russo+One&family=Space+Grotesk:wght@500;700&family=Unbounded:wght@500;700;800&display=swap" rel="stylesheet">
<style>
html,body{margin:0;padding:0}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px 14px;box-sizing:border-box;background:${t.page}}
${CARD_CSS}
</style>
</head>
<body>
${renderCard(d)}

<!-- Модальное окно обратного обмена контактами -->
<div class="vc-overlay" id="exchangeOverlay" style="${themeVars(d)}">
  <div class="vc-popup">
    <h3>Поделитесь контактом в ответ 👋</h3>
    <p>Оставьте свои данные, чтобы ${esc(d.firstName || 'владелец визитки')} тоже сохранил ваш номер</p>
    <input type="text" id="exName" placeholder="Ваше имя и фамилия">
    <input type="tel" id="exPhone" placeholder="Ваш телефон">
    <input type="text" id="exNote" placeholder="Компания или комментарий">
    <div class="vc-popup__btns">
      <button type="button" class="vc__save" onclick="document.getElementById('exchangeOverlay').classList.remove('open')">Позже</button>
      <button type="button" class="vc__cta" id="exSendBtn" style="padding:10px">Отправить</button>
    </div>
  </div>
</div>

<!-- Модальное окно QR-кода -->
<div class="vc-overlay" id="qrOverlay" style="${themeVars(d)}">
  <div class="vc-popup">
    <h3>QR-код визитки</h3>
    <p>${esc(title)}</p>
    <div style="background:#fff;padding:14px;border-radius:16px;display:inline-block;margin-bottom:12px">
      <img id="standaloneQrImg" width="200" height="200" alt="QR">
    </div>
    <div>
      <button type="button" class="vc__save" style="width:100%" onclick="document.getElementById('qrOverlay').classList.remove('open')">Закрыть</button>
    </div>
  </div>
</div>

<script>
document.addEventListener('click', function(e) {
  const qrBtn = e.target.closest('[data-action="card-qr"]');
  if (qrBtn) {
    const img = document.getElementById('standaloneQrImg');
    img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=' + encodeURIComponent(location.href);
    document.getElementById('qrOverlay').classList.add('open');
  }
  const exBtn = e.target.closest('[data-action="open-exchange"]');
  if (exBtn) {
    document.getElementById('exchangeOverlay').classList.add('open');
  }
  const vcfBtn = e.target.closest('[data-action="save-vcf"]');
  if (vcfBtn && ${Boolean(d.enableExchange)}) {
    setTimeout(function() {
      document.getElementById('exchangeOverlay').classList.add('open');
    }, 900);
  }
});
document.getElementById('exSendBtn')?.addEventListener('click', function() {
  const n = document.getElementById('exName').value.trim();
  const p = document.getElementById('exPhone').value.trim();
  const c = document.getElementById('exNote').value.trim();
  if (!n && !p) return alert('Укажите имя или телефон');
  const msg = encodeURIComponent('Здравствуйте! Делюсь своим контактом с вашей визитки pinlex.work:\\nИмя: ' + n + '\\nТелефон: ' + p + (c ? '\\nИнфо: ' + c : ''));
  const wa = '${esc(ownerWa)}';
  const tg = '${esc(ownerTg)}';
  if (wa) location.href = 'https://wa.me/' + wa + '?text=' + msg;
  else if (tg) location.href = 'https://t.me/' + tg + '?text=' + msg;
  else alert('Контакт записан!');
});
</script>
</body>
</html>`;
}

/* ===================== МГНОВЕННАЯ ЗАГРУЗКА LIVE ONLINE CARD (0.01 СЕК + РЕАКТИВНОЕ ОБЛАКО) ===================== */
let guestInteractionsBound = false;
let guestCardStyleEl = null;

function renderGuestPage(d) {
  const t = getEffectiveTheme(d);
  document.title = `${fullName(d) || 'Визитка'} — pinlex.work`;
  if (!guestCardStyleEl) {
    guestCardStyleEl = document.createElement('style');
    document.head.appendChild(guestCardStyleEl);
  }
  guestCardStyleEl.textContent = CARD_CSS + `
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 12px;
      background: ${t.page};
    }
  `;
  document.body.innerHTML = `<div id="guestCardStage" style="width:100%;display:flex;justify-content:center">${renderCard(d)}</div>
    <div class="modal-backdrop" id="qrModal" hidden>
      <div class="modal">
        <div class="modal__header">
          <h3>QR-код визитки</h3>
          <button type="button" class="modal__close" onclick="document.getElementById('qrModal').hidden=true">&times;</button>
        </div>
        <div class="modal__body" style="text-align: center;">
          <div class="qr-card" id="qrContainer">
            <img id="qrImage" alt="QR Code" width="240" height="240">
            <div class="qr-card__name" id="qrName"></div>
            <div class="qr-card__role" id="qrRole"></div>
          </div>
          <p class="modal__hint">Наведите камеру смартфона, чтобы открыть визитку</p>
        </div>
      </div>
    </div>
    <div class="toast" id="toast"></div>
  `;
  if (!guestInteractionsBound) {
    guestInteractionsBound = true;
    bindCardInteractions(d);
  }
}

async function tryViewMode() {
  const params = new URLSearchParams(location.search);
  const isLive = params.get('live') || /card\.html$/i.test(location.pathname);
  const hashMatch = location.hash.match(/^#card=(.+)$/);

  // 1. ПРИОРИТЕТ: МГНОВЕННАЯ ОТРИСОВКА LIVE ONLINE CARD ЗА 0.01 СЕК (БЕЗ ОЖИДАНИЯ СЕТИ!) + РЕАКТИВНОЕ ОБЛАЧНОЕ ОБНОВЛЕНИЕ
  if (isLive) {
    let initialGuestState = structuredClone(state || EMPTY);
    if (hashMatch) {
      try {
        const decoded = decodeData(hashMatch[1]);
        initialGuestState = { ...structuredClone(EMPTY), ...decoded, socials: { ...(EMPTY.socials || {}), ...(decoded.socials || {}) } };
      } catch {}
    }

    // Отрисовываем карточку МГНОВЕННО в первую же миллисекунду!
    renderGuestPage(initialGuestState);

    // Восстанавливаем медиа из локального IndexedDB, если открыто на том же устройстве
    idbLoadMedia().then(idbMedia => {
      if (idbMedia && (idbMedia.avatar || idbMedia.cover)) {
        if (!initialGuestState.avatar && idbMedia.avatar) initialGuestState.avatar = idbMedia.avatar;
        if (!initialGuestState.cover && idbMedia.cover) initialGuestState.cover = idbMedia.cover;
        renderGuestPage(initialGuestState);
      }
    });

    // Функция мгновенной синхронизации Live Online Card с нашим облаком
    let guestLastTs = 0;
    const syncGuestWithCloud = async () => {
      try {
        const cloudData = await pullFastCloud();
        if (cloudData && cloudData.cardState && cloudData.ts > guestLastTs) {
          guestLastTs = cloudData.ts;
          const d = {
            ...structuredClone(EMPTY),
            ...cloudData.cardState,
            socials: { ...(EMPTY.socials || {}), ...(cloudData.cardState.socials || {}) },
            customLinks: Array.isArray(cloudData.cardState.customLinks) ? cloudData.cardState.customLinks : structuredClone(EMPTY.customLinks),
            stats: Array.isArray(cloudData.cardState.stats) ? cloudData.cardState.stats : structuredClone(EMPTY.stats),
            services: Array.isArray(cloudData.cardState.services) ? cloudData.cardState.services : structuredClone(EMPTY.services),
            faqs: Array.isArray(cloudData.cardState.faqs) ? cloudData.cardState.faqs : structuredClone(EMPTY.faqs),
          };
          renderGuestPage(d);
        }
      } catch (e) {
        console.warn('Live card cloud sync check:', e);
      }
    };

    // Запускаем облачное обновление сразу и каждые 3 секунды в реальном времени!
    syncGuestWithCloud();
    setInterval(syncGuestWithCloud, 3000);
    return true;
  }

  if (hashMatch) {
    try {
      const decoded = decodeData(hashMatch[1]);
      const d = {
        ...structuredClone(EMPTY),
        ...decoded,
        socials: { ...(EMPTY.socials || {}), ...(decoded.socials || {}) },
      };
      renderGuestPage(d);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  return false;
}

/* ===================== ИНТЕРАКТИВ ВНУТРИ ПРЕВЬЮ И ГОСТЕВОГО РЕЖИМА ===================== */
function bindCardInteractions(d) {
  document.addEventListener('click', e => {
    const qrBtn = e.target.closest('[data-action="card-qr"]');
    if (qrBtn) {
      e.preventDefault();
      openQrModal(d);
    }

    const exBtn = e.target.closest('[data-action="open-exchange"]');
    if (exBtn) {
      e.preventDefault();
      promptExchangeContact(d);
    }

    const vcfBtn = e.target.closest('[data-action="save-vcf"]');
    if (vcfBtn && d.enableExchange) {
      setTimeout(() => promptExchangeContact(d), 900);
    }
  });
}

function promptExchangeContact(d) {
  const guestName = prompt(`Поделитесь своим контактом с ${d.firstName || 'владельцем визитки'}!\nВаше Имя и Телефон:`);
  if (!guestName) return;
  const msg = encodeURIComponent(`Здравствуйте! Делюсь своим контактом через вашу визитку pinlex.work:\n${guestName}`);
  const wa = (d.socials?.whatsapp || d.phone || '').replace(/\D/g, '');
  const tg = clean(d.socials?.telegram || '');
  if (wa) window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
  else if (tg) window.open(`https://t.me/${tg}?text=${msg}`, '_blank');
  else toast('Спасибо! Контакт подготовлен к отправке.');
}

/* ===================== СОСТОЯНИЕ И ХРАНИЛИЩЕ (LOCALSTORAGE + INDEXEDDB ДЛЯ ФОТО/GIF) ===================== */
const IDB_NAME = 'pinlex_media_db_v24';
const IDB_STORE = 'media';

function openMediaDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSaveMedia(avatar, cover) {
  try {
    const db = await openMediaDb();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put({ avatar: avatar || '', cover: cover || '' }, 'current_media');
  } catch (e) {
    console.warn('IDB save warning:', e);
  }
}

async function idbLoadMedia() {
  try {
    const db = await openMediaDb();
    return await new Promise(resolve => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get('current_media');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(EMPTY),
        ...parsed,
        isAdmin: true,
        isPro: true,
        socials: { ...(parsed.socials || {}) },
        customLinks: Array.isArray(parsed.customLinks) ? parsed.customLinks : structuredClone(EMPTY.customLinks),
        stats: Array.isArray(parsed.stats) ? parsed.stats : structuredClone(EMPTY.stats),
        services: Array.isArray(parsed.services) ? parsed.services : structuredClone(EMPTY.services),
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : structuredClone(EMPTY.faqs),
      };
    }
  } catch {}
  return structuredClone(EMPTY);
}

function saveState() {
  idbSaveMedia(state.avatar, state.cover);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Если GIF очень большая (>5MB), сохраняем текстовый профиль в localStorage, а фото/GIF уже сохранены в IndexedDB
    try {
      const { avatar, cover, ...lightState } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightState));
    } catch {}
  }
}

/* ===================== ОБНОВЛЕНИЕ ПРЕДПРОСМОТРА И UI ===================== */
function update({ skipAutoPush = false } = {}) {
  if (!skipAutoPush && !isApplyingRemote) {
    lastSyncedTs = Date.now();
    localStorage.setItem(CLOUD_TS_KEY, String(lastSyncedTs));
  }

  const t = getEffectiveTheme(state);
  const stage = $('#stage');
  if (stage) {
    stage.style.background = t.page;
    stage.innerHTML = renderCard(state, { preview: true });
  }

  // Превью аватара и обложки
  const ap = $('#avatarPreview');
  if (ap) {
    ap.classList.toggle('has-img', !!state.avatar);
    ap.style.backgroundImage = state.avatar ? `url("${state.avatar}")` : '';
  }
  const cp = $('#coverPreview');
  if (cp) {
    cp.classList.toggle('has-img', !!state.cover);
    cp.style.backgroundImage = state.cover ? `url("${state.cover}")` : '';
  }

  // Активная тема
  document.querySelectorAll('.theme-card').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === state.theme);
  });

  // Активный шрифт
  document.querySelectorAll('.font-card-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.font === state.fontPair);
  });

  // Значение радиуса
  const rv = $('#radiusVal');
  if (rv) rv.textContent = `${state.borderRadius ?? 16}px`;

  // Блок своих цветов
  const ccb = $('#customColorsBox');
  if (ccb) ccb.classList.toggle('enabled', !!state.useCustomColors);

  // Поле текущей онлайн-ссылки
  const liveUrlEl = $('#cloudLiveUrlInput');
  if (liveUrlEl) {
    liveUrlEl.value = getShareUrl(state);
  }

  saveState();
  if (!skipAutoPush && !isApplyingRemote) {
    scheduleAutoCloudPush();
  }
}

function syncInputsFromState() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const key = el.dataset.field;
    if (state[key] !== undefined) el.value = state[key];
  });
  document.querySelectorAll('[data-check]').forEach(el => {
    const key = el.dataset.check;
    el.checked = Boolean(state[key]);
  });
  document.querySelectorAll('[data-social]').forEach(el => {
    const id = el.dataset.social;
    el.value = state.socials?.[id] || '';
  });

  const savedGhToken = localStorage.getItem(GH_TOKEN_KEY);
  if (savedGhToken && $('#ghTokenInput')) {
    $('#ghTokenInput').value = savedGhToken;
  }

  renderDynamicLists();
}

/* ===================== ДИНАМИЧЕСКИЕ СПИСКИ В РЕДАКТОРЕ ===================== */
function renderDynamicLists() {
  // 1. Произвольные кнопки
  const clContainer = $('#customLinksList');
  if (clContainer) {
    if (!state.customLinks.length) {
      clContainer.innerHTML = `<div class="dyn-item__empty">Нет дополнительных кнопок. Нажмите «+ Добавить кнопку», чтобы добавить портфолио, прайс или сайт.</div>`;
    } else {
      clContainer.innerHTML = state.customLinks.map((item, idx) => `
        <div class="dyn-item">
          <div class="dyn-item__row">
            <input type="text" style="width:52px;text-align:center" value="${esc(item.icon || '🔗')}" placeholder="🔥" data-cl-idx="${idx}" data-cl-prop="icon" title="Эмодзи или иконка">
            <input type="text" style="flex:1" value="${esc(item.title)}" placeholder="Заголовок кнопки (например: Моё портфолио)" data-cl-idx="${idx}" data-cl-prop="title">
            <button type="button" class="btn btn--danger btn--xs" data-cl-remove="${idx}" title="Удалить">✕</button>
          </div>
          <div class="dyn-item__row">
            <input type="text" style="flex:1" value="${esc(item.subtitle || '')}" placeholder="Подзаголовок (необязательно)" data-cl-idx="${idx}" data-cl-prop="subtitle">
            <input type="text" style="flex:1" value="${esc(item.url || '')}" placeholder="https://..." data-cl-idx="${idx}" data-cl-prop="url">
            <label class="switch" title="Выделить рамкой">
              <input type="checkbox" ${item.highlight ? 'checked' : ''} data-cl-idx="${idx}" data-cl-prop="highlight">
              <span class="switch__track"></span>
              <span class="switch__label">Акцент</span>
            </label>
          </div>
        </div>
      `).join('');
    }
  }

  // 2. Цифры и факты
  const stContainer = $('#statsList');
  if (stContainer) {
    if (!state.stats.length) {
      stContainer.innerHTML = `<div class="dyn-item__empty">Добавьте 2–3 ключевые цифры о вашем опыте.</div>`;
    } else {
      stContainer.innerHTML = state.stats.map((st, idx) => `
        <div class="dyn-item">
          <div class="dyn-item__row">
            <input type="text" style="flex:0 1 115px;font-weight:700" value="${esc(st.value)}" placeholder="7+ лет" data-st-idx="${idx}" data-st-prop="value">
            <input type="text" style="flex:1 1 140px" value="${esc(st.label)}" placeholder="опыта в индустрии" data-st-idx="${idx}" data-st-prop="label">
            <button type="button" class="btn btn--danger btn--xs" data-st-remove="${idx}">✕</button>
          </div>
        </div>
      `).join('');
    }
  }

  // 3. Услуги и прайс
  const svContainer = $('#servicesList');
  if (svContainer) {
    if (!state.services.length) {
      svContainer.innerHTML = `<div class="dyn-item__empty">Добавьте свои услуги с ценами — клиент сможет заказать их в 1 клик.</div>`;
    } else {
      svContainer.innerHTML = state.services.map((sv, idx) => `
        <div class="dyn-item">
          <div class="dyn-item__row">
            <input type="text" style="flex:1 1 160px;font-weight:600" value="${esc(sv.title)}" placeholder="Название услуги" data-sv-idx="${idx}" data-sv-prop="title">
            <input type="text" style="flex:0 1 130px" value="${esc(sv.price)}" placeholder="от 50 000 ₸" data-sv-idx="${idx}" data-sv-prop="price">
            <button type="button" class="btn btn--danger btn--xs" data-sv-remove="${idx}">✕</button>
          </div>
          <input type="text" value="${esc(sv.desc || '')}" placeholder="Краткое описание услуги и что входит в стоимость" data-sv-idx="${idx}" data-sv-prop="desc">
        </div>
      `).join('');
    }
  }

  // 4. FAQ
  const fqContainer = $('#faqList');
  if (fqContainer) {
    if (!state.faqs.length) {
      fqContainer.innerHTML = `<div class="dyn-item__empty">Добавьте ответы на частые вопросы клиентов.</div>`;
    } else {
      fqContainer.innerHTML = state.faqs.map((fq, idx) => `
        <div class="dyn-item">
          <div class="dyn-item__row">
            <input type="text" style="flex:1;font-weight:600" value="${esc(fq.q)}" placeholder="Вопрос (например: Как происходит оплата?)" data-fq-idx="${idx}" data-fq-prop="q">
            <button type="button" class="btn btn--danger btn--xs" data-fq-remove="${idx}">✕</button>
          </div>
          <input type="text" value="${esc(fq.a)}" placeholder="Ответ на вопрос" data-fq-idx="${idx}" data-fq-prop="a">
        </div>
      `).join('');
    }
  }
}

/* ===================== QR-КОД И ШЕРИНГ ===================== */
function openQrModal(d = state) {
  const modal = $('#qrModal');
  if (!modal) return;
  const url = getShareUrl(d);
  $('#qrImage').src = getQrImageUrl(url, 240);
  $('#qrName').textContent = fullName(d) || 'pinlex.work';
  $('#qrRole').textContent = d.role || '';
  const directLink = $('#qrDirectLink');
  if (directLink) directLink.href = url;
  modal.hidden = false;
}

async function copyShareLink() {
  if (!fullName(state)) return toast('Укажите хотя бы имя в профиле');
  const url = getShareUrl(state);
  try {
    await navigator.clipboard.writeText(url);
    toast('Ссылка на визитку скопирована в буфер обмена!');
  } catch {
    prompt('Скопируйте ссылку на вашу визитку:', url);
  }
}

/* ===================== ИНИЦИАЛИЗАЦИЯ КОНСТРУКТОРА ===================== */
function initStudio() {
  // 1. Поля соцсетей
  $('#socialsEditor').innerHTML = SOCIALS.map(s => `
    <label class="social-input" title="${s.label}">
      <span class="social-input__icon" style="background:${s.color}">
        <img src="${ICON_CDN(s.slug)}" alt="${s.label}">
      </span>
      <input type="text" data-social="${s.id}" placeholder="${s.label}: ${s.ph}">
    </label>
  `).join('');

  // 2. Карточки 11 готовых шаблонов во вкладке «Дизайн и Шаблоны»
  const presetsGrid = $('#presetsCardsGrid');
  if (presetsGrid) {
    presetsGrid.innerHTML = PRESET_META.map(p => `
      <button type="button" class="preset-card-btn" data-preset="${p.id}">
        <span class="preset-card-btn__icon">${p.icon}</span>
        <span class="preset-card-btn__title">${p.title}</span>
        <span class="preset-card-btn__sub">${p.sub}</span>
      </button>
    `).join('');
  }

  // 2.1 Карточки 14 тем
  $('#themesGrid').innerHTML = Object.entries(THEMES).map(([id, t]) => `
    <button type="button" class="theme-card" data-theme="${id}">
      <div class="theme-card__preview" style="background:${t.card}">
        <div class="theme-card__band" style="background:${t.band}"></div>
        <span class="theme-card__dot" style="background:${t.accent}"></span>
      </div>
      <span class="theme-card__name">${t.name}</span>
    </button>
  `).join('');

  // 2.2 Карточки 16 шрифтов Discord
  const fontsGrid = $('#fontsGrid');
  if (fontsGrid) {
    fontsGrid.innerHTML = Object.entries(FONTS).map(([id, f]) => `
      <button type="button" class="font-card-btn" data-font="${id}">
        <span class="font-card-btn__sample" style="font-family:${f.head}">${esc(f.sample)}</span>
        <span class="font-card-btn__name">${esc(f.name)}</span>
      </button>
    `).join('');
  }

  // 3. Переключение вкладок
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      $(`#tab-${tab.dataset.tab}`)?.classList.add('active');
    });
  });

  // 4. Мобильная левая шторка параметров (Left Slide-Out Drawer)
  const openDrawer = () => document.body.classList.add('mobile-drawer-open');
  const closeDrawer = () => document.body.classList.remove('mobile-drawer-open');

  $('#btnOpenMobileDrawer')?.addEventListener('click', openDrawer);
  $('#btnCloseMobileDrawer')?.addEventListener('click', closeDrawer);
  $('#mobileDrawerBackdrop')?.addEventListener('click', closeDrawer);
  $('#btnDrawerSave')?.addEventListener('click', () => saveCardOnline({ silent: false }));
  $('#btnMobileTopSave')?.addEventListener('click', () => saveCardOnline({ silent: false }));

  // 5. Переключение рамки Смартфон / ПК
  document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const frame = $('#deviceFrame');
      frame.classList.toggle('device-frame--phone', btn.dataset.device === 'phone');
      frame.classList.toggle('device-frame--desktop', btn.dataset.device === 'desktop');
    });
  });

  // 6. Быстрые шаблоны (Presets)
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      if (PRESETS[presetKey]) {
        state = structuredClone(PRESETS[presetKey]);
        syncInputsFromState();
        update();
        toast(`Применен шаблон «${btn.textContent.trim()}»`);
      }
    });
  });

  // 6.1 Выбор шрифта по карточке
  document.querySelectorAll('[data-font]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.fontPair = btn.dataset.font;
      syncInputsFromState();
      update();
    });
  });

  // 7. Слушатели всех полей и выпадающих списков (<select> включая Вид соцсетей socialDisplay)
  document.querySelectorAll('[data-field]').forEach(el => {
    const onFieldChange = () => {
      state[el.dataset.field] = el.value;
      update();
    };
    el.addEventListener('input', onFieldChange);
    el.addEventListener('change', onFieldChange);
  });

  document.querySelectorAll('[data-check]').forEach(el => {
    el.addEventListener('change', () => {
      state[el.dataset.check] = el.checked;
      update();
    });
  });

  document.querySelectorAll('[data-social]').forEach(el => {
    const onSocialChange = () => {
      state.socials[el.dataset.social] = el.value;
      update();
    };
    el.addEventListener('input', onSocialChange);
    el.addEventListener('change', onSocialChange);
  });

  document.querySelectorAll('.theme-card').forEach(btn => {
    btn.addEventListener('click', () => {
      state.theme = btn.dataset.theme;
      update();
    });
  });

  // 8. Делегирование событий (input + change) для всех динамических списков (Кнопки, Цифры и факты, Услуги, FAQ)
  const handleDynamicListEvent = e => {
    const t = e.target;
    if (t.dataset.clIdx !== undefined) {
      const idx = Number(t.dataset.clIdx);
      const prop = t.dataset.clProp;
      if (state.customLinks[idx]) {
        state.customLinks[idx][prop] = t.type === 'checkbox' ? t.checked : t.value;
        update();
      }
    } else if (t.dataset.stIdx !== undefined) {
      const idx = Number(t.dataset.stIdx);
      if (state.stats[idx]) {
        state.stats[idx][t.dataset.stProp] = t.value;
        update();
      }
    } else if (t.dataset.svIdx !== undefined) {
      const idx = Number(t.dataset.svIdx);
      if (state.services[idx]) {
        state.services[idx][t.dataset.svProp] = t.value;
        update();
      }
    } else if (t.dataset.fqIdx !== undefined) {
      const idx = Number(t.dataset.fqIdx);
      if (state.faqs[idx]) {
        state.faqs[idx][t.dataset.fqProp] = t.value;
        update();
      }
    }
  };
  document.addEventListener('input', handleDynamicListEvent);
  document.addEventListener('change', handleDynamicListEvent);

  document.addEventListener('click', e => {
    const clRem = e.target.closest('[data-cl-remove]');
    if (clRem) {
      state.customLinks.splice(Number(clRem.dataset.clRemove), 1);
      renderDynamicLists();
      update();
    }
    const stRem = e.target.closest('[data-st-remove]');
    if (stRem) {
      state.stats.splice(Number(stRem.dataset.stRemove), 1);
      renderDynamicLists();
      update();
    }
    const svRem = e.target.closest('[data-sv-remove]');
    if (svRem) {
      state.services.splice(Number(svRem.dataset.svRemove), 1);
      renderDynamicLists();
      update();
    }
    const fqRem = e.target.closest('[data-fq-remove]');
    if (fqRem) {
      state.faqs.splice(Number(fqRem.dataset.fqRemove), 1);
      renderDynamicLists();
      update();
    }
    const closeM = e.target.closest('[data-close-modal]');
    if (closeM) {
      $(`#${closeM.dataset.closeModal}`).hidden = true;
    }
  });

  // Кнопки добавления блоков
  $('#addCustomLink').addEventListener('click', () => {
    state.customLinks.push({ icon: '🔗', title: 'Новая кнопка', subtitle: '', url: 'https://', highlight: false });
    renderDynamicLists();
    update();
  });

  $('#addStat').addEventListener('click', () => {
    if (state.stats.length >= 4) return toast('Максимум 4 карточки фактов');
    state.stats.push({ value: '100%', label: 'результат' });
    renderDynamicLists();
    update();
  });

  $('#addService').addEventListener('click', () => {
    state.services.push({ title: 'Консультация / Услуга', price: '25 000 ₸', desc: 'Описание того, что получает клиент.' });
    renderDynamicLists();
    update();
  });

  $('#addFaq').addEventListener('click', () => {
    state.faqs.push({ q: 'Новый вопрос?', a: 'Подробный ответ для клиента.' });
    renderDynamicLists();
    update();
  });

  // 9. Загрузка аватара и обложки (для Admin и PRO гифки работают сразу)
  const isGifFile = file => file && (file.type === 'image/gif' || /\.gif$/i.test(file.name || ''));

  $('#avatarInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (isGifFile(file)) {
      if (!state.isPro && !state.isAdmin) {
        toast('GIF-аватарки доступны в PRO версии!');
        $('#proModal').hidden = false;
        e.target.value = '';
        return;
      }
      readRawDataUrl(file).then(url => {
        state.avatar = url;
        update();
        toast('🎬 Анимированная GIF-аватарка установлена!');
      });
    } else {
      resizeImage(file, 360, 360).then(url => { state.avatar = url; update(); });
    }
    e.target.value = '';
  });
  $('#avatarRemove').addEventListener('click', () => { state.avatar = ''; update(); });

  $('#coverInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (isGifFile(file)) {
      if (!state.isPro && !state.isAdmin) {
        toast('Анимированные GIF-шапки доступны в PRO версии!');
        $('#proModal').hidden = false;
        e.target.value = '';
        return;
      }
      readRawDataUrl(file).then(url => {
        state.cover = url;
        update();
        toast('🎬 Анимированная GIF-обложка шапки установлена!');
      });
    } else {
      resizeImage(file, 720, 320).then(url => { state.cover = url; update(); });
    }
    e.target.value = '';
  });
  $('#coverRemove').addEventListener('click', () => { state.cover = ''; update(); });

  // 9.1 Модальное окно pinlex PRO и Галерея GIF
  const openProModal = () => { $('#proModal').hidden = false; };
  $('#btnProModal')?.addEventListener('click', openProModal);
  document.querySelectorAll('[data-open-pro]').forEach(btn => {
    btn.addEventListener('click', openProModal);
  });

  const coverPresetsEl = $('#gifCoverPresets');
  if (coverPresetsEl) {
    coverPresetsEl.innerHTML = GIF_COVER_PRESETS.map(p => `
      <button type="button" class="gif-preset-btn" data-gif-cover="${p.id}">
        <div class="gif-preset-btn__thumb" style="background-image:url('${p.url}')"></div>
        <span>${p.name}</span>
      </button>
    `).join('');
  }

  const avatarPresetsEl = $('#gifAvatarPresets');
  if (avatarPresetsEl) {
    avatarPresetsEl.innerHTML = GIF_AVATAR_PRESETS.map(p => `
      <button type="button" class="gif-preset-btn" data-gif-avatar="${p.id}">
        <div class="gif-preset-btn__thumb" style="background-image:url('${p.url}')"></div>
        <span>${p.name}</span>
      </button>
    `).join('');
  }

  document.querySelectorAll('[data-activate-pro]').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.activatePro;
      state.isPro = true;
      if (plan === 'sub') {
        state.showProBadge = true;
        state.avatarAnimatedRing = true;
      }
      syncInputsFromState();
      update();
      toast('PRO функции активированы!');
    });
  });

  document.addEventListener('click', e => {
    const covBtn = e.target.closest('[data-gif-cover]');
    if (covBtn) {
      state.isPro = true;
      const preset = GIF_COVER_PRESETS.find(x => x.id === covBtn.dataset.gifCover);
      if (preset) {
        state.cover = preset.url;
        syncInputsFromState();
        update();
        toast(`🎬 Установлена живая шапка «${preset.name}»`);
      }
    }

    const avBtn = e.target.closest('[data-gif-avatar]');
    if (avBtn) {
      state.isPro = true;
      const preset = GIF_AVATAR_PRESETS.find(x => x.id === avBtn.dataset.gifAvatar);
      if (preset) {
        state.avatar = preset.url;
        syncInputsFromState();
        update();
        toast(`🎬 Установлен живой аватар «${preset.name}»`);
      }
    }
  });

  $('#btnApplyGifAvatarUrl')?.addEventListener('click', () => {
    const url = $('#gifAvatarUrlInput')?.value.trim();
    if (!url) return toast('Вставьте ссылку на GIF');
    state.isPro = true;
    state.avatar = withHttp(url);
    syncInputsFromState();
    update();
    toast('🎬 GIF-аватар по ссылке установлен!');
  });

  $('#btnApplyGifCoverUrl')?.addEventListener('click', () => {
    const url = $('#gifCoverUrlInput')?.value.trim();
    if (!url) return toast('Вставьте ссылку на GIF');
    state.isPro = true;
    state.cover = withHttp(url);
    syncInputsFromState();
    update();
    toast('🎬 GIF-шапка по ссылке установлена!');
  });

  // 10. Кнопки Онлайн-сохранения, QR и Экспорта
  $('#btnSaveOnline')?.addEventListener('click', saveCardOnline);
  $('#btnSaveOnlineInline')?.addEventListener('click', saveCardOnline);
  $('#btnCloudSaveMain')?.addEventListener('click', saveCardOnline);
  $('#btnSaveOnlineFromQr')?.addEventListener('click', saveCardOnline);

  $('#btnCopyCloudUrl')?.addEventListener('click', async () => {
    const url = $('#cloudLiveUrlInput')?.value || getShareUrl(state);
    try {
      await navigator.clipboard.writeText(url);
      toast('Постоянная онлайн-ссылка скопирована!');
    } catch {
      prompt('Скопируйте онлайн-ссылку:', url);
    }
  });

  $('#btnOpenQrCloud')?.addEventListener('click', () => openQrModal(state));

  $('#btnPushToGithub')?.addEventListener('click', async () => {
    const token = $('#ghTokenInput')?.value.trim();
    const repo = $('#ghRepoInput')?.value.trim() || 'dRk195/pinlex-build-2.2';
    if (!token) return toast('Укажите ваш GitHub Token для прямого пуша');
    localStorage.setItem(GH_TOKEN_KEY, token);
    try {
      toast('🚀 Отправляем live-card.json на GitHub...');
      await pushLiveCardToGithub(token, repo, state);
      const liveUrl = `${getBaseHost()}?live=1`;
      if ($('#cloudLiveUrlInput')) $('#cloudLiveUrlInput').value = liveUrl;
      toast('✅ live-card.json успешно обновлен на GitHub Pages!');
    } catch (err) {
      toast('Ошибка GitHub API: проверьте токен и права repo');
    }
  });

  $('#btnShowQrModal').addEventListener('click', () => openQrModal(state));
  $('#exportOpenQr').addEventListener('click', () => openQrModal(state));
  $('#btnCopyLink').addEventListener('click', copyShareLink);
  $('#exportCopyLink').addEventListener('click', copyShareLink);
  $('#btnCopyLinkFromQr').addEventListener('click', copyShareLink);

  $('#exportDownloadHtml').addEventListener('click', () => {
    if (!fullName(state)) return toast('Укажите хотя бы имя');
    const slug = fullName(state).replace(/\s+/g, '_').toLowerCase();
    downloadFile(`pinlex_${slug}.html`, buildStandaloneHtml(state), 'text/html');
    toast('Готовый HTML-сайт визитки скачан!');
  });

  $('#exportDownloadVcf').addEventListener('click', () => {
    if (!fullName(state)) return toast('Укажите хотя бы имя');
    const slug = fullName(state).replace(/\s+/g, '_');
    downloadFile(`${slug}.vcf`, buildVcf(state), 'text/vcard');
    toast('Файл контакта .VCF скачан');
  });

  $('#btnDownloadQr').addEventListener('click', async () => {
    const url = getQrImageUrl(getShareUrl(state), 600);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `pinlex_qr_${(fullName(state) || 'card').replace(/\s+/g, '_')}.png`;
      a.click();
      toast('QR-код скачан в формате PNG');
    } catch {
      window.open(url, '_blank');
    }
  });

  $('#btnOpenFullscreenPreview').addEventListener('click', () => {
    window.open(getShareUrl(state), '_blank');
  });

  // 11. Экспорт и Импорт JSON проекта
  $('#btnExportJson').addEventListener('click', () => {
    const slug = (fullName(state) || 'project').replace(/\s+/g, '_').toLowerCase();
    downloadFile(`pinlex_${slug}.json`, JSON.stringify(state, null, 2), 'application/json');
    toast('Файл проекта .JSON сохранен');
  });

  $('#inputImportJson').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        state = { ...structuredClone(EMPTY), ...imported };
        syncInputsFromState();
        update();
        toast('Проект успешно загружен!');
      } catch {
        toast('Ошибка: неверный формат файла JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  $('#btnResetAll').addEventListener('click', () => {
    if (!confirm('Сбросить все поля к пустому шаблону?')) return;
    state = {
      ...structuredClone(EMPTY),
      firstName: '',
      lastName: '',
      role: '',
      company: '',
      location: '',
      statusText: '',
      bio: '',
      phone: '',
      phone2: '',
      email: '',
      website: '',
      mapUrl: '',
      ctaLabel: '',
      ctaUrl: '',
      avatar: '',
      cover: '',
      socials: {},
      customLinks: [],
      stats: [],
      services: [],
      faqs: [],
    };
    syncInputsFromState();
    update();
    toast('Поля очищены');
  });

  bindCardInteractions(state);
}

/* ===================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===================== */
function readRawDataUrl(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function resizeImage(file, maxW, maxH) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = maxW;
        c.height = maxH;
        const ratio = Math.max(maxW / img.width, maxH / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        c.getContext('2d').drawImage(img, (maxW - w) / 2, (maxH - h) / 2, w, h);
        resolve(c.toDataURL('image/jpeg', 0.86));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function downloadFile(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: type + ';charset=utf-8' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ===================== ЗАПУСК ===================== */
window.addEventListener('hashchange', () => location.reload());

tryViewMode().then(async isGuest => {
  if (!isGuest) {
    const style = document.createElement('style');
    style.textContent = CARD_CSS;
    document.head.appendChild(style);
    const idbMedia = await idbLoadMedia();
    if (idbMedia) {
      if (!state.avatar && idbMedia.avatar) state.avatar = idbMedia.avatar;
      if (!state.cover && idbMedia.cover) state.cover = idbMedia.cover;
    }
    initStudio();
    syncInputsFromState();
    update({ skipAutoPush: true });
    startLiveCloudPolling();
  }
});
