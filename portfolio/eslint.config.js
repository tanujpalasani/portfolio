import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
	{
		ignores: ["node_modules/**", ".next/**", ".next-dev/**", ".next-build/**", "out/**"],
	},
	...nextCoreWebVitals,
	...nextTypeScript,
];

export default eslintConfig;
