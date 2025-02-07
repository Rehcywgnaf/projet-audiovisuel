const requiredComponents = [
  '@radix-ui/react-select',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-slot',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'lucide-react',
  'recharts'
];

export const checkDependencies = () => {
  const missing = [];
  
  for (const dep of requiredComponents) {
    try {
      require.resolve(dep);
    } catch (e) {
      missing.push(dep);
    }
  }

  if (missing.length > 0) {
    console.warn('Missing dependencies:', missing);
    console.warn('Please install using: npm install ' + missing.join(' '));
  }

  return missing;
};
