// Paleta de cores definida para toda a aplicação
// Mantém consistência visual em todos os dashboards

const colors = {
  // Tons de marrom principal
  darkBrown: '#3e2723',
  brownDarker: '#4e342e',
  brownDark: '#5d4037',
  brownMedium: '#6d4c41',
  brownLight: '#795548',
  brownLighter: '#8d6e63',
  brownLightest: '#a1887f',
  
  // Tons neutros e fundo
  lightBg: '#f5f0e8',
  lightBgAlt: '#faf7f2',
  white: '#fffcf8',
  borderColor: '#e8e0d5',
  textDark: '#4e342e',
  textMedium: '#6d4c41',
  textLight: '#8d6e63',
  textLighter: '#a1887f'
};

const gradients = {
  brownDark: 'linear-gradient(135deg, #3e2723 0%, #4e342e 100%)',
  brown: 'linear-gradient(135deg, #5d4037 0%, #6d4c41 100%)',
  brownMedium: 'linear-gradient(135deg, #6d4c41 0%, #795548 100%)',
  sienna: 'linear-gradient(135deg, #8d6e63 0%, #a1887f 100%)',
  brownToLight: 'linear-gradient(to right, #f5f0e8, #fffcf8)'
};

const chartColors = {
  bars: ['#3e2723', '#4e342e', '#5d4037', '#6d4c41', '#795548'],
  lines: [
    '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', 
    '#6d4c41', '#5d4037', '#4e342e', '#3e2723'
  ],
  statusColors: {
    complete: '#4e342e',
    inProgress: '#a1887f',
    notStarted: '#d7ccc8'
  }
};

const commonStyles = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${colors.lightBg} 0%, ${colors.lightBgAlt} 50%, #efe8dc 100%)`,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px'
  },
  
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  
  statCard: {
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    boxShadow: '0 8px 32px rgba(93, 64, 55, 0.15)',
    position: 'relative',
    overflow: 'hidden'
  },
  
  statCardIcon: { fontSize: '36px', marginBottom: '8px' },
  statCardLabel: { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 },
  statCardValue: { fontSize: '36px', fontWeight: 'bold', margin: '8px 0' },
  statCardSubtitle: { fontSize: '13px', opacity: 0.85 },
  
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  
  chartCard: {
    background: colors.white,
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(93, 64, 55, 0.08)',
    overflow: 'hidden',
    border: `1px solid ${colors.borderColor}`
  },
  
  chartCardHeader: {
    padding: '20px 24px',
    borderBottom: `1px solid ${colors.borderColor}`,
    background: gradients.brownToLight
  },
  
  chartCardTitle: { fontSize: '16px', fontWeight: '600', color: colors.textDark, margin: 0 },
  chartCardSubtitle: { fontSize: '13px', color: colors.textLight, marginTop: '4px' },
  chartCardBody: { padding: '24px' },
  
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  sectionIcon: {
    background: colors.lightBg,
    color: colors.brownDark,
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  tableHeader: { background: gradients.brown, color: 'white' },
  th: { padding: '16px 12px', textAlign: 'left', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '16px 12px', borderBottom: `1px solid ${colors.borderColor}` },
  
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: gradients.sienna,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  pointsBadge: {
    background: gradients.brown,
    color: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: 'bold'
  },
  
  footer: { textAlign: 'center', padding: '32px', color: colors.textLighter, fontSize: '14px' },
  
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: gradients.brownToLight
  },
  
  spinner: {
    width: '50px',
    height: '50px',
    border: `4px solid ${colors.borderColor}`,
    borderTop: `4px solid ${colors.brownLighter}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

export { colors, gradients, chartColors, commonStyles };
