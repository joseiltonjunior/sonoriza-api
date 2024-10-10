import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginPrettier from 'eslint-plugin-prettier' // Adicione a importação do plugin Prettier

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends('@rocketseat/eslint-config/node'),
  {
    plugins: { eslintPluginPrettier }, // Adicione o plugin na configuração
    rules: {
      camelcase: 'off',
      'no-useless-constructor': 'off',
      'prettier/prettier': 'error', // Adicione a regra do Prettier
    },
  },
]
