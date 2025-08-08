import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Simple API development plugin
function apiDevPlugin() {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        try {
          const apiPath = req.url.replace('/api/', '')
          const modulePath = `./api/${apiPath.split('?')[0]}.js`
          
          // Dynamic import the API handler
          const { default: handler } = await import(modulePath)
          
          // Parse query parameters into an object like Vercel does
          const urlParams = new URLSearchParams(req.url.split('?')[1] || '')
          const query = {}
          for (const [key, value] of urlParams.entries()) {
            query[key] = value
          }
          
          // Parse request body for POST requests
          let body = null
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const chunks = []
            for await (const chunk of req) {
              chunks.push(chunk)
            }
            const rawBody = Buffer.concat(chunks).toString()
            try {
              body = JSON.parse(rawBody)
            } catch (e) {
              body = rawBody
            }
          }
          
          // Mock req/res objects to match Vercel API format
          const mockReq = {
            query,
            method: req.method,
            headers: req.headers,
            body: body
          }
          
          // Ensure environment variables are available
          if (!process.env.RESEND_API_KEY) {
            const fs = await import('fs')
            const path = await import('path')
            try {
              const envContent = fs.readFileSync(path.resolve('.env'), 'utf8')
              const lines = envContent.split('\n')
              for (const line of lines) {
                if (line.trim() && !line.startsWith('#')) {
                  const equalIndex = line.indexOf('=')
                  if (equalIndex > 0) {
                    const key = line.substring(0, equalIndex).trim()
                    const value = line.substring(equalIndex + 1).trim()
                    process.env[key] = value
                  }
                }
              }
              console.log('✅ Environment variables loaded')
            } catch (e) {
              console.warn('Could not load .env file:', e.message)
            }
          }
          
          const mockRes = {
            status: (code) => ({ 
              json: (data) => {
                res.statusCode = code
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              },
              end: () => {
                res.statusCode = code
                res.end()
              }
            }),
            json: (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            },
            setHeader: (name, value) => {
              res.setHeader(name, value)
            },
            end: (data) => {
              res.end(data)
            }
          }
          
          await handler(mockReq, mockRes)
        } catch (error) {
          console.error('API Error:', error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal Server Error' }))
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    apiDevPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js'
  },
  server: {
    host: true
  },
  build: {
    // Optimize for production
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    // Chunk size optimization
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['@headlessui/vue', '@heroicons/vue']
        }
      }
    }
    // Removed minify: 'terser' and terserOptions to use default esbuild
  }
})