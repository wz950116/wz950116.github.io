/*
 * @Description: 
 * @Author: wangzhen
 * @Date: 2022-02-28 14:15:34
 * @LastEditTime: 2022-02-28 17:55:16
 * @LastEditors: wangzhen
 */

import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import markdown from 'vite-plugin-md';
import Pages from 'vite-plugin-pages'
import hljs from 'highlight.js';
const markdownRenderer = require('markdown-it')();

// https://vitejs.dev/config/
export default defineConfig({
	// base: '/v1/wz950116/dist/',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		}
	},
	plugins: [
		vue({
			include: [/\.vue$/, /\.md$/]
		}),
		markdown({
			markdownItOptions: {
				html: true,
				linkify: true,
				typographer: true,
				xhtmlOut: true,
				highlight: (str, lang) => {
					if (lang && hljs.getLanguage(lang)) {
						try {
							return '<pre class="hljs"><code>' +
								hljs.highlight(lang, str, true).value +
								'</code></pre>';
						} catch (__) { }
					}
					return '<pre class="hljs"><code>' + markdownRenderer.utils.escapeHtml(str) + '</code></pre>';
				}
			},
			wrapperClasses: 'markdown-container'
		}),
		Pages({
			pagesDir: 'src',
			extensions: ['vue', 'md', 'js', 'json']
		})
	]
})