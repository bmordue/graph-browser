import { fileURLToPath } from 'node:url'

import js from '@eslint/js'
import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import vuePrettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  includeIgnoreFile(
    fileURLToPath(new URL('.gitignore', import.meta.url)),
    'Imported .gitignore patterns'
  ),
  globalIgnores(['**/.*', 'docs/', 'coverage/']),
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  {
    files: ['*.js', '*.cjs', 'api/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ['src/**/*.js', 'src/**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  vuePrettierSkipFormatting
])
