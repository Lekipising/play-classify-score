module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --max-warnings=0"],
  "*.{js,jsx}": ["eslint --cache --fix"],
  "*.{js,jsx,ts,tsx,json,css,js}": ["prettier --write"],
  "*.{ts,tsx}": [() => "tsc --skipLibCheck --noEmit", "eslint --cache --fix"],
};
